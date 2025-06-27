import { PAPIKostickPair, PAPIKostickDimension } from '@/types';

export const papiKostickDimensionDescriptions: Record<PAPIKostickDimension, { name: string; description: string }> = {
  [PAPIKostickDimension.LEADERSHIP]: { name: "Kepemimpinan (L)", description: "Kebutuhan untuk memimpin, mengambil tanggung jawab, dan mengarahkan orang lain." },
  [PAPIKostickDimension.ACTIVITY_PACE]: { name: "Kecepatan Kerja (P)", description: "Kebutuhan untuk bekerja dengan cepat dan menyelesaikan tugas secara pribadi." },
  [PAPIKostickDimension.SOCIAL_EXTROVERSION]: { name: "Ekstroversi Sosial (X)", description: "Kebutuhan untuk bersosialisasi, dikenal, dan menjadi pusat perhatian." },
  [PAPIKostickDimension.NEED_TO_CONTROL_OTHERS]: { name: "Mengontrol Orang Lain (A)", description: "Kebutuhan untuk mengatur, mengarahkan, dan mengendalikan orang lain." },
  [PAPIKostickDimension.THEORETICAL_TYPE]: { name: "Tipe Teoritis (R)", description: "Minat pada pemikiran teoritis, abstrak, dan analitis." },
  [PAPIKostickDimension.INTEREST_IN_WORKING_WITH_DETAILS]: { name: "Minat pada Detail (D)", description: "Kebutuhan untuk bekerja dengan detail, presisi, dan akurasi." },
  [PAPIKostickDimension.ORGANIZED_TYPE]: { name: "Tipe Teratur (C)", description: "Kebutuhan akan keteraturan, perencanaan, dan metode kerja yang sistematis." },
  [PAPIKostickDimension.NEED_FOR_CLOSENESS_AND_AFFECTION]: { name: "Kebutuhan Kasih Sayang (O)", description: "Kebutuhan akan hubungan yang dekat, hangat, dan penuh kasih sayang." },
  [PAPIKostickDimension.NEED_TO_BELONG_TO_GROUP]: { name: "Kebutuhan Diterima Kelompok (B)", description: "Kebutuhan untuk menjadi bagian dari kelompok dan diterima oleh orang lain." },
  [PAPIKostickDimension.NEED_FOR_RULES_AND_SUPERVISION]: { name: "Kebutuhan Aturan & Supervisi (Z)", description: "Kebutuhan akan aturan yang jelas, panduan, dan supervisi dari atasan." },
  [PAPIKostickDimension.ROLE_OF_HARD_INTENSE_WORKER]: { name: "Kebutuhan Berprestasi (N)", description: "Dorongan untuk berprestasi tinggi, bekerja keras, dan mencapai tujuan yang menantang." },
  [PAPIKostickDimension.ROLE_OF_FINISHER_OF_TASKS]: { name: "Menyelesaikan Tugas (G)", description: "Kebutuhan untuk menyelesaikan tugas yang telah dimulai hingga tuntas." },
  [PAPIKostickDimension.ROLE_OF_PLANNER_AND_ORGANIZER]: { name: "Perencana & Pengatur (I)", description: "Peran sebagai perencana, pengatur, dan pembuat keputusan yang cermat." },
  [PAPIKostickDimension.ROLE_OF_EMOTIONALLY_RESTRAINED_PERSON]: { name: "Pengendalian Emosi (E)", description: "Kebutuhan untuk mengendalikan emosi dan tidak menunjukkannya secara berlebihan." },
  [PAPIKostickDimension.NEED_TO_BE_SUPPORTIVE]: { name: "Suportif (S)", description: "Kebutuhan untuk mendukung atasan, loyal, dan membantu orang lain." },
  [PAPIKostickDimension.NEED_TO_BE_AGGRESSIVE]: { name: "Kebutuhan Agresif (K)", description: "Kebutuhan untuk bersikap asertif, kompetitif, dan kadang agresif untuk mencapai tujuan." },
  [PAPIKostickDimension.NEED_FOR_CHANGE]: { name: "Kebutuhan Perubahan (T)", description: "Kebutuhan akan variasi, perubahan, dan hal-hal baru dalam pekerjaan." },
  [PAPIKostickDimension.NEED_TO_BE_FORCEFUL]: { name: "Kebutuhan Mempertahankan Diri (V)", description: "Kebutuhan untuk bersikap tegas, mempertahankan pendapat, dan berani." },
  [PAPIKostickDimension.EASE_IN_DECISION_MAKING]: { name: "Mudah Membuat Keputusan (W)", description: "Kemudahan dan kecepatan dalam mengambil keputusan." },
  [PAPIKostickDimension.NEED_TO_FINISH_A_TASK_BEGUN]: { name: "Tipe Pekerja Keras/Tekun (F)", description: "Kebutuhan untuk bekerja keras, tekun, dan tidak mudah menyerah pada tugas." },
};

export const papiKostickQuestions: PAPIKostickPair[] = [

  {
    id: 'P1',
    statementA: { text: 'Saya suka memimpin sebuah tim.', dimension: PAPIKostickDimension.LEADERSHIP },
    statementB: { text: 'Saya lebih suka bekerja sendiri dengan cepat.', dimension: PAPIKostickDimension.ACTIVITY_PACE },
  },
  {
    id: 'P2',
    statementA: { text: 'Saya merasa nyaman mengambil tanggung jawab untuk orang lain.', dimension: PAPIKostickDimension.LEADERSHIP },
    statementB: { text: 'Saya lebih suka menyelesaikan tugas secara individual.', dimension: PAPIKostickDimension.ACTIVITY_PACE },
  },
  {
    id: 'P3',
    statementA: { text: 'Saya senang mengarahkan dan membimbing rekan kerja.', dimension: PAPIKostickDimension.LEADERSHIP },
    statementB: { text: 'Saya lebih suka bekerja dengan kecepatan saya sendiri.', dimension: PAPIKostickDimension.ACTIVITY_PACE },
  },


  {
    id: 'P4',
    statementA: { text: 'Saya senang bertemu orang baru dan menjadi pusat perhatian.', dimension: PAPIKostickDimension.SOCIAL_EXTROVERSION },
    statementB: { text: 'Saya menikmati menganalisis masalah secara mendalam.', dimension: PAPIKostickDimension.THEORETICAL_TYPE },
  },
  {
    id: 'P5',
    statementA: { text: 'Saya merasa berenergi saat berada di sekitar banyak orang.', dimension: PAPIKostickDimension.SOCIAL_EXTROVERSION },
    statementB: { text: 'Saya lebih suka menghabiskan waktu untuk berpikir dan merenung.', dimension: PAPIKostickDimension.THEORETICAL_TYPE },
  },
  {
    id: 'P6',
    statementA: { text: 'Saya senang menjadi terkenal dan dikenal oleh banyak orang.', dimension: PAPIKostickDimension.SOCIAL_EXTROVERSION },
    statementB: { text: 'Saya lebih tertarik pada konsep dan teori yang kompleks.', dimension: PAPIKostickDimension.THEORETICAL_TYPE },
  },


  {
    id: 'P7',
    statementA: { text: 'Saya merasa puas jika pekerjaan saya sangat detail dan akurat.', dimension: PAPIKostickDimension.INTEREST_IN_WORKING_WITH_DETAILS },
    statementB: { text: 'Saya suka mengatur dan merencanakan pekerjaan dengan sistematis.', dimension: PAPIKostickDimension.ORGANIZED_TYPE },
  },
  {
    id: 'P8',
    statementA: { text: 'Saya sangat memperhatikan detail kecil dalam pekerjaan.', dimension: PAPIKostickDimension.INTEREST_IN_WORKING_WITH_DETAILS },
    statementB: { text: 'Saya lebih suka mengikuti metode dan prosedur yang terstruktur.', dimension: PAPIKostickDimension.ORGANIZED_TYPE },
  },
  {
    id: 'P9',
    statementA: { text: 'Saya merasa penting untuk memeriksa setiap detail dengan teliti.', dimension: PAPIKostickDimension.INTEREST_IN_WORKING_WITH_DETAILS },
    statementB: { text: 'Saya lebih suka bekerja dengan sistem yang terorganisir.', dimension: PAPIKostickDimension.ORGANIZED_TYPE },
  },


  {
    id: 'P10',
    statementA: { text: 'Penting bagi saya untuk memiliki hubungan yang hangat dengan rekan kerja.', dimension: PAPIKostickDimension.NEED_FOR_CLOSENESS_AND_AFFECTION },
    statementB: { text: 'Saya merasa termotivasi untuk mencapai target yang tinggi.', dimension: PAPIKostickDimension.ROLE_OF_HARD_INTENSE_WORKER },
  },
  {
    id: 'P11',
    statementA: { text: 'Saya senang memberikan dan menerima dukungan emosional.', dimension: PAPIKostickDimension.NEED_FOR_CLOSENESS_AND_AFFECTION },
    statementB: { text: 'Saya selalu berusaha untuk menjadi yang terbaik dalam pekerjaan.', dimension: PAPIKostickDimension.ROLE_OF_HARD_INTENSE_WORKER },
  },
  {
    id: 'P12',
    statementA: { text: 'Saya merasa nyaman menunjukkan kasih sayang di tempat kerja.', dimension: PAPIKostickDimension.NEED_FOR_CLOSENESS_AND_AFFECTION },
    statementB: { text: 'Saya termotivasi oleh tantangan dan prestasi yang sulit.', dimension: PAPIKostickDimension.ROLE_OF_HARD_INTENSE_WORKER },
  },


  {
    id: 'P13',
    statementA: { text: 'Saya selalu berusaha menyelesaikan apa yang sudah saya mulai.', dimension: PAPIKostickDimension.ROLE_OF_FINISHER_OF_TASKS },
    statementB: { text: 'Saya lebih suka mengikuti aturan dan arahan yang jelas.', dimension: PAPIKostickDimension.NEED_FOR_RULES_AND_SUPERVISION },
  },
  {
    id: 'P14',
    statementA: { text: 'Saya merasa tidak nyaman jika ada tugas yang belum selesai.', dimension: PAPIKostickDimension.ROLE_OF_FINISHER_OF_TASKS },
    statementB: { text: 'Saya merasa lebih aman dengan supervisi yang ketat.', dimension: PAPIKostickDimension.NEED_FOR_RULES_AND_SUPERVISION },
  },
  {
    id: 'P15',
    statementA: { text: 'Saya tidak mudah menyerah sampai tugas benar-benar selesai.', dimension: PAPIKostickDimension.ROLE_OF_FINISHER_OF_TASKS },
    statementB: { text: 'Saya lebih suka bekerja dengan panduan yang jelas.', dimension: PAPIKostickDimension.NEED_FOR_RULES_AND_SUPERVISION },
  },


  {
    id: 'P16',
    statementA: { text: 'Saya nyaman mengambil keputusan penting.', dimension: PAPIKostickDimension.EASE_IN_DECISION_MAKING },
    statementB: { text: 'Saya cenderung menyembunyikan perasaan saya.', dimension: PAPIKostickDimension.ROLE_OF_EMOTIONALLY_RESTRAINED_PERSON },
  },
  {
    id: 'P17',
    statementA: { text: 'Saya dapat membuat keputusan dengan cepat dan tegas.', dimension: PAPIKostickDimension.EASE_IN_DECISION_MAKING },
    statementB: { text: 'Saya lebih suka tidak menunjukkan emosi saya secara terbuka.', dimension: PAPIKostickDimension.ROLE_OF_EMOTIONALLY_RESTRAINED_PERSON },
  },
  {
    id: 'P18',
    statementA: { text: 'Saya tidak ragu-ragu dalam mengambil keputusan.', dimension: PAPIKostickDimension.EASE_IN_DECISION_MAKING },
    statementB: { text: 'Saya merasa lebih nyaman mengendalikan emosi saya.', dimension: PAPIKostickDimension.ROLE_OF_EMOTIONALLY_RESTRAINED_PERSON },
  },


  {
    id: 'P19',
    statementA: { text: 'Saya senang membantu atasan saya berhasil.', dimension: PAPIKostickDimension.NEED_TO_BE_SUPPORTIVE },
    statementB: { text: 'Saya tidak ragu untuk bersikap tegas demi mencapai tujuan.', dimension: PAPIKostickDimension.NEED_TO_BE_AGGRESSIVE },
  },
  {
    id: 'P20',
    statementA: { text: 'Saya merasa puas mendukung dan membantu orang lain.', dimension: PAPIKostickDimension.NEED_TO_BE_SUPPORTIVE },
    statementB: { text: 'Saya tidak takut untuk bersaing dan berjuang keras.', dimension: PAPIKostickDimension.NEED_TO_BE_AGGRESSIVE },
  },
  {
    id: 'P21',
    statementA: { text: 'Saya loyal kepada atasan dan organisasi.', dimension: PAPIKostickDimension.NEED_TO_BE_SUPPORTIVE },
    statementB: { text: 'Saya siap untuk mengambil risiko dalam mencapai tujuan.', dimension: PAPIKostickDimension.NEED_TO_BE_AGGRESSIVE },
  },


  {
    id: 'P22',
    statementA: { text: 'Saya menyukai pekerjaan yang bervariasi dan penuh perubahan.', dimension: PAPIKostickDimension.NEED_FOR_CHANGE },
    statementB: { text: 'Saya akan berjuang keras untuk apa yang saya yakini benar.', dimension: PAPIKostickDimension.NEED_TO_BE_FORCEFUL },
  },
  {
    id: 'P23',
    statementA: { text: 'Saya merasa bosan dengan rutinitas yang monoton.', dimension: PAPIKostickDimension.NEED_FOR_CHANGE },
    statementB: { text: 'Saya tidak mudah menyerah pada tekanan atau tantangan.', dimension: PAPIKostickDimension.NEED_TO_BE_FORCEFUL },
  },
  {
    id: 'P24',
    statementA: { text: 'Saya selalu mencari hal-hal baru dan berbeda.', dimension: PAPIKostickDimension.NEED_FOR_CHANGE },
    statementB: { text: 'Saya siap untuk mempertahankan pendapat saya dengan tegas.', dimension: PAPIKostickDimension.NEED_TO_BE_FORCEFUL },
  },


  {
    id: 'P25',
    statementA: { text: 'Saya senang menjadi bagian dari tim yang solid.', dimension: PAPIKostickDimension.NEED_TO_BELONG_TO_GROUP },
    statementB: { text: 'Saya suka merencanakan segala sesuatu dengan hati-hati.', dimension: PAPIKostickDimension.ROLE_OF_PLANNER_AND_ORGANIZER },
  },
  {
    id: 'P26',
    statementA: { text: 'Saya merasa penting untuk diterima oleh kelompok.', dimension: PAPIKostickDimension.NEED_TO_BELONG_TO_GROUP },
    statementB: { text: 'Saya lebih suka mengorganisir dan mengatur kegiatan.', dimension: PAPIKostickDimension.ROLE_OF_PLANNER_AND_ORGANIZER },
  },
  {
    id: 'P27',
    statementA: { text: 'Saya merasa nyaman bekerja dalam kelompok yang kohesif.', dimension: PAPIKostickDimension.NEED_TO_BELONG_TO_GROUP },
    statementB: { text: 'Saya senang membuat strategi dan rencana yang detail.', dimension: PAPIKostickDimension.ROLE_OF_PLANNER_AND_ORGANIZER },
  },


  {
    id: 'P28',
    statementA: { text: 'Saya adalah pekerja keras dan tekun.', dimension: PAPIKostickDimension.NEED_TO_FINISH_A_TASK_BEGUN },
    statementB: { text: 'Saya suka mengendalikan situasi dan orang-orang di sekitar saya.', dimension: PAPIKostickDimension.NEED_TO_CONTROL_OTHERS },
  },
  {
    id: 'P29',
    statementA: { text: 'Saya tidak mudah menyerah meskipun tugas sulit.', dimension: PAPIKostickDimension.NEED_TO_FINISH_A_TASK_BEGUN },
    statementB: { text: 'Saya merasa nyaman mengatur dan mengarahkan orang lain.', dimension: PAPIKostickDimension.NEED_TO_CONTROL_OTHERS },
  },
  {
    id: 'P30',
    statementA: { text: 'Saya memiliki ketekunan yang tinggi dalam pekerjaan.', dimension: PAPIKostickDimension.NEED_TO_FINISH_A_TASK_BEGUN },
    statementB: { text: 'Saya senang memiliki kendali atas situasi kerja.', dimension: PAPIKostickDimension.NEED_TO_CONTROL_OTHERS },
  },


  {
    id: 'P31',
    statementA: { text: 'Saya merasa nyaman memimpin rapat atau diskusi.', dimension: PAPIKostickDimension.LEADERSHIP },
    statementB: { text: 'Saya senang menjadi pusat perhatian dalam kelompok.', dimension: PAPIKostickDimension.SOCIAL_EXTROVERSION },
  },
  {
    id: 'P32',
    statementA: { text: 'Saya suka mengambil inisiatif dalam proyek.', dimension: PAPIKostickDimension.LEADERSHIP },
    statementB: { text: 'Saya merasa berenergi saat bersosialisasi dengan banyak orang.', dimension: PAPIKostickDimension.SOCIAL_EXTROVERSION },
  },

  // Activity Pace vs Theoretical Type (2 questions)
  {
    id: 'P33',
    statementA: { text: 'Saya lebih suka menyelesaikan tugas dengan cepat.', dimension: PAPIKostickDimension.ACTIVITY_PACE },
    statementB: { text: 'Saya menikmati mempelajari teori dan konsep baru.', dimension: PAPIKostickDimension.THEORETICAL_TYPE },
  },
  {
    id: 'P34',
    statementA: { text: 'Saya merasa tidak nyaman dengan pekerjaan yang lambat.', dimension: PAPIKostickDimension.ACTIVITY_PACE },
    statementB: { text: 'Saya lebih suka berpikir mendalam tentang masalah.', dimension: PAPIKostickDimension.THEORETICAL_TYPE },
  },


  {
    id: 'P35',
    statementA: { text: 'Saya sangat memperhatikan akurasi dalam pekerjaan.', dimension: PAPIKostickDimension.INTEREST_IN_WORKING_WITH_DETAILS },
    statementB: { text: 'Saya merasa penting untuk memiliki hubungan dekat dengan rekan kerja.', dimension: PAPIKostickDimension.NEED_FOR_CLOSENESS_AND_AFFECTION },
  },
  {
    id: 'P36',
    statementA: { text: 'Saya merasa puas dengan pekerjaan yang sangat teliti.', dimension: PAPIKostickDimension.INTEREST_IN_WORKING_WITH_DETAILS },
    statementB: { text: 'Saya senang memberikan dukungan emosional kepada rekan kerja.', dimension: PAPIKostickDimension.NEED_FOR_CLOSENESS_AND_AFFECTION },
  },


  {
    id: 'P37',
    statementA: { text: 'Saya lebih suka bekerja dengan sistem yang terstruktur.', dimension: PAPIKostickDimension.ORGANIZED_TYPE },
    statementB: { text: 'Saya selalu berusaha mencapai target yang menantang.', dimension: PAPIKostickDimension.ROLE_OF_HARD_INTENSE_WORKER },
  },
  {
    id: 'P38',
    statementA: { text: 'Saya merasa nyaman dengan prosedur yang jelas.', dimension: PAPIKostickDimension.ORGANIZED_TYPE },
    statementB: { text: 'Saya termotivasi oleh kesuksesan dan prestasi.', dimension: PAPIKostickDimension.ROLE_OF_HARD_INTENSE_WORKER },
  },


  {
    id: 'P39',
    statementA: { text: 'Saya merasa tidak lengkap jika tugas belum selesai.', dimension: PAPIKostickDimension.ROLE_OF_FINISHER_OF_TASKS },
    statementB: { text: 'Saya dapat membuat keputusan dengan cepat dan yakin.', dimension: PAPIKostickDimension.EASE_IN_DECISION_MAKING },
  },
  {
    id: 'P40',
    statementA: { text: 'Saya memiliki komitmen tinggi untuk menyelesaikan tugas.', dimension: PAPIKostickDimension.ROLE_OF_FINISHER_OF_TASKS },
    statementB: { text: 'Saya tidak ragu dalam mengambil keputusan penting.', dimension: PAPIKostickDimension.EASE_IN_DECISION_MAKING },
  },


  {
    id: 'P41',
    statementA: { text: 'Saya merasa lebih aman dengan aturan yang jelas.', dimension: PAPIKostickDimension.NEED_FOR_RULES_AND_SUPERVISION },
    statementB: { text: 'Saya lebih suka mengendalikan emosi saya di tempat kerja.', dimension: PAPIKostickDimension.ROLE_OF_EMOTIONALLY_RESTRAINED_PERSON },
  },
  {
    id: 'P42',
    statementA: { text: 'Saya menghargai supervisi yang ketat dan teratur.', dimension: PAPIKostickDimension.NEED_FOR_RULES_AND_SUPERVISION },
    statementB: { text: 'Saya tidak mudah menunjukkan perasaan saya secara terbuka.', dimension: PAPIKostickDimension.ROLE_OF_EMOTIONALLY_RESTRAINED_PERSON },
  },


  {
    id: 'P43',
    statementA: { text: 'Saya senang membantu dan mendukung rekan kerja.', dimension: PAPIKostickDimension.NEED_TO_BE_SUPPORTIVE },
    statementB: { text: 'Saya merasa bosan dengan rutinitas yang sama setiap hari.', dimension: PAPIKostickDimension.NEED_FOR_CHANGE },
  },
  {
    id: 'P44',
    statementA: { text: 'Saya loyal kepada tim dan organisasi.', dimension: PAPIKostickDimension.NEED_TO_BE_SUPPORTIVE },
    statementB: { text: 'Saya selalu mencari variasi dalam pekerjaan.', dimension: PAPIKostickDimension.NEED_FOR_CHANGE },
  },


  {
    id: 'P45',
    statementA: { text: 'Saya tidak takut untuk bersaing dan berjuang keras.', dimension: PAPIKostickDimension.NEED_TO_BE_AGGRESSIVE },
    statementB: { text: 'Saya siap untuk mempertahankan pendapat saya dengan tegas.', dimension: PAPIKostickDimension.NEED_TO_BE_FORCEFUL },
  },
  {
    id: 'P46',
    statementA: { text: 'Saya siap mengambil risiko untuk mencapai tujuan.', dimension: PAPIKostickDimension.NEED_TO_BE_AGGRESSIVE },
    statementB: { text: 'Saya tidak mudah menyerah pada tekanan atau tantangan.', dimension: PAPIKostickDimension.NEED_TO_BE_FORCEFUL },
  },


  {
    id: 'P47',
    statementA: { text: 'Saya merasa penting untuk diterima oleh kelompok kerja.', dimension: PAPIKostickDimension.NEED_TO_BELONG_TO_GROUP },
    statementB: { text: 'Saya senang membuat rencana dan strategi yang detail.', dimension: PAPIKostickDimension.ROLE_OF_PLANNER_AND_ORGANIZER },
  },
  {
    id: 'P48',
    statementA: { text: 'Saya merasa nyaman bekerja dalam tim yang solid.', dimension: PAPIKostickDimension.NEED_TO_BELONG_TO_GROUP },
    statementB: { text: 'Saya lebih suka mengorganisir dan mengatur kegiatan.', dimension: PAPIKostickDimension.ROLE_OF_PLANNER_AND_ORGANIZER },
  },


  {
    id: 'P49',
    statementA: { text: 'Saya memiliki ketekunan yang tinggi dalam menyelesaikan tugas.', dimension: PAPIKostickDimension.NEED_TO_FINISH_A_TASK_BEGUN },
    statementB: { text: 'Saya merasa nyaman mengatur dan mengarahkan orang lain.', dimension: PAPIKostickDimension.NEED_TO_CONTROL_OTHERS },
  },
  {
    id: 'P50',
    statementA: { text: 'Saya tidak mudah menyerah meskipun menghadapi kesulitan.', dimension: PAPIKostickDimension.NEED_TO_FINISH_A_TASK_BEGUN },
    statementB: { text: 'Saya senang memiliki kendali atas situasi dan orang lain.', dimension: PAPIKostickDimension.NEED_TO_CONTROL_OTHERS },
  },
];


export const getRandomPAPIKostickQuestions = (): PAPIKostickPair[] => {

  const allDimensions = Object.values(PAPIKostickDimension);
  const questionsByDimension: Record<PAPIKostickDimension, PAPIKostickPair[]> = {} as any;
  

  allDimensions.forEach(dimension => {
    questionsByDimension[dimension] = [];
  });


  papiKostickQuestions.forEach(question => {
    questionsByDimension[question.statementA.dimension].push(question);
    questionsByDimension[question.statementB.dimension].push(question);
  });


  const selectedQuestions: PAPIKostickPair[] = [];
  const questionsPerDimension = Math.floor(20 / allDimensions.length); 
  

  allDimensions.forEach(dimension => {
    const dimensionQuestions = questionsByDimension[dimension];
    if (dimensionQuestions.length > 0) {

      const shuffled = [...dimensionQuestions].sort(() => Math.random() - 0.5);

      selectedQuestions.push(...shuffled.slice(0, questionsPerDimension));
    }
  });


  if (selectedQuestions.length < 20) {
    const remainingQuestions = papiKostickQuestions.filter(q => !selectedQuestions.includes(q));
    const shuffled = [...remainingQuestions].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, 20 - selectedQuestions.length));
  }


  return selectedQuestions.sort(() => Math.random() - 0.5);
};

