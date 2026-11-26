import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";

interface LibrarianRequestBody {
  message?: string;
  history?: Array<{ role: "user" | "model"; text: string }>;
  catalog?: Array<{
    id: string;
    title: string;
    author: string;
    format: string;
    subject: string;
    ddc: string;
    year: number;
    synopsis: string;
  }>;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.post("/api/librarian", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error:
          "Kunci API Gemini belum dikonfigurasi pada server. Silakan periksa pengaturan Secrets pada panel aplikasi.",
      });
      return;
    }

    const body = req.body as LibrarianRequestBody;
    const userMessage = body.message?.trim();
    if (!userMessage) {
      res.status(400).json({ error: "Pesan pertanyaan tidak boleh kosong." });
      return;
    }

    const catalogList = Array.isArray(body.catalog) ? body.catalog : [];
    const catalogContext = catalogList
      .map(
        (item) =>
          `- [${item.id}] "${item.title}" oleh ${item.author} (${item.format}, Subjek: ${item.subject}, DDC: ${item.ddc}, Tahun: ${item.year}). Sinopsis: ${item.synopsis}`
      )
      .join("\n");

    const systemInstruction = `Anda adalah "Aksara", Pustakawan Digital senior yang hangat, berwawasan luas, dan cermat di Perpustakaan Digital Pustaka Aksara.
Tugas Anda membantu pengunjung mencari rekomendasi bacaan berdasarkan suasana hati (mood), topik riset akademik, atau memberikan ringkasan tematik yang bernas.

Aturan ketat:
1. Selalu jawab dalam bahasa Indonesia yang santun, ringkas, editorial, dan mudah dipahami (maksimal 3-4 paragraf pendek).
2. Jika merekomendasikan koleksi dari katalog Pustaka Aksara di bawah ini, cantumkan ID persis koleksi tersebut pada array "recommendedIds" (maksimal 3 ID yang paling relevan). Jangan mengarang ID yang tidak ada dalam daftar.
3. Sertakan 2-3 saran pertanyaan lanjutan yang singkat dan relevan pada "followUpPrompts".

Daftar Koleksi Katalog Pustaka Aksara:
${catalogContext}`;

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const conversationHistory = Array.isArray(body.history)
        ? body.history.slice(-6).map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.text }],
          }))
        : [];

      const contents = [
        ...conversationHistory,
        {
          role: "user" as const,
          parts: [{ text: userMessage }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description:
                  "Jawaban utama pustakawan dalam bahasa Indonesia yang hangat dan informatif.",
              },
              recommendedIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "Daftar ID koleksi dari katalog yang relevan dengan permintaan pengguna (maksimal 3).",
              },
              followUpPrompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  "2-3 saran pertanyaan lanjutan singkat dalam bahasa Indonesia.",
              },
            },
            required: ["reply", "recommendedIds", "followUpPrompts"],
          },
        },
      });

      const rawText = response.text?.trim() || "{}";
      const parsed = JSON.parse(rawText) as {
        reply?: string;
        recommendedIds?: string[];
        followUpPrompts?: string[];
      };

      const validIds = new Set(catalogList.map((c) => c.id));
      const safeRecommendedIds = Array.isArray(parsed.recommendedIds)
        ? parsed.recommendedIds.filter((id) => validIds.has(id)).slice(0, 3)
        : [];

      res.json({
        reply:
          parsed.reply ||
          "Berikut beberapa koleksi yang paling relevan untuk topik yang Anda cari.",
        recommendedIds: safeRecommendedIds,
        followUpPrompts: Array.isArray(parsed.followUpPrompts)
          ? parsed.followUpPrompts.slice(0, 3)
          : [],
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi layanan AI.";
      console.error("Librarian API error:", err);
      res.status(502).json({
        error: `Asisten Pustakawan sedang tidak dapat memproses permintaan: ${errorMessage}`,
      });
    }
  });

  if (isProduction) {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("/{*splat}", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pustaka Aksara server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
