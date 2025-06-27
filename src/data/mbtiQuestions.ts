import { MBTIQuestion, MBTIChoice, MBTIDimension } from '@/types';

export const mbtiQuestions: MBTIQuestion[] = [
  // Energie (E/I) - 13 questions
  {
    id: 'EI1',
    text: 'Saat berada di sebuah pesta, Anda biasanya:',
    dimension: 'EI',
    optionA: { text: 'Berinteraksi dengan banyak orang, termasuk orang asing.', value: 'E' },
    optionB: { text: 'Berinteraksi dengan beberapa orang yang sudah Anda kenal.', value: 'I' },
  },
  {
    id: 'EI2',
    text: 'Setelah seharian beraktivitas sosial, Anda merasa:',
    dimension: 'EI',
    optionA: { text: 'Bersemangat dan ingin melanjutkan.', value: 'E' },
    optionB: { text: 'Lelah dan butuh waktu sendiri untuk memulihkan energi.', value: 'I' },
  },
  {
    id: 'EI3',
    text: 'Anda lebih suka:',
    dimension: 'EI',
    optionA: { text: 'Menghabiskan waktu bersama banyak teman dan kenalan.', value: 'E' },
    optionB: { text: 'Menghabiskan waktu sendirian atau dengan satu atau dua teman dekat.', value: 'I' },
  },
  {
    id: 'EI4',
    text: 'Saat bertemu orang baru, Anda cenderung:',
    dimension: 'EI',
    optionA: { text: 'Mudah memulai percakapan dan merasa nyaman.', value: 'E' },
    optionB: { text: 'Merasa ragu dan lebih suka menunggu orang lain memulai.', value: 'I' },
  },
  {
    id: 'EI5',
    text: 'Dalam lingkungan kerja, Anda lebih suka:',
    dimension: 'EI',
    optionA: { text: 'Bekerja dalam tim dengan banyak interaksi.', value: 'E' },
    optionB: { text: 'Bekerja sendiri dengan sedikit interaksi.', value: 'I' },
  },
  {
    id: 'EI6',
    text: 'Saat menghadiri acara sosial, Anda biasanya:',
    dimension: 'EI',
    optionA: { text: 'Langsung berbaur dan menikmati keramaian.', value: 'E' },
    optionB: { text: 'Mengamati dulu sebelum berinteraksi.', value: 'I' },
  },
  {
    id: 'EI7',
    text: 'Anda lebih menikmati waktu luang dengan:',
    dimension: 'EI',
    optionA: { text: 'Mengikuti kegiatan kelompok yang ramai.', value: 'E' },
    optionB: { text: 'Melakukan aktivitas sendiri atau dengan teman dekat.', value: 'I' },
  },
  {
    id: 'EI8',
    text: 'Saat menyelesaikan masalah, Anda lebih suka:',
    dimension: 'EI',
    optionA: { text: 'Mendiskusikannya dengan orang lain.', value: 'E' },
    optionB: { text: 'Memikirkannya sendiri terlebih dahulu.', value: 'I' },
  },
  {
    id: 'EI9',
    text: 'Anda lebih suka berkomunikasi melalui:',
    dimension: 'EI',
    optionA: { text: 'Percakapan langsung atau telepon.', value: 'E' },
    optionB: { text: 'Pesan teks atau email.', value: 'I' },
  },
  {
    id: 'EI10',
    text: 'Di tempat umum, Anda cenderung:',
    dimension: 'EI',
    optionA: { text: 'Mudah berbicara dengan orang asing.', value: 'E' },
    optionB: { text: 'Menjaga jarak dan fokus pada diri sendiri.', value: 'I' },
  },
  {
    id: 'EI11',
    text: 'Saat merencanakan akhir pekan, Anda lebih suka:',
    dimension: 'EI',
    optionA: { text: 'Mengundang banyak orang untuk berkumpul.', value: 'E' },
    optionB: { text: 'Bersantai sendiri atau dengan sedikit orang.', value: 'I' },
  },
  {
    id: 'EI12',
    text: 'Dalam kelompok diskusi, Anda biasanya:',
    dimension: 'EI',
    optionA: { text: 'Aktif berbicara dan berbagi ide.', value: 'E' },
    optionB: { text: 'Mendengarkan dan berbicara hanya saat perlu.', value: 'I' },
  },
  {
    id: 'EI13',
    text: 'Anda lebih nyaman di lingkungan yang:',
    dimension: 'EI',
    optionA: { text: 'Ramai dan penuh energi.', value: 'E' },
    optionB: { text: 'Tenang dan minim gangguan.', value: 'I' },
  },

  // Informasi (S/N) - 13 questions
  {
    id: 'SN1',
    text: 'Ketika mempelajari sesuatu yang baru, Anda lebih tertarik pada:',
    dimension: 'SN',
    optionA: { text: 'Fakta konkret dan detail praktis.', value: 'S' },
    optionB: { text: 'Konsep abstrak dan kemungkinan masa depan.', value: 'N' },
  },
  {
    id: 'SN2',
    text: 'Anda cenderung lebih mempercayai:',
    dimension: 'SN',
    optionA: { text: 'Pengalaman langsung dan apa yang nyata.', value: 'S' },
    optionB: { text: 'Intuisi dan firasat.', value: 'N' },
  },
  {
    id: 'SN3',
    text: 'Dalam mengerjakan tugas, Anda lebih suka:',
    dimension: 'SN',
    optionA: { text: 'Mengikuti instruksi yang jelas dan terbukti berhasil.', value: 'S' },
    optionB: { text: 'Mencari cara baru dan inovatif untuk menyelesaikannya.', value: 'N' },
  },
  {
    id: 'SN4',
    text: 'Saat membaca, Anda lebih menikmati:',
    dimension: 'SN',
    optionA: { text: 'Buku dengan fakta dan data nyata.', value: 'S' },
    optionB: { text: 'Buku dengan ide-ide besar dan visi.', value: 'N' },
  },
  {
    id: 'SN5',
    text: 'Saat memecahkan masalah, Anda lebih mengandalkan:',
    dimension: 'SN',
    optionA: { text: 'Analisis detail dan fakta yang ada.', value: 'S' },
    optionB: { text: 'Insting dan visi besar.', value: 'N' },
  },
  {
    id: 'SN6',
    text: 'Anda lebih tertarik dengan:',
    dimension: 'SN',
    optionA: { text: 'Kejadian nyata saat ini.', value: 'S' },
    optionB: { text: 'Kemungkinan dan tren masa depan.', value: 'N' },
  },
  {
    id: 'SN7',
    text: 'Saat berdiskusi, Anda lebih suka membahas:',
    dimension: 'SN',
    optionA: { text: 'Detail yang sudah terbukti.', value: 'S' },
    optionB: { text: 'Ide-ide besar dan abstrak.', value: 'N' },
  },
  {
    id: 'SN9',
    text: 'Saat merencanakan sesuatu, Anda lebih suka:',
    dimension: 'SN',
    optionA: { text: 'Berbasis pada pengalaman masa lalu.', value: 'S' },
    optionB: { text: 'Berfokus pada kemungkinan masa depan.', value: 'N' },
  },
  {
    id: 'SN10',
    text: 'Saat mengamati sesuatu, Anda lebih memperhatikan:',
    dimension: 'SN',
    optionA: { text: 'Detail nyata yang terlihat.', value: 'S' },
    optionB: { text: 'Pola dan gambaran besar.', value: 'N' },
  },
  {
    id: 'SN11',
    text: 'Anda lebih suka mendekati tugas dengan:',
    dimension: 'SN',
    optionA: { text: 'Metode yang sudah teruji.', value: 'S' },
    optionB: { text: 'Pendekatan baru dan inovatif.', value: 'N' },
  },
  {
    id: 'SN12',
    text: 'Saat belajar, Anda lebih suka:',
    dimension: 'SN',
    optionA: { text: 'Memahami fakta dan detail.', value: 'S' },
    optionB: { text: 'Menjelajahi teori dan konsep.', value: 'N' },
  },
  {
    id: 'SN13',
    text: 'Anda lebih menikmati pembicaraan tentang:',
    dimension: 'SN',
    optionA: { text: 'Kenyataan dan apa yang sudah terjadi.', value: 'S' },
    optionB: { text: 'Kemungkinan dan ide masa depan.', value: 'N' },
  },

  // Keputusan (T/F) - 12 questions
  {
    id: 'TF1',
    text: 'Saat membuat keputusan penting, Anda lebih mengutamakan:',
    dimension: 'TF',
    optionA: { text: 'Logika, objektivitas, dan keadilan.', value: 'T' },
    optionB: { text: 'Perasaan, nilai-nilai pribadi, dan dampak pada orang lain.', value: 'F' },
  },
  {
    id: 'TF2',
    text: 'Anda lebih mudah terpengaruh oleh:',
    dimension: 'TF',
    optionA: { text: 'Argumen yang logis dan masuk akal.', value: 'T' },
    optionB: { text: 'Cerita yang menyentuh perasaan atau permohonan emosional.', value: 'F' },
  },
  {
    id: 'TF3',
    text: 'Dalam memberikan kritik, Anda cenderung:',
    dimension: 'TF',
    optionA: { text: 'Langsung dan objektif.', value: 'T' },
    optionB: { text: 'Hati-hati dan mempertimbangkan perasaan orang lain.', value: 'F' },
  },
  {
    id: 'TF4',
    text: 'Saat menyelesaikan konflik, Anda lebih suka:',
    dimension: 'TF',
    optionA: { text: 'Mencari solusi yang adil dan logis.', value: 'T' },
    optionB: { text: 'Mencari kompromi yang memuaskan semua pihak.', value: 'F' },
  },
  {
    id: 'TF5',
    text: 'Anda lebih menghargai:',
    dimension: 'TF',
    optionA: { text: 'Kebenaran dan kejujuran.', value: 'T' },
    optionB: { text: 'Harmoni dan hubungan yang baik.', value: 'F' },
  },
  {
    id: 'TF6',
    text: 'Saat mengevaluasi seseorang, Anda lebih fokus pada:',
    dimension: 'TF',
    optionA: { text: 'Kemampuan dan prestasi mereka.', value: 'T' },
    optionB: { text: 'Karakter dan nilai-nilai mereka.', value: 'F' },
  },
  {
    id: 'TF7',
    text: 'Dalam tim, Anda lebih suka:',
    dimension: 'TF',
    optionA: { text: 'Fokus pada tugas dan hasil.', value: 'T' },
    optionB: { text: 'Mempertimbangkan dinamika tim dan perasaan anggota.', value: 'F' },
  },
  {
    id: 'TF8',
    text: 'Saat belajar, Anda lebih tertarik pada:',
    dimension: 'TF',
    optionA: { text: 'Teori dan prinsip yang mendasar.', value: 'T' },
    optionB: { text: 'Aplikasi praktis dan dampak pada orang.', value: 'F' },
  },
  {
    id: 'TF9',
    text: 'Anda lebih suka bekerja dengan:',
    dimension: 'TF',
    optionA: { text: 'Orang yang kompeten dan efisien.', value: 'T' },
    optionB: { text: 'Orang yang ramah dan kooperatif.', value: 'F' },
  },
  {
    id: 'TF10',
    text: 'Saat menghadapi masalah, Anda lebih suka:',
    dimension: 'TF',
    optionA: { text: 'Menganalisis fakta dan mencari solusi.', value: 'T' },
    optionB: { text: 'Mempertimbangkan dampak pada semua yang terlibat.', value: 'F' },
  },
  {
    id: 'TF11',
    text: 'Anda lebih menghargai:',
    dimension: 'TF',
    optionA: { text: 'Konsistensi dan standar yang tinggi.', value: 'T' },
    optionB: { text: 'Fleksibilitas dan pemahaman.', value: 'F' },
  },
  {
    id: 'TF12',
    text: 'Saat membuat aturan, Anda lebih mengutamakan:',
    dimension: 'TF',
    optionA: { text: 'Efektivitas dan keadilan.', value: 'T' },
    optionB: { text: 'Kesejahteraan dan kebahagiaan semua.', value: 'F' },
  },

  // Gaya Hidup (J/P) - 12 questions
  {
    id: 'JP1',
    text: 'Anda lebih suka:',
    dimension: 'JP',
    optionA: { text: 'Membuat rencana dan mengikutinya.', value: 'J' },
    optionB: { text: 'Menyesuaikan diri dengan situasi yang berubah.', value: 'P' },
  },
  {
    id: 'JP2',
    text: 'Saat mengerjakan proyek, Anda cenderung:',
    dimension: 'JP',
    optionA: { text: 'Menyelesaikan jauh sebelum deadline.', value: 'J' },
    optionB: { text: 'Bekerja di bawah tekanan deadline.', value: 'P' },
  },
  {
    id: 'JP3',
    text: 'Anda lebih nyaman dengan:',
    dimension: 'JP',
    optionA: { text: 'Jadwal yang terstruktur dan terencana.', value: 'J' },
    optionB: { text: 'Jadwal yang fleksibel dan spontan.', value: 'P' },
  },
  {
    id: 'JP4',
    text: 'Saat membuat keputusan, Anda:',
    dimension: 'JP',
    optionA: { text: 'Membuat keputusan cepat dan tegas.', value: 'J' },
    optionB: { text: 'Mengumpulkan informasi sebanyak mungkin sebelum memutuskan.', value: 'P' },
  },
  {
    id: 'JP5',
    text: 'Anda lebih suka:',
    dimension: 'JP',
    optionA: { text: 'Menyelesaikan satu tugas sebelum mulai yang lain.', value: 'J' },
    optionB: { text: 'Mengerjakan beberapa tugas sekaligus.', value: 'P' },
  },
  {
    id: 'JP6',
    text: 'Saat bepergian, Anda:',
    dimension: 'JP',
    optionA: { text: 'Membuat rencana detail dan mengikutinya.', value: 'J' },
    optionB: { text: 'Membiarkan hal-hal terjadi secara spontan.', value: 'P' },
  },
  {
    id: 'JP7',
    text: 'Anda lebih suka:',
    dimension: 'JP',
    optionA: { text: 'Mengikuti rutinitas yang sudah terbukti.', value: 'J' },
    optionB: { text: 'Mencoba hal-hal baru dan berbeda.', value: 'P' },
  },
  {
    id: 'JP8',
    text: 'Saat menghadapi perubahan, Anda:',
    dimension: 'JP',
    optionA: { text: 'Merasa terganggu dan butuh waktu untuk menyesuaikan.', value: 'J' },
    optionB: { text: 'Melihatnya sebagai kesempatan untuk sesuatu yang baru.', value: 'P' },
  },
  {
    id: 'JP9',
    text: 'Anda lebih suka:',
    dimension: 'JP',
    optionA: { text: 'Menyelesaikan pekerjaan sebelum bersenang-senang.', value: 'J' },
    optionB: { text: 'Bersenang-senang dulu, pekerjaan bisa nanti.', value: 'P' },
  },
  {
    id: 'JP10',
    text: 'Saat belajar, Anda:',
    dimension: 'JP',
    optionA: { text: 'Mengikuti kurikulum yang terstruktur.', value: 'J' },
    optionB: { text: 'Menjelajahi topik yang menarik secara bebas.', value: 'P' },
  },
  {
    id: 'JP11',
    text: 'Anda lebih nyaman dengan:',
    dimension: 'JP',
    optionA: { text: 'Kepastian dan ketegasan.', value: 'J' },
    optionB: { text: 'Kemungkinan dan pilihan terbuka.', value: 'P' },
  },
  {
    id: 'JP12',
    text: 'Saat bekerja, Anda:',
    dimension: 'JP',
    optionA: { text: 'Fokus pada tujuan dan hasil akhir.', value: 'J' },
    optionB: { text: 'Menikmati proses dan perjalanan.', value: 'P' },
  },
];

// Fungsi untuk mengambil 20 pertanyaan secara random dengan distribusi seimbang
export const getRandomMBTIQuestions = (): MBTIQuestion[] => {
  // Kelompokkan pertanyaan berdasarkan dimensi
  const questionsByDimension = {
    EI: mbtiQuestions.filter(q => q.dimension === 'EI'),
    SN: mbtiQuestions.filter(q => q.dimension === 'SN'),
    TF: mbtiQuestions.filter(q => q.dimension === 'TF'),
    JP: mbtiQuestions.filter(q => q.dimension === 'JP'),
  };

  // Ambil 5 pertanyaan dari setiap dimensi (total 20)
  const selectedQuestions: MBTIQuestion[] = [];
  
  Object.values(questionsByDimension).forEach(dimensionQuestions => {
    // Shuffle pertanyaan dalam dimensi
    const shuffled = [...dimensionQuestions].sort(() => Math.random() - 0.5);
    // Ambil 5 pertanyaan pertama
    selectedQuestions.push(...shuffled.slice(0, 5));
  });

  // Shuffle lagi semua pertanyaan yang dipilih
  return selectedQuestions.sort(() => Math.random() - 0.5);
};

// Simplified descriptions for MBTI types (unchanged)
export const mbtiTypeDescriptions: Record<string, { title: string; description: string }> = {
  ISTJ: { title: "Sang Pengawas (The Inspector)", description: "Praktis, bertanggung jawab, dan dapat diandalkan. Fokus pada fakta dan detail." },
  ISFJ: { title: "Sang Pelindung (The Protector)", description: "Hangat, setia, dan teliti. Berdedikasi untuk membantu orang lain." },
  INFJ: { title: "Sang Penasihat (The Counselor)", description: "Idealistis, berwawasan luas, dan penuh empati. Ingin membuat dunia lebih baik." },
  INTJ: { title: "Sang Arsitek (The Mastermind)", description: "Strategis, analitis, dan mandiri. Punya visi jangka panjang." },
  ISTP: { title: "Sang Pengrajin (The Craftsman)", description: "Logis, observan, dan pandai memecahkan masalah praktis." },
  ISFP: { title: "Sang Seniman (The Artist)", description: "Sensitif, baik hati, dan menghargai keindahan. Hidup di saat ini." },
  INFP: { title: "Sang Mediator (The Mediator)", description: "Idealistis, kreatif, dan setia pada nilai-nilai. Ingin memahami orang lain." },
  INTP: { title: "Sang Pemikir (The Thinker)", description: "Inovatif, analitis, dan haus akan pengetahuan. Suka teori dan konsep." },
  ESTP: { title: "Sang Dinamo (The Dynamo)", description: "Energik, suka bertindak, dan pandai beradaptasi. Menyukai tantangan." },
  ESFP: { title: "Sang Penghibur (The Performer)", description: "Antusias, ramah, dan spontan. Suka menjadi pusat perhatian." },
  ENFP: { title: "Sang Juara (The Champion)", description: "Inspiratif, kreatif, dan penuh semangat. Melihat potensi dalam diri orang lain." },
  ENTP: { title: "Sang Visioner (The Visionary)", description: "Cerdas, suka berdebat, dan inovatif. Suka mengeksplorasi ide baru." },
  ESTJ: { title: "Sang Eksekutif (The Executive)", description: "Terorganisasi, tegas, dan efisien. Suka memimpin dan membuat keputusan." },
  ESFJ: { title: "Sang Konsul (The Consul)", description: "Peduli, suka menolong, dan kooperatif. Menikmati harmoni sosial." },
  ENFJ: { title: "Sang Protagonis (The Protagonist)", description: "Karismatik, inspiratif, dan empatik. Ingin memotivasi orang lain." },
  ENTJ: { title: "Sang Komandan (The Commander)", description: "Strategis, tegas, dan berorientasi pada tujuan. Pemimpin alami." },
};