import { KraepelinQuestion, KraepelinResultData } from '@/types';

export const KRAEPELIN_ASPECT_QUESTIONS_COUNT = {
  concentration: 12,
  speed: 13,
  accuracy: 13,
  stamina: 12,
};

export const kraepelinQuestions: KraepelinQuestion[] = [

  {
    id: 'K1',
    text: 'Ketika mengerjakan tugas yang monoton dan berulang, seberapa baik Anda dapat mempertahankan fokus?',
    options: [
      { text: 'Sangat baik, saya bisa fokus untuk waktu yang lama.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi kadang perhatian teralihkan.', score: 2, aspect: 'concentration' },
      { text: 'Kurang baik, saya mudah bosan dan kehilangan fokus.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K2',
    text: 'Seberapa mudah Anda terdistraksi oleh suara atau aktivitas di sekitar saat bekerja?',
    options: [
      { text: 'Sangat mudah terdistraksi, butuh lingkungan yang sangat tenang.', score: 1, aspect: 'concentration' },
      { text: 'Kadang terdistraksi, tapi bisa kembali fokus.', score: 2, aspect: 'concentration' },
      { text: 'Sulit terdistraksi, bisa fokus di lingkungan apapun.', score: 3, aspect: 'concentration' },
    ],
  },
  {
    id: 'K3',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan perhatian detail dalam waktu lama?',
    options: [
      { text: 'Sangat baik, saya bisa tetap fokus pada detail.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi kadang detail terlewat.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, saya mudah kehilangan fokus pada detail.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K4',
    text: 'Seberapa sering Anda merasa pikiran Anda mengembara saat mengerjakan tugas penting?',
    options: [
      { text: 'Sangat sering, pikiran saya mudah melayang.', score: 1, aspect: 'concentration' },
      { text: 'Kadang-kadang, tapi bisa kembali fokus.', score: 2, aspect: 'concentration' },
      { text: 'Jarang, saya bisa tetap fokus pada tugas.', score: 3, aspect: 'concentration' },
    ],
  },
  {
    id: 'K5',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan pemantauan berkelanjutan?',
    options: [
      { text: 'Sangat baik, saya bisa memantau secara konsisten.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi kadang ada yang terlewat.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, saya mudah lupa untuk memantau.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K6',
    text: 'Seberapa baik Anda dapat mengabaikan gangguan internal (seperti kekhawatiran) saat bekerja?',
    options: [
      { text: 'Sangat baik, saya bisa mengabaikan gangguan internal.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi kadang terganggu.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, gangguan internal sangat mempengaruhi fokus.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K7',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan fokus pada satu hal dalam waktu lama?',
    options: [
      { text: 'Sangat baik, saya bisa fokus pada satu hal.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi kadang ingin beralih ke hal lain.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, saya mudah ingin beralih ke hal lain.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K8',
    text: 'Seberapa baik Anda dapat mempertahankan fokus saat merasa lelah?',
    options: [
      { text: 'Sangat baik, fokus tetap terjaga meski lelah.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi fokus menurun saat lelah.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, fokus sangat menurun saat lelah.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K9',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan pemantauan beberapa hal sekaligus?',
    options: [
      { text: 'Sangat baik, saya bisa memantau beberapa hal.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi kadang ada yang terlewat.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, saya lebih suka fokus pada satu hal.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K10',
    text: 'Seberapa mudah Anda kembali fokus setelah terdistraksi?',
    options: [
      { text: 'Sangat mudah, saya bisa langsung kembali fokus.', score: 3, aspect: 'concentration' },
      { text: 'Cukup mudah, butuh sedikit waktu.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, butuh waktu lama untuk kembali fokus.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K11',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan fokus pada detail kecil?',
    options: [
      { text: 'Sangat baik, saya bisa fokus pada detail kecil.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, tapi kadang detail terlewat.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, saya mudah melewatkan detail kecil.', score: 1, aspect: 'concentration' },
    ],
  },
  {
    id: 'K12',
    text: 'Seberapa baik Anda dapat mempertahankan fokus saat ada tekanan waktu?',
    options: [
      { text: 'Sangat baik, tekanan waktu justru meningkatkan fokus.', score: 3, aspect: 'concentration' },
      { text: 'Cukup baik, fokus tetap terjaga.', score: 2, aspect: 'concentration' },
      { text: 'Sulit, tekanan waktu membuat fokus menurun.', score: 1, aspect: 'concentration' },
    ],
  },

  // Speed Questions (13 questions)
  {
    id: 'K13',
    text: 'Bagaimana Anda menggambarkan kecepatan kerja Anda secara umum?',
    options: [
      { text: 'Cenderung cepat dan efisien.', score: 3, aspect: 'speed' },
      { text: 'Kecepatan sedang, tergantung tugasnya.', score: 2, aspect: 'speed' },
      { text: 'Lebih suka bekerja dengan perlahan dan hati-hati.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K14',
    text: 'Seberapa cepat Anda dapat menyelesaikan tugas rutin?',
    options: [
      { text: 'Sangat cepat, saya efisien dalam tugas rutin.', score: 3, aspect: 'speed' },
      { text: 'Cukup cepat, sesuai standar normal.', score: 2, aspect: 'speed' },
      { text: 'Lebih lambat, saya suka memastikan semuanya benar.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K15',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan kecepatan tinggi?',
    options: [
      { text: 'Sangat baik, saya bisa bekerja dengan sangat cepat.', score: 3, aspect: 'speed' },
      { text: 'Cukup baik, bisa menyesuaikan kecepatan.', score: 2, aspect: 'speed' },
      { text: 'Sulit, saya lebih suka bekerja dengan tempo yang nyaman.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K16',
    text: 'Seberapa cepat Anda dapat beralih dari satu tugas ke tugas lain?',
    options: [
      { text: 'Sangat cepat, saya bisa beralih dengan mudah.', score: 3, aspect: 'speed' },
      { text: 'Cukup cepat, butuh sedikit waktu penyesuaian.', score: 2, aspect: 'speed' },
      { text: 'Lebih lambat, saya butuh waktu untuk beralih.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K17',
    text: 'Bagaimana Anda menangani deadline yang ketat?',
    options: [
      { text: 'Sangat baik, saya bisa menyelesaikan tepat waktu.', score: 3, aspect: 'speed' },
      { text: 'Cukup baik, biasanya bisa menyelesaikan tepat waktu.', score: 2, aspect: 'speed' },
      { text: 'Sulit, saya sering butuh waktu lebih lama.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K18',
    text: 'Seberapa cepat Anda dapat mempelajari prosedur baru?',
    options: [
      { text: 'Sangat cepat, saya mudah memahami prosedur baru.', score: 3, aspect: 'speed' },
      { text: 'Cukup cepat, butuh sedikit waktu untuk memahami.', score: 2, aspect: 'speed' },
      { text: 'Lebih lambat, saya butuh waktu untuk memahami dengan baik.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K19',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan respons cepat?',
    options: [
      { text: 'Sangat baik, saya bisa merespons dengan cepat.', score: 3, aspect: 'speed' },
      { text: 'Cukup baik, bisa merespons dalam waktu wajar.', score: 2, aspect: 'speed' },
      { text: 'Sulit, saya butuh waktu untuk merespons.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K20',
    text: 'Seberapa cepat Anda dapat menyelesaikan tugas administratif?',
    options: [
      { text: 'Sangat cepat, saya efisien dalam tugas administratif.', score: 3, aspect: 'speed' },
      { text: 'Cukup cepat, sesuai standar normal.', score: 2, aspect: 'speed' },
      { text: 'Lebih lambat, saya suka memastikan semuanya benar.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K21',
    text: 'Bagaimana Anda menangani situasi yang membutuhkan tindakan cepat?',
    options: [
      { text: 'Sangat baik, saya bisa bertindak dengan cepat.', score: 3, aspect: 'speed' },
      { text: 'Cukup baik, bisa bertindak dalam waktu wajar.', score: 2, aspect: 'speed' },
      { text: 'Sulit, saya butuh waktu untuk mempertimbangkan.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K22',
    text: 'Seberapa cepat Anda dapat menyelesaikan tugas yang membutuhkan koordinasi dengan orang lain?',
    options: [
      { text: 'Sangat cepat, saya efisien dalam koordinasi.', score: 3, aspect: 'speed' },
      { text: 'Cukup cepat, sesuai standar normal.', score: 2, aspect: 'speed' },
      { text: 'Lebih lambat, koordinasi membutuhkan waktu.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K23',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan multitasking?',
    options: [
      { text: 'Sangat baik, saya bisa mengerjakan beberapa tugas sekaligus.', score: 3, aspect: 'speed' },
      { text: 'Cukup baik, bisa mengerjakan beberapa tugas.', score: 2, aspect: 'speed' },
      { text: 'Sulit, saya lebih suka fokus pada satu tugas.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K24',
    text: 'Seberapa cepat Anda dapat menyelesaikan tugas yang membutuhkan analisis data?',
    options: [
      { text: 'Sangat cepat, saya efisien dalam analisis data.', score: 3, aspect: 'speed' },
      { text: 'Cukup cepat, sesuai standar normal.', score: 2, aspect: 'speed' },
      { text: 'Lebih lambat, analisis membutuhkan waktu yang teliti.', score: 1, aspect: 'speed' },
    ],
  },
  {
    id: 'K25',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan kecepatan dalam pengambilan keputusan?',
    options: [
      { text: 'Sangat baik, saya bisa mengambil keputusan dengan cepat.', score: 3, aspect: 'speed' },
      { text: 'Cukup baik, bisa mengambil keputusan dalam waktu wajar.', score: 2, aspect: 'speed' },
      { text: 'Sulit, saya butuh waktu untuk mempertimbangkan dengan matang.', score: 1, aspect: 'speed' },
    ],
  },


  {
    id: 'K26',
    text: 'Saat bekerja di bawah tekanan waktu, bagaimana tingkat ketelitian Anda?',
    options: [
      { text: 'Tetap sangat teliti, jarang membuat kesalahan.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup teliti, tapi mungkin ada sedikit kesalahan kecil.', score: 2, aspect: 'accuracy' },
      { text: 'Ketelitian menurun, lebih rentan membuat kesalahan.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K27',
    text: 'Seberapa penting bagi Anda untuk menyelesaikan pekerjaan dengan sempurna?',
    options: [
      { text: 'Sangat penting, kualitas adalah utama.', score: 3, aspect: 'accuracy' },
      { text: 'Penting, tapi keseimbangan dengan waktu juga diperhatikan.', score: 2, aspect: 'accuracy' },
      { text: 'Kurang penting, yang utama selesai tepat waktu.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K28',
    text: 'Seberapa sering Anda memeriksa ulang pekerjaan Anda?',
    options: [
      { text: 'Sangat sering, saya detail oriented.', score: 3, aspect: 'accuracy' },
      { text: 'Kadang-kadang, terutama untuk tugas penting.', score: 2, aspect: 'accuracy' },
      { text: 'Jarang, saya percaya pada pekerjaan awal saya.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K29',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan ketelitian tinggi?',
    options: [
      { text: 'Sangat baik, saya sangat teliti dalam detail.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup baik, bisa menjaga ketelitian yang baik.', score: 2, aspect: 'accuracy' },
      { text: 'Sulit, saya mudah melewatkan detail penting.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K30',
    text: 'Seberapa sering Anda membuat kesalahan dalam pekerjaan rutin?',
    options: [
      { text: 'Sangat jarang, saya sangat teliti.', score: 3, aspect: 'accuracy' },
      { text: 'Kadang-kadang, tapi tidak sering.', score: 2, aspect: 'accuracy' },
      { text: 'Cukup sering, saya mudah membuat kesalahan.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K31',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan verifikasi data?',
    options: [
      { text: 'Sangat baik, saya sangat teliti dalam verifikasi.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup baik, bisa melakukan verifikasi dengan baik.', score: 2, aspect: 'accuracy' },
      { text: 'Sulit, saya mudah melewatkan kesalahan dalam data.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K32',
    text: 'Seberapa teliti Anda dalam mengikuti prosedur yang ditetapkan?',
    options: [
      { text: 'Sangat teliti, saya selalu mengikuti prosedur dengan tepat.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup teliti, biasanya mengikuti prosedur.', score: 2, aspect: 'accuracy' },
      { text: 'Kurang teliti, saya kadang menyederhanakan prosedur.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K33',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan perhitungan yang tepat?',
    options: [
      { text: 'Sangat baik, saya sangat teliti dalam perhitungan.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup baik, bisa melakukan perhitungan dengan akurat.', score: 2, aspect: 'accuracy' },
      { text: 'Sulit, saya mudah membuat kesalahan dalam perhitungan.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K34',
    text: 'Seberapa teliti Anda dalam mencatat informasi penting?',
    options: [
      { text: 'Sangat teliti, saya mencatat semua detail penting.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup teliti, mencatat informasi yang diperlukan.', score: 2, aspect: 'accuracy' },
      { text: 'Kurang teliti, saya kadang melewatkan informasi penting.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K35',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan pengecekan kualitas?',
    options: [
      { text: 'Sangat baik, saya sangat teliti dalam pengecekan kualitas.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup baik, bisa melakukan pengecekan dengan baik.', score: 2, aspect: 'accuracy' },
      { text: 'Sulit, saya mudah melewatkan masalah kualitas.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K36',
    text: 'Seberapa teliti Anda dalam mengikuti instruksi yang diberikan?',
    options: [
      { text: 'Sangat teliti, saya mengikuti instruksi dengan tepat.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup teliti, biasanya mengikuti instruksi.', score: 2, aspect: 'accuracy' },
      { text: 'Kurang teliti, saya kadang menginterpretasikan instruksi.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K37',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan dokumentasi yang akurat?',
    options: [
      { text: 'Sangat baik, saya sangat teliti dalam dokumentasi.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup baik, bisa membuat dokumentasi yang akurat.', score: 2, aspect: 'accuracy' },
      { text: 'Sulit, saya mudah melewatkan detail dalam dokumentasi.', score: 1, aspect: 'accuracy' },
    ],
  },
  {
    id: 'K38',
    text: 'Seberapa teliti Anda dalam memeriksa hasil pekerjaan sebelum menyerahkannya?',
    options: [
      { text: 'Sangat teliti, saya selalu memeriksa dengan seksama.', score: 3, aspect: 'accuracy' },
      { text: 'Cukup teliti, biasanya memeriksa sebelum menyerahkan.', score: 2, aspect: 'accuracy' },
      { text: 'Kurang teliti, saya jarang memeriksa ulang.', score: 1, aspect: 'accuracy' },
    ],
  },


  {
    id: 'K39',
    text: 'Setelah bekerja keras dalam waktu lama, bagaimana Anda biasanya merasa?',
    options: [
      { text: 'Masih berenergi dan siap untuk tugas berikutnya.', score: 3, aspect: 'stamina' },
      { text: 'Merasa lelah tapi masih bisa melanjutkan jika perlu.', score: 2, aspect: 'stamina' },
      { text: 'Sangat lelah dan butuh istirahat total.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K40',
    text: 'Seberapa lama Anda dapat bekerja secara produktif tanpa istirahat?',
    options: [
      { text: 'Sangat lama, bisa bekerja berjam-jam tanpa istirahat.', score: 3, aspect: 'stamina' },
      { text: 'Cukup lama, bisa bekerja beberapa jam sebelum istirahat.', score: 2, aspect: 'stamina' },
      { text: 'Tidak terlalu lama, butuh istirahat yang sering.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K41',
    text: 'Bagaimana Anda menangani jadwal kerja yang padat?',
    options: [
      { text: 'Sangat baik, saya bisa menangani jadwal yang padat.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa menangani jadwal yang cukup padat.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, saya butuh jadwal yang lebih santai.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K42',
    text: 'Seberapa baik Anda dapat mempertahankan performa kerja sepanjang hari?',
    options: [
      { text: 'Sangat baik, performa tetap konsisten sepanjang hari.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, performa sedikit menurun di akhir hari.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, performa menurun signifikan di akhir hari.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K43',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan ketahanan fisik?',
    options: [
      { text: 'Sangat baik, saya memiliki ketahanan fisik yang baik.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa menangani tugas fisik yang moderat.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, saya cepat lelah dengan tugas fisik.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K44',
    text: 'Seberapa baik Anda dapat bekerja dalam shift yang panjang?',
    options: [
      { text: 'Sangat baik, saya bisa bekerja dalam shift panjang.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa bekerja dalam shift yang cukup panjang.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, saya butuh shift yang lebih pendek.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K45',
    text: 'Bagaimana Anda menangani tekanan kerja yang berkelanjutan?',
    options: [
      { text: 'Sangat baik, saya bisa menangani tekanan yang berkelanjutan.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa menangani tekanan yang moderat.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, saya mudah stres dengan tekanan yang berkelanjutan.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K46',
    text: 'Seberapa baik Anda dapat mempertahankan fokus dalam waktu yang lama?',
    options: [
      { text: 'Sangat baik, saya bisa mempertahankan fokus lama.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa mempertahankan fokus cukup lama.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, fokus saya mudah menurun dalam waktu lama.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K47',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan ketahanan mental?',
    options: [
      { text: 'Sangat baik, saya memiliki ketahanan mental yang kuat.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa menangani tekanan mental yang moderat.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, saya mudah lelah secara mental.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K48',
    text: 'Seberapa baik Anda dapat bekerja dalam kondisi yang tidak nyaman?',
    options: [
      { text: 'Sangat baik, saya bisa bekerja dalam kondisi apapun.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa menyesuaikan dengan kondisi yang ada.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, saya butuh kondisi yang nyaman untuk bekerja.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K49',
    text: 'Bagaimana Anda menangani tugas yang membutuhkan ketahanan emosional?',
    options: [
      { text: 'Sangat baik, saya memiliki ketahanan emosional yang kuat.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa menangani tekanan emosional yang moderat.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, saya mudah terpengaruh secara emosional.', score: 1, aspect: 'stamina' },
    ],
  },
  {
    id: 'K50',
    text: 'Seberapa baik Anda dapat mempertahankan motivasi dalam jangka panjang?',
    options: [
      { text: 'Sangat baik, saya bisa mempertahankan motivasi lama.', score: 3, aspect: 'stamina' },
      { text: 'Cukup baik, bisa mempertahankan motivasi cukup lama.', score: 2, aspect: 'stamina' },
      { text: 'Sulit, motivasi saya mudah menurun dalam jangka panjang.', score: 1, aspect: 'stamina' },
    ],
  },
];

export const kraepelinProfileDescriptions: Record<string, string> = {
  HIGH_CONCENTRATION_SPEED_ACCURACY_STAMINA: "Memiliki fokus tinggi, bekerja dengan cepat dan teliti, serta memiliki daya tahan kerja yang sangat baik. Cocok untuk tugas yang menuntut presisi dan kecepatan dalam waktu lama.",
  HIGH_CONCENTRATION_ACCURACY_AVG_SPEED_STAMINA: "Sangat teliti dan fokus, kecepatan kerja cukup baik. Mampu menjaga kualitas pekerjaan dalam jangka waktu yang cukup.",
  AVG_ALL: "Kemampuan kerja secara umum seimbang antara kecepatan, ketelitian, dan daya tahan. Adaptif terhadap berbagai jenis tugas.",
  HIGH_SPEED_AVG_ACCURACY_CONCENTRATION_STAMINA: "Mampu bekerja dengan sangat cepat, namun ketelitian dan fokus mungkin perlu perhatian lebih pada tugas detail atau jangka panjang.",
  LOW_ALL: "Cenderung memerlukan lingkungan yang lebih tenang atau tugas yang terstruktur untuk performa optimal. Kecepatan, ketelitian, dan daya tahan mungkin menjadi area pengembangan.",
  DEFAULT_PROFILE: "Hasil menunjukkan kombinasi berbagai aspek kerja. Dianjurkan untuk melihat skor detail untuk pemahaman lebih lanjut."
};

export const getKraepelinProfile = (scores: KraepelinResultData['scores']): string => {
  let profileKey = "DEFAULT_PROFILE"; 

  const highConc = scores.concentration > KRAEPELIN_ASPECT_QUESTIONS_COUNT.concentration * 0.66;
  const avgConc = scores.concentration > KRAEPELIN_ASPECT_QUESTIONS_COUNT.concentration * 0.33;

  const highSpeed = scores.speed > KRAEPELIN_ASPECT_QUESTIONS_COUNT.speed * 0.66;
  const avgSpeed = scores.speed > KRAEPELIN_ASPECT_QUESTIONS_COUNT.speed * 0.33;
  
  const highAcc = scores.accuracy > KRAEPELIN_ASPECT_QUESTIONS_COUNT.accuracy * 0.66;
  const avgAcc = scores.accuracy > KRAEPELIN_ASPECT_QUESTIONS_COUNT.accuracy * 0.33;

  const highStamina = scores.stamina > KRAEPELIN_ASPECT_QUESTIONS_COUNT.stamina * 0.66;

  if (highConc && highSpeed && highAcc && highStamina) {
    profileKey = "HIGH_CONCENTRATION_SPEED_ACCURACY_STAMINA";
  } else if (highConc && highAcc && avgSpeed) {
    profileKey = "HIGH_CONCENTRATION_ACCURACY_AVG_SPEED_STAMINA";
  } else if (avgConc && avgSpeed && avgAcc ) {
    profileKey = "AVG_ALL";
  } else if (highSpeed && avgAcc && avgConc) {
    profileKey = "HIGH_SPEED_AVG_ACCURACY_CONCENTRATION_STAMINA";
  } else if (!avgConc && !avgSpeed && !avgAcc) { 
    profileKey = "LOW_ALL";
  }

  return kraepelinProfileDescriptions[profileKey] || kraepelinProfileDescriptions["DEFAULT_PROFILE"];
};


export const getRandomKraepelinQuestions = (): KraepelinQuestion[] => {

  const questionsByAspect = {
    concentration: kraepelinQuestions.filter(q => q.options.some(opt => opt.aspect === 'concentration')),
    speed: kraepelinQuestions.filter(q => q.options.some(opt => opt.aspect === 'speed')),
    accuracy: kraepelinQuestions.filter(q => q.options.some(opt => opt.aspect === 'accuracy')),
    stamina: kraepelinQuestions.filter(q => q.options.some(opt => opt.aspect === 'stamina')),
  };


  const selectedQuestions: KraepelinQuestion[] = [];
  
  Object.values(questionsByAspect).forEach(aspectQuestions => {

    const shuffled = [...aspectQuestions].sort(() => Math.random() - 0.5);

    selectedQuestions.push(...shuffled.slice(0, 5));
  });


  return selectedQuestions.sort(() => Math.random() - 0.5);
};
