import { LibraryItem } from "../types/library";

export const LIBRARY_CATALOG: LibraryItem[] = [
  {
    id: "arsitektur-teduh-tropis",
    title: "Arsitektur Teduh Nusantara",
    subtitle: "Ruang, Iklim, dan Memori dalam Bangunan Tropis",
    author: "Raden Wijaya Kusuma",
    authorRole: "Arsitek & Sejarawan Ruang",
    format: "E-Book",
    subject: "Arsitektur & Desain",
    ddc: "720.9598",
    isbnOrIssn: "ISBN 978-623-8142-09-4",
    publisher: "Penerbit Lintas Ruang, Yogyakarta",
    year: 2025,
    language: "Bahasa Indonesia",
    pages: 284,
    licenseStatus: "Tersedia",
    availableCopies: 4,
    totalCopies: 6,
    borrowCount: 1420,
    isEditorsPick: true,
    isTrending: true,
    synopsis:
      "Sebuah telaah mendalam tentang bagaimana masyarakat Nusantara merancang keteduhan sebelum penyejuk udara mekanis hadir. Dari beranda kayu jati yang bernapas hingga teritisan panjang rumah panggung, buku ini merangkum prinsip pasif termal, tata cahaya alami, dan puitika ruang hidup di garis khatulistiwa.",
    coverImage: "/src/assets/images/cover_arsitektur_teduh_1795658003555.jpg",
    coverPalette: {
      bg: "#EFE9DD",
      accent: "#D96B43",
      ink: "#2D5A27",
      motif: "arch",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Bab 01",
        title: "Geometri Keteduhan di Bawah Matahari Vertikal",
        paragraphs: [
          "Di kepulauan khatulistiwa, bangunan tidak pernah dirancang untuk menutup diri dari alam, melainkan untuk menegosiasikan panas, hujan deras, dan embusan angin muson secara bermartabat. Keteduhan bukanlah ketiadaan cahaya; ia adalah cahaya yang telah disaring melalui kisi-kisi kayu, dedaunan pekarangan, dan bayangan atap yang menjorok jauh.",
          "Ketika arsitektur modern diimpor tanpa penyesuaian iklim, dinding kaca menggantikan serambi, dan mesin pendingin mengambil alih peran ventilasi silang. Akibatnya bukan hanya lonjakan konsumsi energi, melainkan hilangnya pengalaman indrawi saat sore turun dan aroma tanah basah menyusup ke ruang keluarga.",
          "Membaca ulang rumah-rumah vernakular dari Kudus, Minangkabau, hingga Tana Toraja memperlihatkan kecerdasan struktural yang lahir dari pengamatan ratusan tahun terhadap lintasan matahari dan arah angin lembah."
        ],
        pullQuote:
          "Keteduhan bukan sekadar suhu yang turun dua derajat; ia adalah ruang jeda tempat mata beristirahat dari silau tropis."
      },
      {
        id: "ch-2",
        number: "Bab 02",
        title: "Serambi Sebagai Ruang Ketiga yang Bernapas",
        paragraphs: [
          "Antara jalan publik yang riuh dan ruang dalam yang intim, beranda atau pendapa berperan sebagai zona penyangga sosial sekaligus termal. Di sinilah tetangga bertukar kabar tanpa harus menembus batas privasi penghuni rumah.",
          "Secara mikroklimat, lantai terakota atau kayu yang teduh di serambi mendinginkan udara sebelum ia masuk melalui jendela krepyak. Konveksi alami bekerja tanpa suara bising kompresor, menciptakan keheningan yang memungkinkan percakapan berlangsung pelan."
        ]
      },
      {
        id: "ch-3",
        number: "Bab 03",
        title: "Material Lokal dan Etika Pemeliharaan",
        paragraphs: [
          "Bambu petung, batu bata ekspose yang dibakar perlahan, dan genteng tanah liat memiliki satu keistimewaan yang sering dilupakan: mereka menua dengan anggun. Lumut tipis di sudut talang bukanlah kerusakan, melainkan catatan waktu yang memeluk bangunan ke dalam lanskap sekitarnya.",
          "Merancang bangunan berkelanjutan hari ini berarti mengembalikan martabat tukang kayu, pengrajin terakota, serta sistem sambungan pasak yang mudah diperbaiki oleh generasi berikutnya."
        ]
      }
    ]
  },
  {
    id: "laut-dan-kertas-aksara",
    title: "Perahu Kertas di Muara Sunyi",
    subtitle: "Catatan Seorang Juru Tulis Pesisir",
    author: "Nadia Prameswari",
    authorRole: "Novelis & Esais Sastra",
    format: "E-Book",
    subject: "Fiksi Sastra",
    ddc: "899.221",
    isbnOrIssn: "ISBN 978-602-4819-77-1",
    publisher: "Pustaka Ombak Timur, Makassar",
    year: 2024,
    language: "Bahasa Indonesia",
    pages: 238,
    licenseStatus: "Tersedia",
    availableCopies: 2,
    totalCopies: 5,
    borrowCount: 1895,
    isEditorsPick: true,
    isTrending: true,
    synopsis:
      "Berlatar pelabuhan kecil di pesisir timur pada pengujung abad ke-19, novel liris ini mengisahkan Laksamana Muda yang pensiun menjadi penyalin naskah dan surat-surat para pelaut yang tak pernah pulang. Setiap lipatan kertas membawa peta rindu, rahasia dagang, dan pergulatan ingatan.",
    coverImage: "/src/assets/images/cover_laut_aksara_1795658004688.jpg",
    coverPalette: {
      bg: "#1D2A3A",
      accent: "#E0C9A6",
      ink: "#FAF8F5",
      motif: "wave",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Bagian I",
        title: "Tinta Garam dan Angin Tenggara",
        paragraphs: [
          "Pada pagi hari ketika kabut muara masih tersangkut di tiang-tiang bagan, Damar membuka laci meja kayu ulinnya dan memeriksa botol tinta cumi yang baru ia racik semalam. Bau anyir laut bercampur dengan wangi kemenyan tipis yang ia gunakan sebagai pengawet kertas.",
          "Di pelabuhan ini, orang-orang datang membawa barang dagangan yang bisa ditimbang: cengkeh, kopra, mutiara, dan kayu cendana. Namun yang paling berat justru surat-surat yang dititipkan kepada nakhoda tanpa alamat penerima yang pasti.",
          "Damar tahu, setiap kalimat yang ia tulis di atas kertas merang adalah jangkar kecil agar nama seseorang tidak ikut tenggelam bersama pasang surut bulan purnama."
        ],
        pullQuote:
          "Laut selalu mengembalikan kayu apung ke pantai, tetapi hanya aksara yang sanggup mengembalikan suara manusia."
      },
      {
        id: "ch-2",
        number: "Bagian II",
        title: "Peta yang Digambar Ulang Setiap Musim",
        paragraphs: [
          "Seorang juru mudi tua pernah berkata kepadanya bahwa karang tidak pernah berpindah, namun arus bawah laut selalu mengubah cara kapal mendekatinya. Begitu pula ingatan seseorang tentang kampung halaman.",
          "Ketika surat ketujuh tiba dari pelabuhan jauh di selatan, Damar mendapati tulisan tangan yang gemetar namun penuh keyakinan. Ia melipat sudut kanan surat itu menjadi bentuk perahu kecil—tanda bagi dirinya sendiri bahwa pesan ini masih menunggu balasan."
        ]
      },
      {
        id: "ch-3",
        number: "Bagian III",
        title: "Mercusuar Tanpa Penjaga",
        paragraphs: [
          "Menjelang senja, lampu minyak di ujung tanjung dinyalakan oleh dua anak nelayan. Cahayanya membelah air gelap yang tenang, memantul pada jendela loteng tempat ratusan bundel catatan kapal tersimpan rapi.",
          "Di halaman terakhir bukunya, Damar menulis satu kalimat singkat untuk pembaca di masa depan: bahwa keberanian paling sunyi adalah tetap menulis meski tahu tidak semua kapal akan berlabuh."
        ]
      }
    ]
  },
  {
    id: "ekologi-flora-tropis",
    title: "Atlas Pakis & Ekologi Hutan Hujan",
    subtitle: "Studi Botani Lapisan Bawah Kanopi Kepulauan",
    author: "Prof. Dr. Hendra Gunawan",
    authorRole: "Ahli Botani & Konservasi",
    format: "Arsip Digital",
    subject: "Sains & Botani",
    ddc: "587.3",
    isbnOrIssn: "ISBN 978-623-5510-32-8",
    publisher: "Balai Herbarium & Arsip Alam, Bogor",
    year: 2023,
    language: "Bahasa Indonesia",
    pages: 342,
    licenseStatus: "Open Access",
    availableCopies: 99,
    totalCopies: 99,
    borrowCount: 960,
    isEditorsPick: true,
    synopsis:
      "Monograf ilmiah bergambar yang mendokumentasikan 140 spesies paku-pakuan (Pteridophyta) dan perannya sebagai bioindikator kesehatan tanah humus di hutan hujan pegunungan Indonesia. Dilengkapi skema lapisan tanah, morfologi spora, dan catatan lapangan abad ke-20 yang telah didigitalisasi.",
    coverImage: "/src/assets/images/cover_ekologi_nusantara_1795658003860.jpg",
    coverPalette: {
      bg: "#E9EAE1",
      accent: "#2D5A27",
      ink: "#3E3228",
      motif: "botanical",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Monograf I",
        title: "Mikrohabitat Lantai Hutan dan Lapisan Humus",
        paragraphs: [
          "Di bawah kanopi hutan hujan tropis yang rapat, hanya kurang dari dua persen cahaya matahari langsung yang berhasil menyentuh lantai hutan. Di ruang remang namun kaya kelembapan inilah kelompok tumbuhan pakis berkembang menjadi arsitek kesuburan tanah.",
          "Akar serabut pakis pohon (Cyathea) mengikat partikel lempung berpasir dan memperlambat limpasan air hujan di lereng curam. Bersama serasah daun yang membusuk perlahan, mereka membentuk lapisan humus gelap yang menjadi reservoir karbon dan hara mikro.",
          "Pengamatan jangka panjang di lereng Gunung Gede dan Pegunungan Muller menunjukkan bahwa hilangnya keragaman pakis epifit kerap mendahului penurunan kelembapan mikro jauh sebelum kerusakan kanopi terlihat dari citra satelit."
        ],
        pullQuote:
          "Lantai hutan adalah perpustakaan biologis tertua; setiap gulungan pucuk pakis muda menyimpan kode adaptasi jutaan tahun."
      },
      {
        id: "ch-2",
        number: "Monograf II",
        title: "Katalog Morfologi Spora dan Pola Venasi",
        paragraphs: [
          "Identifikasi taksonomi pada koleksi herbarium memerlukan kecermatan tinggi dalam mengamati susunan sorus di permukaan bawah ental. Pola vena yang bercabang bebas maupun beranastomosis menjadi penanda evolusioner yang stabil.",
          "Digitalisasi spesimen historis dari tahun 1912 hingga 1985 dalam arsip ini memungkinkan peneliti modern membandingkan pergeseran batas ketinggian tumbuh akibat perubahan suhu rata-rata harian."
        ]
      }
    ]
  },
  {
    id: "filsafat-waktu-senja",
    title: "Risalah Waktu dan Kesadaran Modern",
    subtitle: "Dari Jam Pasir ke Ritme Algoritmik",
    author: "Siti Rahmawati",
    authorRole: "Dosen Filsafat Kebudayaan",
    format: "E-Book",
    subject: "Filsafat & Humaniora",
    ddc: "115",
    isbnOrIssn: "ISBN 978-623-7190-44-0",
    publisher: "Pustaka Cakrawala, Bandung",
    year: 2025,
    language: "Bahasa Indonesia",
    pages: 212,
    licenseStatus: "Tersedia",
    availableCopies: 3,
    totalCopies: 4,
    borrowCount: 1180,
    isEditorsPick: true,
    synopsis:
      "Bagaimana manusia berpindah dari pemahaman waktu yang siklis—mengikuti musim panen dan gerak bintang—menuju waktu linear yang diukur dalam milidetik? Buku ini memadukan filsafat fenomenologi, sejarah instrumen pengukur waktu, dan refleksi tentang bagaimana kita merebut kembali pengalaman durasi yang utuh.",
    coverImage: "/src/assets/images/cover_filsafat_waktu_1795658003940.jpg",
    coverPalette: {
      bg: "#EBE5DA",
      accent: "#D96B43",
      ink: "#262320",
      motif: "compass",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Esai 01",
        title: "Astrolab, Loncatan Detik, dan Hilangnya Senja",
        paragraphs: [
          "Sebelum jam mekanik berdentang di menara kota, waktu adalah sesuatu yang dialami bersama perubahan cahaya langit. Orang membaca siang melalui panjang bayangan pohon kelapa dan merasakan pergantian hari melalui hening yang turun di ladang.",
          "Instrumen seperti astrolab dan jam pasir tidak pernah memisahkan manusia dari gravitasi dan benda langit. Pasir yang jatuh dari ruang kaca atas ke bawah memperlihatkan waktu sebagai proses material yang nyata—bukan angka abstrak yang berkedip di sudut layar.",
          "Dalam budaya percepatan digital, kita sering memiliki lebih banyak alat penghemat waktu, tetapi justru merasa paling miskin akan waktu senggang yang bermakna."
        ],
        pullQuote:
          "Ketika waktu dipotong menjadi unit yang seragam, kita memperoleh ketepatan jadwal, namun sering kehilangan kedalaman pengalaman."
      },
      {
        id: "ch-2",
        number: "Esai 02",
        title: "Membaca Lambat Sebagai Tindakan Etis",
        paragraphs: [
          "Membaca buku secara utuh menuntut kita tunduk pada ritme kalimat orang lain. Ia menolak konsumsi instan. Ketika seseorang menyediakan satu jam penuh tanpa notifikasi untuk menyimak argumen penulis, ia sedang melatih otot kesabaran sipil.",
          "Kecepatan berguna untuk memindahkan data, tetapi kebijaksanaan selalu lahir dari perendaman pikiran dalam durasi yang cukup."
        ]
      }
    ]
  },
  {
    id: "jurnal-ai-etika-2026",
    title: "Jurnal Etika Kecerdasan Buatan & Tata Kelola Data Publik",
    subtitle: "Transparansi Algoritma dalam Layanan Perpustakaan & Kota Cerdas",
    author: "Dr. Bagus Santoso & Mira Lestari",
    authorRole: "Peneliti Pusat Kajian Informatika Sosial",
    format: "Jurnal",
    subject: "Teknologi & Kebijakan",
    ddc: "006.3",
    isbnOrIssn: "ISSN 2746-8821",
    publisher: "Jurnal Kajian Informasi Nusantara",
    volumeIssue: "Vol. 8, No. 2",
    doi: "10.54321/jkin.2026.0802",
    year: 2026,
    language: "Bahasa Indonesia",
    pages: 46,
    licenseStatus: "Open Access",
    availableCopies: 99,
    totalCopies: 99,
    borrowCount: 1340,
    isTrending: true,
    synopsis:
      "Artikel tinjauan sejawat (peer-reviewed) yang mengevaluasi kerangka kerja tata kelola model bahasa besar pada institusi publik dan perpustakaan nasional. Membahas audit bias katalog, perlindungan privasi riwayat baca pemustaka, serta standar sitasi sumber primer.",
    coverPalette: {
      bg: "#2D5A27",
      accent: "#E6DFCF",
      ink: "#FAF8F5",
      motif: "grid",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Abstrak & Pendahuluan",
        title: "Akuntabilitas Epistemik dalam Sistem Rekomendasi Pustaka",
        paragraphs: [
          "Pemanfaatan kecerdasan buatan generatif di perpustakaan digital menawarkan kemudahan penemuan kembali informasi (information retrieval) lintas disiplin. Namun, tanpa pagar tata kelola yang jelas, sistem rekomendasi berisiko memperkuat bias popularitas dan mengabaikan literatur lokal berakses terbatas.",
          "Penelitian ini mengusulkan model 'Kurasi Hibrida' di mana asisten digital selalu menautkan jawabannya secara eksplisit ke metadata terverifikasi (ISBN/ISSN, klasifikasi DDC, dan tautan sumber primer), bukan menghasilkan referensi fiktif.",
          "Data empiris dari tiga perpustakaan universitas menunjukkan bahwa transparansi alasan rekomendasi meningkatkan tingkat peminjaman koleksi arsip langka hingga 38 persen."
        ],
        pullQuote:
          "Teknologi temu kembali yang baik tidak menggantikan otoritas katalog; ia memperluas pintu masuk menuju literatur yang sahih."
      },
      {
        id: "ch-2",
        number: "Metodologi & Temuan",
        title: "Privasi Pemustaka sebagai Prinsip Dasar Arsitektur",
        paragraphs: [
          "Sejarah kepustakawanan selalu menjunjung tinggi kerahasiaan apa yang dibaca oleh seorang warga. Oleh karena itu, pemrosesan kueri pencarian berbasis bahasa alami wajib menerapkan pemisahan identitas pemustaka dari log kueri.",
          "Kami merumuskan lima indikator kesiapan etis bagi pengelola repositori terbuka di Asia Tenggara, mencakup interoperabilitas metadata DC/MARC21 dan hak koreksi penulis."
        ]
      }
    ]
  },
  {
    id: "audio-sejarah-rempah",
    title: "Jejak Jalur Rempah: Dari Banda ke Samudra Hindia",
    subtitle: "Narasi Audio Sejarah Maritim Nusantara",
    author: "Taufik Hidayatullah",
    authorRole: "Sejarawan Maritim & Narator",
    format: "Audiobook",
    subject: "Sejarah Maritim",
    ddc: "959.8",
    isbnOrIssn: "ISBN 978-623-9012-18-5",
    publisher: "Studio Suara Nusantara, Jakarta",
    year: 2024,
    language: "Bahasa Indonesia",
    durationLabel: "6 jam 42 mnt",
    totalAudioSeconds: 1800,
    licenseStatus: "Tersedia",
    availableCopies: 5,
    totalCopies: 8,
    borrowCount: 1640,
    isTrending: true,
    synopsis:
      "Audiobook dokumenter yang menelusuri jaringan pelayaran niaga pala, cengkeh, dan lada sebelum era kolonial Eropa. Dinarasikan dengan lanskap suara pelabuhan tradisional dan kutipan langsung dari catatan kapal pedagang Gujarat, Tiongkok, dan Bugis.",
    coverPalette: {
      bg: "#8A3B23",
      accent: "#F3E6D3",
      ink: "#FAF8F5",
      motif: "wave",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Trek 01",
        title: "Pala dari Kepulauan Vulkanik Kecil",
        durationMinutes: 42,
        paragraphs: [
          "Selama berabad-abad, seluruh dunia mengenal aroma pala dan fuli dari dapur istana hingga apotek pengobatan di Baghdad dan Venesia, tetapi hampir tidak ada orang di luar Nusantara yang tahu koordinat persis pulau tempat pohon Myristica fragrans tumbuh.",
          "Di Kepulauan Banda, abu vulkanik Gunung Api berpadu dengan semprotan garam laut menciptakan tanah subur yang unik. Para pelaut lokal menukar hasil panen dengan kain tenun halus dari Koromandel dan porselen biru-putih dari pelabuhan selatan Tiongkok."
        ],
        pullQuote:
          "Jauh sebelum peta modern digambar, angin muson telah menyambungkan desa-desa rempah dengan pusat peradaban dunia."
      },
      {
        id: "ch-2",
        number: "Trek 02",
        title: "Hukum Laut Amanna Gappa",
        durationMinutes: 38,
        paragraphs: [
          "Perdagangan jarak jauh membutuhkan kepercayaan lintas bahasa. Pada abad ke-17, para pelaut Bugis-Makassar merumuskan kodifikasi hukum pelayaran dan bagi hasil niaga yang dikenal sebagai Ade' Allopi-loping Bicaranna Pabbalu'e.",
          "Naskah tersebut mengatur pembagian risiko jika kapal karam, etika pinjaman modal, hingga tata krama bersandar di bandar asing."
        ]
      },
      {
        id: "ch-3",
        number: "Trek 03",
        title: "Bandar-Bandar Kosmopolitan di Selat Malaka",
        durationMinutes: 48,
        paragraphs: [
          "Pelabuhan bukan sekadar tempat bongkar muat karung rempah, melainkan ruang pertemuan bahasa, resep masakan, dan teknologi perkapalan. Di dermaga yang sama, syahbandar berbicara dalam empat bahasa dalam satu pagi."
        ]
      }
    ]
  },
  {
    id: "jurnal-arsip-kota",
    title: "Morfologi Kampung Kota & Ruang Ketiga di Jawa",
    subtitle: "Ketahanan Sosial di Tengah Densifikasi Urban",
    author: "Ratna Dewi Kartika",
    authorRole: "Peneliti Sosiologi Perkotaan",
    format: "Jurnal",
    subject: "Sosiologi & Urbanisme",
    ddc: "307.76",
    isbnOrIssn: "ISSN 2549-112X",
    publisher: "Jurnal Studi Kota & Masyarakat",
    volumeIssue: "Vol. 12, No. 1",
    doi: "10.14710/jskm.2025.1201",
    year: 2025,
    language: "Bahasa Indonesia",
    pages: 34,
    licenseStatus: "Open Access",
    availableCopies: 99,
    totalCopies: 99,
    borrowCount: 825,
    synopsis:
      "Studi lapangan terhadap 14 gang kampung padat di Yogyakarta, Solo, dan Surabaya yang meneliti fungsi sosial pos ronda, warung kopi sudut gang, dan teras rumah sebagai ruang komunal cair yang menjaga kohesi warga.",
    coverPalette: {
      bg: "#343D33",
      accent: "#D96B43",
      ink: "#FAF8F5",
      motif: "arch",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Artikel 01",
        title: "Gang Sempit Sebagai Infrastruktur Kepedulian",
        paragraphs: [
          "Dalam perencanaan kota teknokratis, gang sempit kerap dipandang sebagai anomali yang tidak efisien. Padahal, observasi partisipatif selama dua belas bulan memperlihatkan bahwa skala manusia pada lebar gang 1,8 meter justru memicu interaksi tatap muka yang mustahil terjadi di jalan protokol.",
          "Pot tanaman di depan pintu, bangku bambu di bawah pohon mangga, dan papan pengumuman warga membentuk ekosistem pengawasan sosial alami yang aman bagi anak-anak dan lansia."
        ]
      },
      {
        id: "ch-2",
        number: "Artikel 02",
        title: "Adaptasi Ruang Publik di Era Ekonomi Platform",
        paragraphs: [
          "Masuknya pengantaran daring mengubah pola lalu lintas di mulut gang. Penelitian ini mencatat bagaimana warga menyepakati jam tenang malam dan area parkir bersama tanpa intervensi regulasi formal."
        ]
      }
    ]
  },
  {
    id: "seni-merawat-sunyi",
    title: "Seni Merawat Sunyi",
    subtitle: "Esai Tentang Perhatian di Era Bising",
    author: "Aulia Rahman",
    authorRole: "Penulis & Editor Kebudayaan",
    format: "E-Book",
    subject: "Psikologi & Esai",
    ddc: "153.7",
    isbnOrIssn: "ISBN 978-623-4408-61-2",
    publisher: "Penerbit Aksara Bumi, Jakarta",
    year: 2026,
    language: "Bahasa Indonesia",
    pages: 176,
    licenseStatus: "Tersedia",
    availableCopies: 1,
    totalCopies: 3,
    borrowCount: 1510,
    isTrending: true,
    synopsis:
      "Kumpulan dua belas esai reflektif tentang kelelahan kognitif akibat banjir informasi dan bagaimana ruang baca, berjalan kaki tanpa gawai, serta menulis catatan tangan dapat memulihkan kedaulatan perhatian kita.",
    coverPalette: {
      bg: "#DCE3D7",
      accent: "#2D5A27",
      ink: "#1F241D",
      motif: "compass",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Esai I",
        title: "Perhatian Sebagai Mata Uang yang Terlupakan",
        paragraphs: [
          "Setiap pagi, bahkan sebelum kaki kita menyentuh lantai dingin kamar tidur, puluhan kabar dari seluruh penjuru bumi sudah berlomba mengetuk kesadaran kita. Kita jarang bertanya: berapa banyak dari kabar itu yang sungguh meminta kepedulian kita, dan berapa banyak yang hanya mencuri ketenangan kita?",
          "Merawat sunyi tidak berarti mengasingkan diri ke puncak gunung. Ia sesederhana menyediakan ruang hening dua puluh menit setiap hari untuk membaca satu gagasan utuh tanpa terburu-buru mencari kesimpulan instan."
        ],
        pullQuote:
          "Keheningan bukan kekosongan; ia adalah tanah lapang tempat pikiran sendiri akhirnya terdengar jelas."
      },
      {
        id: "ch-2",
        number: "Esai II",
        title: "Marginalia: Percakapan Sunyi di Tepi Halaman",
        paragraphs: [
          "Menggarisbawahi kalimat di buku dan menuliskan keraguan kecil di pinggir halaman adalah bentuk dialog paling jujur dengan penulis yang barangkali terpisah ratusan tahun dari masa hidup kita."
        ]
      }
    ]
  },
  {
    id: "audio-sastra-lisan",
    title: "Antologi Hikayat & Sastra Lisan Pesisir",
    subtitle: "Rekaman Pembacaan Puitis & Pengantar Filologi",
    author: "Suryani Malik",
    authorRole: "Filolog & Penyair",
    format: "Audiobook",
    subject: "Fiksi Sastra",
    ddc: "398.2",
    isbnOrIssn: "ISBN 978-602-7731-50-9",
    publisher: "Lembaga Sastra Nusantara",
    year: 2023,
    language: "Bahasa Indonesia",
    durationLabel: "4 jam 15 mnt",
    totalAudioSeconds: 1260,
    licenseStatus: "Tersedia",
    availableCopies: 6,
    totalCopies: 6,
    borrowCount: 740,
    synopsis:
      "Rekaman audio kuratorial yang menghidupkan kembali pantun berkait, syair perahu, dan hikayat rakyat pesisir Kalimantan dan Sumatera Timur, lengkap dengan pengantar konteks sejarah sastra lisan.",
    coverPalette: {
      bg: "#C85C37",
      accent: "#FAF8F5",
      ink: "#FAF8F5",
      motif: "manuscript",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Trek 01",
        title: "Irama Syair dan Nafas Pendengar",
        durationMinutes: 35,
        paragraphs: [
          "Sastra klasik Nusantara pada mulanya tidak dibaca dalam sunyi sendirian; ia dilantunkan di beranda pada malam terang bulan agar irama rima-akhirnya menuntun ingatan kolektif pendengar.",
          "Dalam rekaman ini, tempo pembacaan sengaja diperlambat untuk mempertahankan jeda antar-bait sebagaimana tradisi tutur lisan di pesisir."
        ]
      },
      {
        id: "ch-2",
        number: "Trek 02",
        title: "Metafora Alam dalam Pantun Pelaut",
        durationMinutes: 40,
        paragraphs: [
          "Sampiran dalam pantun Melayu bukanlah hiasan acak sebelum masuk ke isi; ia adalah cermin ekologi yang menghubungkan gejala alam—pasang surut, awan berarak, daun bakau—dengan getar perasaan manusia."
        ]
      }
    ]
  },
  {
    id: "arsip-manuskrip-lontar",
    title: "Katalog Digital Manuskrip Lontar Abad XVIII",
    subtitle: "Transliterasi, Konservasi, dan Indeks Aksara",
    author: "Drs. I Made Suartana",
    authorRole: "Kurator Naskah Kuno",
    format: "Arsip Digital",
    subject: "Sejarah & Filologi",
    ddc: "091.09598",
    isbnOrIssn: "ISBN 978-623-3091-12-4",
    publisher: "Gedung Kertya & Arsip Nasional",
    year: 2022,
    language: "Bahasa Indonesia & Jawa Kuno",
    pages: 418,
    licenseStatus: "Open Access",
    availableCopies: 99,
    totalCopies: 99,
    borrowCount: 685,
    synopsis:
      "Arsip terbuka beresolusi tinggi yang memuat 75 lempir manuskrip daun tal (Borassus flabellifer) bertema pengobatan tradisional, kalender pertanian, dan etika kepemimpinan, disertai transliterasi Latin dan catatan konservasi.",
    coverPalette: {
      bg: "#E4D7C3",
      accent: "#6B4F35",
      ink: "#29221A",
      motif: "manuscript",
    },
    chapters: [
      {
        id: "ch-1",
        number: "Lempir 01–12",
        title: "Teknik Penggoresan Pengrupak dan Perawatan Minyak Kemiri",
        paragraphs: [
          "Daun lontar yang telah direbus dengan ramuan rempah dan dikeringkan selama beberapa pekan memiliki ketahanan serat yang luar biasa terhadap iklim lembap tropis. Penggoresan aksara menggunakan pisau kecil bernama pengrupak kemudian diperjelas dengan jelaga buah kemiri yang dibakar.",
          "Digitalisasi arsip abad ke-18 ini bertujuan agar para peneliti filologi maupun masyarakat umum dapat membaca isi naskah tanpa harus menyentuh langsung lempir asli yang rapuh."
        ]
      },
      {
        id: "ch-2",
        number: "Lempir 13–28",
        title: "Pranata Mangsa dan Kearifan Irigasi Tradisional",
        paragraphs: [
          "Salah satu bagian terpenting dalam katalog ini mencatat pembagian musim tanam berdasarkan posisi rasi bintang waluku dan kemunculan serangga tanah tertentu sebagai penanda awal musim hujan."
        ]
      }
    ]
  }
];
