import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { PsychometricTestResult, PsychometricTestType, PsychometricTestDescriptions, MBTIResultData } from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
// import { GoogleGenerativeAI } from "@google/generative-ai"; // For future Gemini integration

const ViewPsychometricResultPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const { currentUser } = useAuth();
  const [result, setResult] = useState<PsychometricTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [recommendationsLoading, setRecommendationsLoading] = useState(false); // For Gemini
  // const [careerRecommendations, setCareerRecommendations] = useState<string[]>([]); // For Gemini

  useEffect(() => {
    if (!resultId) {
      setError('ID Hasil Tes tidak valid.');
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const resultDocRef = doc(db, 'psychometricTestResults', resultId);
        const docSnap = await getDoc(resultDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as PsychometricTestResult;
          if (data.userId !== currentUser?.uid && currentUser?.role !== 'Admin') {
            setError('Anda tidak memiliki izin untuk melihat hasil tes ini.');
            setResult(null);
          } else {
            setResult(data);
            // if (data.careerRecommendations && data.careerRecommendations.length > 0) {
            //   setCareerRecommendations(data.careerRecommendations);
            // } else if (data.testType === PsychometricTestType.MBTI && data.resultData?.mbtiType) {
            //   // fetchRecommendations(data.resultData.mbtiType); // For future Gemini integration
            // }
          }
        } else {
          setError('Hasil tes tidak ditemukan.');
          setResult(null);
        }
      } catch (err) {
        console.error("Error fetching test result:", err);
        setError('Gagal memuat hasil tes.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchResult();
    } else {
      setLoading(false); // Wait for currentUser to be available
    }
  }, [resultId, currentUser]);

  // const fetchRecommendations = async (mbtiType: string) => { // Example for future Gemini integration
  //   if (!process.env.API_KEY) {
  //     console.warn("API_KEY for Gemini not set. Skipping recommendations.");
  //     setCareerRecommendations(["Rekomendasi karir membutuhkan konfigurasi lebih lanjut (API Key)."]);
  //     return;
  //   }
  //   setRecommendationsLoading(true);
  //   try {
  //     const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });
  //     const model = 'gemini-2.5-flash-preview-04-17'; // or your preferred model
  //     const prompt = `Based on the MBTI type ${mbtiType}, suggest 3-5 suitable career paths with a brief (1-2 sentences) explanation for each. Format as a list.`;
      
  //     const response = await ai.models.generateContent({
  //       model: model,
  //       contents: [{ role: "user", parts: [{ text: prompt }] }],
  //     });

  //     const text = response.text;
  //     // Basic parsing, assuming Gemini returns a list-like string
  //     const recommendationsArray = text.split('\n').map(r => r.trim()).filter(r => r && (r.startsWith('-') || r.startsWith('*') || /^\d+\./.test(r)));
  //     setCareerRecommendations(recommendationsArray.length > 0 ? recommendationsArray : ["Tidak ada rekomendasi spesifik yang dapat dihasilkan saat ini."]);
      
  //     // Optionally, save these recommendations back to Firestore if they are generated on first view.
  //   } catch (err) {
  //     console.error("Error fetching career recommendations from Gemini:", err);
  //     setCareerRecommendations(["Gagal memuat rekomendasi karir."]);
  //   } finally {
  //     setRecommendationsLoading(false);
  //   }
  // };


  if (loading || !currentUser) return <Spinner fullPage={true} />;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;
  if (!result) return <p className="text-center p-8">Hasil tes tidak ditemukan atau Anda tidak memiliki akses.</p>;

  const testMeta = PsychometricTestDescriptions[result.testType];
  const resultData = result.resultData as MBTIResultData; // Assuming MBTI for now

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          {testMeta.icon && <i className={`${testMeta.icon} text-5xl text-sky-500 mb-4`}></i>}
          <h1 className="text-3xl font-bold text-gray-800">Hasil Tes {testMeta.name}</h1>
          <p className="text-sm text-gray-500">
            Tanggal Tes: {new Date(result.testDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {result.testType === PsychometricTestType.MBTI && resultData && (
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-sky-600 text-center mb-2">{resultData.mbtiType}</h2>
            <h3 className="text-2xl text-gray-700 text-center font-semibold mb-4">{resultData.mbtiTitle || 'Tipe Kepribadian Anda'}</h3>
            <p className="text-gray-600 leading-relaxed text-center mb-6">{resultData.mbtiDescription || 'Deskripsi untuk tipe ini belum tersedia.'}</p>
            
            {/* Optional: Display scores */}
            {/* <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-semibold text-gray-700 mb-2">Detail Skor Preferensi:</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li>Ekstrovert (E): {resultData.scores.E} vs Introvert (I): {resultData.scores.I}</li>
                <li>Sensing (S): {resultData.scores.S} vs Intuition (N): {resultData.scores.N}</li>
                <li>Thinking (T): {resultData.scores.T} vs Feeling (F): {resultData.scores.F}</li>
                <li>Judging (J): {resultData.scores.J} vs Perceiving (P): {resultData.scores.P}</li>
              </ul>
            </div> */}
          </div>
        )}

        {/* Placeholder for other test type results */}
        {result.testType !== PsychometricTestType.MBTI && (
          <p className="text-gray-600 text-center">Tampilan detail untuk hasil tes {testMeta.name} akan segera tersedia.</p>
        )}
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Rekomendasi Karir</h3>
          {/* {recommendationsLoading && <Spinner />}
          {!recommendationsLoading && careerRecommendations.length > 0 && (
            <ul className="list-disc list-inside space-y-2 text-gray-600 pl-5">
              {careerRecommendations.map((rec, index) => <li key={index}>{rec}</li>)}
            </ul>
          )}
          {!recommendationsLoading && careerRecommendations.length === 0 && (
            <p className="text-gray-500">Rekomendasi karir spesifik untuk hasil tes ini akan segera tersedia.</p>
          )} */}
          <p className="text-gray-500 bg-amber-50 border border-amber-200 p-3 rounded-md">
            <i className="fas fa-lightbulb mr-2 text-amber-500"></i>
            Fitur rekomendasi karir (termasuk yang menggunakan AI Gemini) sedang dalam pengembangan dan akan segera tersedia di sini.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link to={APP_ROUTES.MY_PSYCHOMETRIC_RESULTS} className="btn-secondary mr-3">
            <i className="fas fa-history mr-2"></i>Lihat Semua Hasil Tes Saya
          </Link>
          <Link to={APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW} className="btn-primary">
            <i className="fas fa-redo mr-2"></i>Ambil Tes Lain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewPsychometricResultPage;
