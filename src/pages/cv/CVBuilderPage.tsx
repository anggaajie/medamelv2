import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/config/firebase'; 
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, FieldValue } from 'firebase/firestore';
import {
  UserCV, CVSection, CVSectionType, DefaultCVSectionTitles,
  CVExperienceEntry, CVEducationEntry, CVSkillEntry, User, CVFieldType, CVField
} from '@/types';
import Spinner from '@/components/Spinner';
import { APP_ROUTES } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import { logUserActivity } from '@/utils/activityLogger';
import { DocumentTextIcon, FloppyDiskIcon, ArrowLeftIcon, XIcon, PlusCircleIcon, MenuIcon } from '@/components/icons/PhosphorIcons';

const createNewSection = (type: CVSectionType, order: number): CVSection => {
  const baseSection: Partial<CVSection> = {
    id: uuidv4(),
    type,
    title: DefaultCVSectionTitles[type],
    order,
  };

  if (type === CVSectionType.SUMMARY) {
    baseSection.fields = [{ id: 'summaryContent', label: 'Ringkasan', value: '', type: CVFieldType.TEXT_AREA }];
  } else if (type === CVSectionType.EXPERIENCE || type === CVSectionType.EDUCATION || type === CVSectionType.SKILLS) {
    baseSection.data = [];
  } else if (type === CVSectionType.PERSONAL_DETAILS || type === CVSectionType.CONTACT) {
    baseSection.fields = [];
  }
  return baseSection as CVSection;
};

const getInitialCVData = (user: User | null): Omit<UserCV, 'id' | 'createdAt' | 'updatedAt'> => {
  const initialSections: CVSection[] = [
    createNewSection(CVSectionType.PERSONAL_DETAILS, 0),
    createNewSection(CVSectionType.CONTACT, 1),
    createNewSection(CVSectionType.SUMMARY, 2),
    createNewSection(CVSectionType.EXPERIENCE, 3),
    createNewSection(CVSectionType.EDUCATION, 4),
    createNewSection(CVSectionType.SKILLS, 5),
  ];

  if (user) {
    const personalDetailsSection = initialSections.find(s => s.type === CVSectionType.PERSONAL_DETAILS)!;
    personalDetailsSection.fields = [
      { id: 'fullName', label: 'Nama Lengkap', value: user.displayName || '', type: CVFieldType.TEXT_INPUT, placeholder: 'Nama Lengkap Anda' },
      { id: 'jobTitle', label: 'Posisi/Jabatan Saat Ini', value: '', type: CVFieldType.TEXT_INPUT, placeholder: 'Contoh: Frontend Developer' },
      { id: 'birthDate', label: 'Tanggal Lahir', value: user.dateOfBirth || '', type: CVFieldType.DATE_INPUT, placeholder: 'YYYY-MM-DD' },
    ];
    
    const contactSection = initialSections.find(s => s.type === CVSectionType.CONTACT)!;
    contactSection.fields = [
      { id: 'email', label: 'Email', value: user.email || '', type: CVFieldType.TEXT_INPUT, placeholder: 'Email Anda' },
      { id: 'phone', label: 'Nomor Telepon', value: user.phoneNumber || '', type: CVFieldType.TEXT_INPUT, placeholder: 'Nomor Telepon Anda' },
      { id: 'address', label: 'Alamat (Singkat)', value: user.address ? `${user.address.city}, ${user.address.province}` : '', type: CVFieldType.TEXT_INPUT, placeholder: 'Kota, Provinsi' },
      { id: 'linkedin', label: 'LinkedIn (Opsional)', value: user.socialMedia?.linkedIn || '', type: CVFieldType.TEXT_INPUT, placeholder: 'URL Profil LinkedIn' },
    ];

    const summarySection = initialSections.find(s => s.type === CVSectionType.SUMMARY)!;
    if (!summarySection.fields || summarySection.fields.length === 0) {
        summarySection.fields = [{ id: 'summaryContent', label: 'Summary', value: 'Ringkasan profesional singkat tentang diri Anda...', type: CVFieldType.TEXT_AREA }];
    }

    const educationSection = initialSections.find(s => s.type === CVSectionType.EDUCATION)!;
    if (user.educationHistory && educationSection.data) {
      educationSection.data = user.educationHistory.map(edu => ({
        id: uuidv4(),
        institutionName: edu.school,
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        graduationYear: edu.graduationYear || '',
        description: '', 
      } as CVEducationEntry));
    }
    const experienceSection = initialSections.find(s => s.type === CVSectionType.EXPERIENCE)!;
    if (user.workHistory && experienceSection.data) {
      experienceSection.data = user.workHistory.map(work => ({
        id: uuidv4(),
        jobTitle: work.role,
        companyName: work.organization,
        startDate: work.startDate || '',
        endDate: work.endDate || '',
        isCurrent: !work.endDate,
        description: work.description || '',
      } as CVExperienceEntry));
    }
  }

  return {
    userId: user?.uid || '',
    title: `CV ${user?.displayName || 'Baru'} - ${new Date().toLocaleDateString('id-ID')}`,
    templateId: 'default',
    sections: initialSections,
    version: 1,
  };
};

interface CVSectionFormProps {
  section: CVSection;
  onUpdate: (sectionId: string, updatedData: CVSection) => void;
  currentUser: User | null;
}

const CVSectionForm: React.FC<CVSectionFormProps> = ({ section, onUpdate, currentUser }) => {
  const [localSection, setLocalSection] = useState<CVSection>(section);

  useEffect(() => {
    setLocalSection(section); 
  }, [section]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedFields = (localSection.fields || []).map(f => f.id === fieldId ? { ...f, value } : f);
    const updatedSection = { ...localSection, fields: updatedFields as CVField[] };
    setLocalSection(updatedSection);
    onUpdate(section.id, updatedSection);
  };
  
  const handleTitleChange = (newTitle: string) => {
    const updatedSection = { ...localSection, title: newTitle };
    setLocalSection(updatedSection);
    onUpdate(section.id, updatedSection);
  };

  const handleListItemChange = (itemIndex: number, property: string, value: any) => {
    if (!localSection.data) return;
    
    const updatedData = (localSection.data as any[]).map((item, idx) => 
        idx === itemIndex ? { ...item, [property]: value } : item
    );
    const updatedSection = { ...localSection, data: updatedData };
    setLocalSection(updatedSection);
    onUpdate(section.id, updatedSection);
  };

  const addListItem = (itemType: CVSectionType) => {
    let newItem: any = { id: uuidv4() };
    
    switch (itemType) {
      case CVSectionType.EXPERIENCE:
        newItem = {
          ...newItem,
          jobTitle: '',
          companyName: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: '',
        } as CVExperienceEntry;
        break;
      case CVSectionType.EDUCATION:
        newItem = {
          ...newItem,
          institutionName: '',
          degree: '',
          fieldOfStudy: '',
          graduationYear: '',
          description: '',
        } as CVEducationEntry;
        break;
      case CVSectionType.SKILLS:
        newItem = {
          ...newItem,
          skillName: '',
          proficiency: 'Menengah',
        } as CVSkillEntry;
        break;
    }
    
    const updatedData = [...(localSection.data || []), newItem];
    const updatedSection = { ...localSection, data: updatedData };
    setLocalSection(updatedSection);
    onUpdate(section.id, updatedSection);
  };

  const removeListItem = (itemIndex: number) => {
    if (!localSection.data) return;
    
    const updatedData = (localSection.data as any[]).filter((_, idx) => idx !== itemIndex);
    const updatedSection = { ...localSection, data: updatedData };
    setLocalSection(updatedSection);
    onUpdate(section.id, updatedSection);
  };

  const renderFields = () => {
    if (!localSection.fields) return null;

    return (
      <>
        <h3 className="text-lg font-bold text-slate-100 mb-6">{localSection.title}</h3>
        <div className="space-y-5">
          {localSection.fields.map((field) => (
            <div key={field.id} className="mb-4">
              <label htmlFor={field.id} className="block text-slate-300 text-sm font-semibold mb-1">
                {field.label}
              </label>
              {field.type === CVFieldType.TEXT_AREA ? (
                <textarea
                  id={field.id}
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="text-base text-slate-100 h-28 min-h-[120px] px-4 rounded-lg bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y w-full"
                  placeholder={field.placeholder || field.label}
                />
              ) : field.type === CVFieldType.DATE_INPUT ? (
                <input
                  id={field.id}
                  type="date"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="text-base text-slate-100 h-11 px-4 rounded-lg bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  aria-label={field.label}
                />
              ) : (
                <input
                  id={field.id}
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="text-base text-slate-100 h-11 px-4 rounded-lg bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  placeholder={field.placeholder || field.label}
                />
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderListEditor = (itemType: CVSectionType) => {
    if (!localSection.data) return null;
    
    const renderExperienceItem = (item: CVExperienceEntry, index: number) => (
      <div key={item.id} className="content-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={item.jobTitle}
            onChange={(e) => handleListItemChange(index, 'jobTitle', e.target.value)}
            className="form-input"
            placeholder="Jabatan"
          />
          <input
            type="text"
            value={item.companyName}
            onChange={(e) => handleListItemChange(index, 'companyName', e.target.value)}
            className="form-input"
            placeholder="Nama Perusahaan"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="month"
            value={item.startDate}
            onChange={(e) => handleListItemChange(index, 'startDate', e.target.value)}
            className="form-input"
            placeholder="Tanggal Mulai"
            aria-label="Tanggal Mulai"
          />
          {!item.isCurrent && (
            <input
              type="month"
              value={item.endDate}
              onChange={(e) => handleListItemChange(index, 'endDate', e.target.value)}
              className="form-input"
              placeholder="Tanggal Selesai"
              aria-label="Tanggal Selesai"
            />
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={item.isCurrent}
            id={`isCurrent-${item.id}`}
            onChange={(e) => handleListItemChange(index, 'isCurrent', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor={`isCurrent-${item.id}`} className="ml-2 block text-sm text-slate-700">
            Pekerjaan saat ini
          </label>
        </div>
        <textarea
          value={item.description}
          onChange={(e) => handleListItemChange(index, 'description', e.target.value)}
          className="form-input resize-y min-h-[100px]"
          placeholder="Deskripsi singkat pekerjaan..."
        />
        <div className="text-right">
          <button onClick={() => removeListItem(index)} className="btn-danger">
            Hapus Pengalaman
          </button>
        </div>
      </div>
    );

    const renderEducationItem = (item: CVEducationEntry, index: number) => (
      <div key={item.id} className="content-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={item.institutionName}
            onChange={(e) => handleListItemChange(index, 'institutionName', e.target.value)}
            className="form-input"
            placeholder="Nama Institusi"
          />
          <input
            type="text"
            value={item.degree}
            onChange={(e) => handleListItemChange(index, 'degree', e.target.value)}
            className="form-input"
            placeholder="Gelar"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={item.fieldOfStudy}
            onChange={(e) => handleListItemChange(index, 'fieldOfStudy', e.target.value)}
            className="form-input"
            placeholder="Bidang Studi"
          />
          <input
            type="text"
            value={item.graduationYear}
            onChange={(e) => handleListItemChange(index, 'graduationYear', e.target.value)}
            className="form-input"
            placeholder="Tahun Lulus"
          />
        </div>
        <textarea
          value={item.description}
          onChange={(e) => handleListItemChange(index, 'description', e.target.value)}
          className="form-input resize-y min-h-[80px]"
          placeholder="Deskripsi atau aktivitas..."
        />
        <div className="text-right">
          <button onClick={() => removeListItem(index)} className="btn-danger">
            Hapus Pendidikan
          </button>
        </div>
      </div>
    );

    const renderSkillItem = (item: CVSkillEntry, index: number) => (
      <div key={item.id} className="content-card p-4 flex items-center justify-between space-x-4">
        <input
          type="text"
          value={item.skillName}
          onChange={(e) => handleListItemChange(index, 'skillName', e.target.value)}
          className="form-input flex-1"
          placeholder="Nama Keahlian"
        />
        <select
          value={item.proficiency}
          onChange={(e) => handleListItemChange(index, 'proficiency', e.target.value)}
          className="form-select w-1/3"
          aria-label="Tingkat Keahlian"
        >
          <option>Pemula</option>
          <option>Menengah</option>
          <option>Mahir</option>
          <option>Ahli</option>
        </select>
        <button onClick={() => removeListItem(index)} className="btn-danger">
          Hapus
        </button>
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {localSection.data && (localSection.data as any[]).map((item, index) => {
            switch (itemType) {
              case CVSectionType.EXPERIENCE:
                return renderExperienceItem(item as CVExperienceEntry, index);
              case CVSectionType.EDUCATION:
                return renderEducationItem(item as CVEducationEntry, index);
              case CVSectionType.SKILLS:
                return renderSkillItem(item as CVSkillEntry, index);
              default:
                return null;
            }
          })}
        </div>
        <button onClick={() => addListItem(itemType)} className="btn-secondary w-full py-2">
          + Tambah {DefaultCVSectionTitles[itemType]}
        </button>
      </div>
    );
  };

  if (!localSection) return null;

  return (
    <div className="space-y-6">
      <div className="border-t border-slate-200 pt-6">
        {localSection.fields ? renderFields() : renderListEditor(localSection.type)}
      </div>
    </div>
  );
};

const CVBuilderPage: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>();
  const { currentUser, firebaseAuth } = useAuth();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState<UserCV | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const fetchCVData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (cvId) {
        const cvDocRef = doc(db, 'users', currentUser.uid, 'cvs', cvId);
        const cvDoc = await getDoc(cvDocRef);
        if (cvDoc.exists()) {
          const data = { id: cvDoc.id, ...cvDoc.data() } as UserCV;
          setCvData(data);
          if (data.sections && data.sections.length > 0) {
            const sorted = [...data.sections].sort((a, b) => a.order - b.order);
            setSelectedSectionId(sorted[0].id);
          }
        } else {
          setError('CV tidak ditemukan.');
        }
      } else {
        const newCV = getInitialCVData(currentUser);
        setCvData(newCV as UserCV);
        if (newCV.sections && newCV.sections.length > 0) {
          setSelectedSectionId(newCV.sections[0].id);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data CV:", err);
      setError('Gagal memuat data CV.');
    } finally {
      setLoading(false);
    }
  }, [cvId, currentUser]);

  useEffect(() => {
    fetchCVData();
  }, [fetchCVData]);

  const sortedSections = cvData ? [...cvData.sections].sort((a, b) => a.order - b.order) : [];
  const selectedSection = sortedSections.find(s => s.id === selectedSectionId);

  const handleSectionDataChange = (sectionId: string, updatedSection: CVSection) => {
    setCvData(prev => {
      if (!prev) return null;
      const newSections = prev.sections.map(s => s.id === sectionId ? updatedSection : s);
      return { ...prev, sections: newSections };
    });
  };

  const addSection = (type: CVSectionType) => {
    if (!cvData) return;
    const maxOrder = Math.max(...cvData.sections.map(s => s.order), -1);
    const newSection = createNewSection(type, maxOrder + 1);
    const newSections = [...cvData.sections, newSection];
    setCvData({ ...cvData, sections: newSections });
    setSelectedSectionId(newSection.id);
  };

  const removeSection = (sectionIdToRemove: string) => {
    if (!cvData) return;
    const newSections = cvData.sections.filter(s => s.id !== sectionIdToRemove);
    setCvData({ ...cvData, sections: newSections });
    
    if (selectedSectionId === sectionIdToRemove) {
      const remainingSections = [...newSections].sort((a,b) => a.order - b.order);
      setSelectedSectionId(remainingSections.length > 0 ? remainingSections[0].id : null);
    }
  };

  const handleSaveCV = async () => {
    if (!cvData || !currentUser) return;
    setIsSaving(true);
    try {
      const cvToSave: Omit<UserCV, 'id' | 'updatedAt' | 'createdAt'> & { updatedAt: FieldValue; createdAt: FieldValue } = {
        userId: currentUser.uid,
        title: cvData.title,
        templateId: 'default',
        sections: cvData.sections,
        createdAt: serverTimestamp(),
        version: cvData.version + 1,
        updatedAt: serverTimestamp(),
      };
      
      if ('id' in cvToSave) {
        delete (cvToSave as any).id;
      }

      let docId = cvId;

      if (docId) {
        const docRef = doc(db, 'users', currentUser.uid, 'cvs', docId);
        await setDoc(docRef, cvToSave, { merge: true });
        await logUserActivity(firebaseAuth, db, 'CV_UPDATED', { cvId: docId, cvTitle: cvData.title });
      } else {
        const cvCollectionRef = collection(db, 'users', currentUser.uid, 'cvs');
        cvToSave.createdAt = serverTimestamp();
        const newDocRef = await addDoc(cvCollectionRef, cvToSave);
        docId = newDocRef.id;
        await logUserActivity(firebaseAuth, db, 'create-cv', { cvId: docId });
        navigate(`${APP_ROUTES.CV_BUILDER}/${docId}`, { replace: true });
      }
      alert('CV berhasil disimpan!');
    } catch (err) {
      console.error("Gagal menyimpan CV:", err);
      setError('Gagal menyimpan CV. Silakan coba lagi.');
      alert('Gagal menyimpan CV. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !cvData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
        <h1 className="page-title flex items-center mb-4 sm:mb-0 text-slate-100">
          <DocumentTextIcon className="w-6 h-6 mr-3 text-indigo-400" />
          {cvData.title || "CV Builder"}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSaveCV}
            disabled={isSaving}
            className="flex items-center px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">Menyimpan...</span>
              </>
            ) : (
              <>
                <FloppyDiskIcon className="w-5 h-5 mr-2" />
                <span>Simpan CV</span>
              </>
            )}
          </button>
          <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
            <h2 className="section-title mb-4 flex items-center text-slate-100">
              <MenuIcon className="w-5 h-5 mr-2 text-indigo-400" /> Struktur CV
            </h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {sortedSections.map(section => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 text-sm sm:text-base font-medium 
                    ${selectedSectionId === section.id 
                      ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30' 
                      : 'hover:bg-slate-700/60 text-slate-200'}
                  `}
                >
                  <span>{section.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                    className="text-slate-400 hover:text-red-400"
                    aria-label={`Hapus bagian ${section.title}`}
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
            <h3 className="card-title mb-4 text-slate-100">Tambah Bagian Baru</h3>
            <div className="space-y-2">
              <button onClick={() => addSection(CVSectionType.SUMMARY)} className="w-full text-left flex items-center p-2 rounded-lg hover:bg-slate-700/60 transition-colors duration-200 text-slate-200">
                <PlusCircleIcon className="w-5 h-5 mr-3 text-indigo-400" />
                <span>Ringkasan</span>
              </button>
              <button onClick={() => addSection(CVSectionType.EXPERIENCE)} className="w-full text-left flex items-center p-2 rounded-lg hover:bg-slate-700/60 transition-colors duration-200 text-slate-200">
                <PlusCircleIcon className="w-5 h-5 mr-3 text-indigo-400" />
                <span>Pengalaman</span>
              </button>
              <button onClick={() => addSection(CVSectionType.EDUCATION)} className="w-full text-left flex items-center p-2 rounded-lg hover:bg-slate-700/60 transition-colors duration-200 text-slate-200">
                <PlusCircleIcon className="w-5 h-5 mr-3 text-indigo-400" />
                <span>Pendidikan</span>
              </button>
              <button onClick={() => addSection(CVSectionType.SKILLS)} className="w-full text-left flex items-center p-2 rounded-lg hover:bg-slate-700/60 transition-colors duration-200 text-slate-200">
                <PlusCircleIcon className="w-5 h-5 mr-3 text-indigo-400" />
                <span>Keahlian</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="lg:col-span-3">
          {selectedSection ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 min-h-[60vh]">
              <CVSectionForm
                key={selectedSection.id}
                section={selectedSection}
                onUpdate={handleSectionDataChange}
                currentUser={currentUser}
              />
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center min-h-[60vh] flex items-center justify-center">
              <h3 className="section-title text-slate-400">Pilih bagian dari daftar di sebelah kiri untuk mulai mengedit CV Anda.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVBuilderPage;