import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { db, auth } from '@/config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { 
  PsychometricTestType, 
  User, 
  MBTIQuestion, 
  MBTIResult, 
  MBTIResultData,
  PAPIKostickPair, 
  PAPIKostickResultData, 
  PAPIKostickDimension,
  KraepelinQuestion,
  KraepelinResultData,
  PsychometricTestResult,
  PsychometricTestDescriptions,
  MBTIChoice
} from '@/types';
import { mbtiQuestions, mbtiTypeDescriptions, getRandomMBTIQuestions } from '@/data/mbtiQuestions';
import { kraepelinQuestions, getKraepelinProfile, KRAEPELIN_ASPECT_QUESTIONS_COUNT, getRandomKraepelinQuestions } from '@/components/charts/data/kraepelinQuestions';
import { papiKostickQuestions, papiKostickDimensionDescriptions, getRandomPAPIKostickQuestions } from '@/components/charts/data/papiKostickQuestions';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { logUserActivity } from '@/utils/activityLogger';

const TakePsychometricTestPage: React.FC = () => {
  const { testTypePath } = useParams<{ testTypePath: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [currentTest, setCurrentTest] = useState<PsychometricTestType | null>(null);
  const [questions, setQuestions] = useState<Array<MBTIQuestion | KraepelinQuestion | PAPIKostickPair>>([]);
  const [answers, setAnswers] = useState<Record<string, MBTIChoice | number | PAPIKostickDimension>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Waktu habis, lanjut ke pertanyaan berikutnya
            handleNextQuestion();
            return 15; // Reset timer untuk pertanyaan berikutnya
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeLeft]);

  // Start timer when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      setTimeLeft(15);
      setIsTimerActive(true);
    }
  }, [currentQuestionIndex, questions.length]);

  // Stop timer when test is completed
  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setIsTimerActive(false);
    }
  }, [currentQuestionIndex, questions.length]);

  // Cek apakah user sudah pernah mengambil tes ini
  useEffect(() => {
    const checkTestHistory = async () => {
      if (!currentUser) return;
      
      try {
        const testEntry = Object.entries(PsychometricTestDescriptions).find(
          ([_, desc]) => desc.pathSuffix === testTypePath
        );
        
        if (testEntry) {
          const testKey = testEntry[0] as PsychometricTestType;
          
          // Cek apakah sudah ada hasil tes untuk user ini
          const testResultsRef = collection(db, 'psychometricTestResults');
          const q = query(
            testResultsRef, 
            where('userId', '==', currentUser.uid),
            where('testType', '==', testKey)
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setHasTakenTest(true);
            setError(`Anda sudah pernah mengambil tes ${testEntry[1].name}. Setiap user hanya dapat mengambil tes ini satu kali.`);
          }
        }
      } catch (err) {
        console.error('Error checking test history:', err);
      }
    };

    checkTestHistory();
  }, [currentUser, testTypePath]);

  useEffect(() => {
    const testEntry = Object.entries(PsychometricTestDescriptions).find(
      ([_, desc]) => desc.pathSuffix === testTypePath
    );

    if (testEntry) {
      const testKey = testEntry[0] as PsychometricTestType;
      const testInfo = testEntry[1] as typeof PsychometricTestDescriptions[PsychometricTestType]; 
      
      setCurrentTest(testKey);
      if (!testInfo.available) {
        setError(`Tes ${testInfo.name} segera hadir atau sedang dalam pemeliharaan.`);
        setQuestions([]);
        return;
      }

      switch (testKey) {
        case PsychometricTestType.MBTI:
          // Gunakan pertanyaan random untuk MBTI
          setQuestions(getRandomMBTIQuestions());
          break;
        case PsychometricTestType.KRAEPELIN:
          // Gunakan pertanyaan random untuk Kraepelin
          setQuestions(getRandomKraepelinQuestions());
          break;
        case PsychometricTestType.PAPI_KOSTICK:
          // Gunakan pertanyaan random untuk PAPI Kostick
          setQuestions(getRandomPAPIKostickQuestions());
          break;
        default:
          const exhaustiveCheck: never = testKey; 
          setError("Tipe tes ini tidak dikenal atau belum didukung (kesalahan sistem).");
          console.error("Unhandled test type:", exhaustiveCheck)
          setQuestions([]);
          return; 
      }
    } else {
      setError('Jenis tes tidak dikenal.');
      setQuestions([]);
      navigate(APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW);
    }
  }, [testTypePath, navigate]);

  const handleAnswer = (questionId: string, choice: MBTIChoice | number | PAPIKostickDimension) => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Test completed
      setIsTimerActive(false);
      handleSubmitTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateMBTIResult = (): MBTIResultData | null => {
    const mbtiQs = questions as MBTIQuestion[];
    if (Object.keys(answers).length !== mbtiQs.length) {
      setError("Harap jawab semua pertanyaan sebelum melihat hasil.");
      return null;
    }
    const scores: MBTIResultData['scores'] = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    mbtiQs.forEach(q => {
      const answer = answers[q.id] as MBTIChoice; 
      if (answer && scores[answer] !== undefined) {
          scores[answer]++;
      }
    });
    const ei = scores.E >= scores.I ? 'E' : 'I';
    const sn = scores.S >= scores.N ? 'S' : 'N';
    const tf = scores.T >= scores.F ? 'T' : 'F';
    const jp = scores.J >= scores.P ? 'J' : 'P';
    const mbtiType = `${ei}${sn}${tf}${jp}`;
    const typeInfo = mbtiTypeDescriptions[mbtiType] || { title: "Tipe Tidak Dikenal", description: "Deskripsi untuk tipe ini belum tersedia."};
    return { scores, mbtiType, mbtiTitle: typeInfo.title, mbtiDescription: typeInfo.description };
  };

  const calculateKraepelinResult = (): KraepelinResultData | null => {
    const kraepelinQs = questions as KraepelinQuestion[];
    if (Object.keys(answers).length !== kraepelinQs.length) {
      setError("Harap jawab semua pertanyaan sebelum melihat hasil.");
      return null;
    }
    const scores: KraepelinResultData['scores'] = { concentration: 0, speed: 0, accuracy: 0, stamina: 0 };
    kraepelinQs.forEach(q => {
      const optionIndex = answers[q.id] as number; 
      if (optionIndex !== undefined && q.options[optionIndex]) {
        const selectedOption = q.options[optionIndex];
        scores[selectedOption.aspect] += selectedOption.score;
      }
    });
    const profileSummary = getKraepelinProfile(scores);
    return { scores, profileSummary, profileDescription: `Skor Anda (relatif): Konsentrasi ${scores.concentration}/${KRAEPELIN_ASPECT_QUESTIONS_COUNT.concentration*3}, Kecepatan ${scores.speed}/${KRAEPELIN_ASPECT_QUESTIONS_COUNT.speed*3}, Akurasi ${scores.accuracy}/${KRAEPELIN_ASPECT_QUESTIONS_COUNT.accuracy*3}, Stamina ${scores.stamina}/${KRAEPELIN_ASPECT_QUESTIONS_COUNT.stamina*3}.` };
  };

  const calculatePAPIKostickResult = (): PAPIKostickResultData | null => {
    const papiQs = questions as PAPIKostickPair[];
    if (Object.keys(answers).length !== papiQs.length) {
      setError("Harap jawab semua pertanyaan sebelum melihat hasil.");
      return null;
    }
    const scores = Object.values(PAPIKostickDimension).reduce((acc, dim) => {
      acc[dim] = 0;
      return acc;
    }, {} as Record<PAPIKostickDimension, number>);


    papiQs.forEach(q => {
      const chosenDimension = answers[q.id] as PAPIKostickDimension; 
      if (chosenDimension && scores[chosenDimension] !== undefined) scores[chosenDimension]++;
    });

    const sortedDimensions = (Object.entries(scores) as [PAPIKostickDimension, number][])
      .sort(([, a], [, b]) => b - a)
      .map(([dim, score]) => ({
        dimension: dim,
        name: papiKostickDimensionDescriptions[dim]?.name || dim,
        description: papiKostickDimensionDescriptions[dim]?.description || "Deskripsi tidak tersedia.",
        score: score
      }));
    
    const dominantDimensions = sortedDimensions.slice(0, 3).filter(d => d.score > 0); 
    let profileSummary = "Preferensi peran dan kebutuhan Anda menunjukkan kecenderungan terhadap: ";
    if (dominantDimensions.length > 0) {
      profileSummary += dominantDimensions.map(d => d.name).join(', ') + ".";
    } else {
      profileSummary = "Pola jawaban Anda tidak menunjukkan preferensi yang sangat menonjol pada aspek tertentu dalam simulasi ini.";
    }

    return { scores, dominantDimensions, profileSummary };
  };

  const handleSubmitTest = async () => {
    if (!currentUser || !currentTest || !auth.currentUser) return;
    setError(null); 

    let resultData: any;
    switch (currentTest) {
      case PsychometricTestType.MBTI:
        resultData = calculateMBTIResult();
        break;
      case PsychometricTestType.KRAEPELIN:
        resultData = calculateKraepelinResult();
        break;
      case PsychometricTestType.PAPI_KOSTICK:
        resultData = calculatePAPIKostickResult();
        break;
      default:
        const exhaustiveCheck: never = currentTest;
        setError("Sistem penilaian untuk tes ini belum tersedia.");
        console.error("Unhandled test type for submission:", exhaustiveCheck);
        return;
    }
    if (!resultData) return; 

    setLoading(true);
    const testResult: Omit<PsychometricTestResult, 'id'> = {
      userId: currentUser.uid,
      testType: currentTest,
      testDate: Date.now(),
      resultData: resultData,
      careerRecommendations: [],
    };

    try {
      // Simpan hasil tes
      const docRef = await addDoc(collection(db, 'psychometricTestResults'), {
        ...testResult,
        testDate: serverTimestamp(),
      });

      // Update profil user dengan hasil tes
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        [`psychometricResults.${currentTest}`]: {
          resultId: docRef.id,
          testDate: Date.now(),
          resultData: resultData
        }
      });

      // Update CV dengan hasil tes (jika ada CV)
      const cvsRef = collection(db, 'cvs');
      const cvQuery = query(cvsRef, where('userId', '==', currentUser.uid));
      const cvSnapshot = await getDocs(cvQuery);
      
      if (!cvSnapshot.empty) {
        const cvDoc = cvSnapshot.docs[0];
        const cvData = cvDoc.data();
        
        // Tambahkan hasil tes ke CV
        const updatedSections = cvData.sections.map((section: any) => {
          if (section.type === 'CUSTOM' && section.title === 'Hasil Tes Psikometri') {
            // Update section yang sudah ada
            return {
              ...section,
              customContent: `**${currentTest}**: ${resultData.mbtiType || resultData.profileSummary || 'Hasil tes tersedia'}`
            };
          }
          return section;
        });

        // Jika belum ada section untuk hasil tes, tambahkan
        if (!updatedSections.find((s: any) => s.type === 'CUSTOM' && s.title === 'Hasil Tes Psikometri')) {
          updatedSections.push({
            id: `psychometric-${Date.now()}`,
            type: 'CUSTOM',
            title: 'Hasil Tes Psikometri',
            order: updatedSections.length + 1,
            customContent: `**${currentTest}**: ${resultData.mbtiType || resultData.profileSummary || 'Hasil tes tersedia'}`
          });
        }

        await updateDoc(doc(db, 'cvs', cvDoc.id), {
          sections: updatedSections,
          updatedAt: Date.now()
        });
      }

      await logUserActivity(auth, db, 'PSYCHOMETRIC_TEST_SUBMIT_SUCCESS', { testType: currentTest, resultId: docRef.id });
      navigate(APP_ROUTES.VIEW_PSYCHOMETRIC_RESULT.replace(':resultId', docRef.id));
    } catch (err: any) {
      console.error("Error saving test result:", err);
      setError(err.message || "Gagal menyimpan hasil tes.");
      await logUserActivity(auth, db, 'PSYCHOMETRIC_TEST_SUBMIT_FAILURE', { testType: currentTest, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!currentTest || (questions.length === 0 && !error) ) {
    return <Spinner fullPage />;
  }
  
  const currentTestMeta = PsychometricTestDescriptions[currentTest];
  if (error && currentTestMeta && !currentTestMeta.available) {
     return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Tes Psikometri: {currentTestMeta.name || ''}</h1>
            <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            <Link to={APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW} className="btn-primary mt-6">Kembali ke Daftar Tes</Link>
        </div>
    );
  }
  
  // Jika user sudah pernah mengambil tes
  if (hasTakenTest) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tes Psikometri: {currentTestMeta?.name || ''}</h1>
        <p className="text-red-500 bg-red-100 p-4 rounded-md mb-6">{error}</p>
        <div className="space-x-4">
          <Link to={APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW} className="btn-secondary">
            Kembali ke Daftar Tes
          </Link>
          <Link to={APP_ROUTES.MY_PSYCHOMETRIC_RESULTS} className="px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold">Lihat Hasil Tes Saya</Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Timer color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-red-500';
    if (timeLeft <= 10) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getTimerBgColor = () => {
    if (timeLeft <= 5) return 'bg-red-100';
    if (timeLeft <= 10) return 'bg-amber-100';
    return 'bg-emerald-100';
  };

  const renderQuestion = () => {
    if (!currentQ) return null;
    switch (currentTest) {
      case PsychometricTestType.MBTI:
        const mbtiQ = currentQ as MBTIQuestion;
        return (
          <div className="space-y-3">
            <button onClick={() => handleAnswer(mbtiQ.id, mbtiQ.optionA.value)} className={`w-full text-left p-4 rounded-md border-2 transition-colors duration-200 ${answers[mbtiQ.id] === mbtiQ.optionA.value ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'}`}>{mbtiQ.optionA.text}</button>
            <button onClick={() => handleAnswer(mbtiQ.id, mbtiQ.optionB.value)} className={`w-full text-left p-4 rounded-md border-2 transition-colors duration-200 ${answers[mbtiQ.id] === mbtiQ.optionB.value ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'}`}>{mbtiQ.optionB.text}</button>
          </div>
        );
      case PsychometricTestType.KRAEPELIN:
        const kraepelinQ = currentQ as KraepelinQuestion;
        return (
          <div className="space-y-3">
            {kraepelinQ.options.map((opt, index) => (
              <button key={index} onClick={() => handleAnswer(kraepelinQ.id, index)} className={`w-full text-left p-4 rounded-md border-2 transition-colors duration-200 ${answers[kraepelinQ.id] === index ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'}`}>{opt.text}</button>
            ))}
          </div>
        );
      case PsychometricTestType.PAPI_KOSTICK:
        const papiQ = currentQ as PAPIKostickPair;
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Pilihlah pernyataan yang paling sesuai dengan diri Anda:</p>
            <button onClick={() => handleAnswer(papiQ.id, papiQ.statementA.dimension)} className={`w-full text-left p-4 rounded-md border-2 transition-colors duration-200 ${answers[papiQ.id] === papiQ.statementA.dimension ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'}`}>{papiQ.statementA.text}</button>
            <button onClick={() => handleAnswer(papiQ.id, papiQ.statementB.dimension)} className={`w-full text-left p-4 rounded-md border-2 transition-colors duration-200 ${answers[papiQ.id] === papiQ.statementB.dimension ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300' : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200'}`}>{papiQ.statementB.text}</button>
          </div>
        );
      default: return <p>Tipe pertanyaan tidak didukung.</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tes Psikometri: {currentTestMeta?.name || ''}</h1>
          <p className="text-gray-600 text-base">Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</p>
        </div>
        {/* Timer */}
        <div className={`mb-4 p-4 rounded-lg border-2 ${getTimerBgColor()} border-gray-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock text-gray-600"></i>
              <span className="text-sm text-gray-600">Waktu tersisa:</span>
            </div>
            <div className={`text-2xl font-bold ${getTimerColor()}`}>{timeLeft}s</div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        {currentQ && (
          <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
            <p className="text-lg font-medium text-gray-700 mb-6 min-h-[40px]">
              { (currentQ as MBTIQuestion | KraepelinQuestion)?.text || `Pasangan Pernyataan ${currentQuestionIndex + 1}`}
            </p>
            {renderQuestion()}
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || loading} className="btn-secondary px-6 py-2 disabled:opacity-50 w-full sm:w-auto"><i className="fas fa-arrow-left mr-2"></i> Sebelumnya</button>
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNextQuestion} disabled={loading || answers[currentQ?.id] === undefined} className="btn-primary px-6 py-2 disabled:opacity-50 w-full sm:w-auto">Selanjutnya <i className="fas fa-arrow-right ml-2"></i></button>
          ) : (
            <button onClick={handleSubmitTest} disabled={loading || Object.keys(answers).length !== questions.length} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">{loading ? <Spinner size="sm" color="text-white"/> : 'Lihat Hasil Tes'} <i className="fas fa-poll ml-2"></i></button>
          )}
        </div>
        {error && currentTestMeta && currentTestMeta.available && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default TakePsychometricTestPage;
