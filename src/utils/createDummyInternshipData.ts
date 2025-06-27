import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { InternshipProgram, InternshipCategory, InternshipDuration, InternshipType, InternshipStatus, InternshipApplication, InternshipApplicationStatus, InternshipCategories } from '@/types';

// Dummy internship programs
const dummyInternshipPrograms: Omit<InternshipProgram, 'id' | 'postedAt' | 'updatedAt'>[] = [
  {
    title: 'Software Development Intern',
    companyId: 'company1',
    companyName: 'TechCorp Indonesia',
    category: InternshipCategories[0], // 'Teknologi Informasi'
    description: 'Program magang untuk pengembangan software dengan teknologi modern',
    duration: InternshipDuration.MEDIUM_TERM,
    internshipType: InternshipType.FULL_TIME,
    location: 'Jakarta Selatan',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    applicationDeadline: '2024-02-15',
    stipend: 3000000,
    benefits: [
      'BPJS Kesehatan',
      'Transport Allowance',
      'Mentorship dari senior developer',
      'Kesempatan menjadi karyawan tetap'
    ],
    requirements: 'Mahasiswa semester 6+ dari jurusan Informatika/Computer Science, Menguasai JavaScript, React, Node.js, Memiliki portfolio project, Bersedia bekerja full-time',
    responsibilities: [
      'Mengembangkan fitur baru untuk aplikasi web',
      'Melakukan testing dan debugging',
      'Berpartisipasi dalam code review',
      'Belajar teknologi baru'
    ],
    learningObjectives: [
      'Memahami development workflow',
      'Menguasai modern web technologies',
      'Belajar best practices dalam coding'
    ],
    skillsRequired: [
      'JavaScript',
      'React',
      'Node.js',
      'Git'
    ],
    preferredSkills: [
      'TypeScript',
      'MongoDB',
      'Docker'
    ],
    maxApplicants: 5,
    currentApplicants: 0,
    mentorInfo: 'Senior Software Engineer dengan 5+ tahun pengalaman',
    status: InternshipStatus.ACTIVE,
    isActive: true
  },
  {
    title: 'Marketing Intern',
    companyId: 'company2',
    companyName: 'Digital Marketing Pro',
    category: InternshipCategories[2], // 'Pemasaran & Penjualan'
    description: 'Program magang di bidang digital marketing dan brand management',
    duration: InternshipDuration.LONG_TERM,
    internshipType: InternshipType.PART_TIME,
    location: 'Bandung',
    startDate: '2024-03-15',
    endDate: '2024-09-15',
    applicationDeadline: '2024-02-28',
    stipend: 2000000,
    benefits: [
      'Pengalaman digital marketing',
      'Networking dengan profesional',
      'Sertifikat magang',
      'Kesempatan project real'
    ],
    requirements: 'Mahasiswa semester 4+ dari jurusan Marketing/Bisnis, Aktif di social media, Kreatif dan inovatif, Bersedia bekerja part-time',
    responsibilities: [
      'Membuat konten untuk social media',
      'Menganalisis performa campaign',
      'Membantu dalam event marketing',
      'Research market trends'
    ],
    learningObjectives: [
      'Memahami digital marketing strategy',
      'Menguasai social media management',
      'Belajar data analysis untuk marketing'
    ],
    skillsRequired: [
      'Social Media Management',
      'Content Creation',
      'Basic Analytics'
    ],
    preferredSkills: [
      'Adobe Creative Suite',
      'Google Analytics',
      'Facebook Ads'
    ],
    maxApplicants: 3,
    currentApplicants: 0,
    mentorInfo: 'Digital Marketing Manager dengan pengalaman 8+ tahun',
    status: InternshipStatus.ACTIVE,
    isActive: true
  }
];

// Dummy internship applications
const dummyApplications: Omit<InternshipApplication, 'id' | 'appliedAt'>[] = [
  {
    internshipId: 'internship1',
    internshipTitle: 'Software Development Intern',
    applicantId: 'user1',
    applicantName: 'John Doe',
    applicantEmail: 'john.doe@email.com',
    companyId: 'company1',
    companyName: 'TechCorp Indonesia',
    status: InternshipApplicationStatus.PENDING,
    resumeUrl: 'https://example.com/resume1.pdf',
    resumeFileName: 'resume_john_doe.pdf',
    coverLetterText: 'Saya sangat tertarik dengan program magang ini karena ingin mengembangkan skill programming saya.',
    portfolioUrl: 'https://github.com/johndoe',
    assessmentNotes: undefined,
    interviewDate: undefined,
    interviewLocation: undefined,
    interviewNotes: undefined
  },
  {
    internshipId: 'internship2',
    internshipTitle: 'Marketing Intern',
    applicantId: 'user1',
    applicantName: 'John Doe',
    applicantEmail: 'john.doe@email.com',
    companyId: 'company2',
    companyName: 'Digital Marketing Pro',
    status: InternshipApplicationStatus.UNDER_REVIEW,
    resumeUrl: 'https://example.com/resume1.pdf',
    resumeFileName: 'resume_john_doe.pdf',
    coverLetterText: 'Saya memiliki passion di bidang marketing dan ingin belajar digital marketing.',
    portfolioUrl: undefined,
    assessmentNotes: 'Kandidat memiliki potensi yang baik',
    interviewDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    interviewLocation: 'Zoom Meeting',
    interviewNotes: 'Interview akan dilakukan secara online'
  }
];

export const createDummyInternshipData = async () => {
  try {
    console.log('Creating dummy internship programs...');
    
    // Create internship programs
    const programRefs: any[] = [];
    for (const program of dummyInternshipPrograms) {
      const docRef = await addDoc(collection(db, 'internshipPrograms'), {
        ...program,
        postedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      programRefs.push(docRef);
      console.log('Created internship program:', docRef.id);
    }

    console.log('Creating dummy internship applications...');
    
    // Create internship applications
    for (const application of dummyApplications) {
      const docRef = await addDoc(collection(db, 'internshipApplications'), {
        ...application,
        appliedAt: serverTimestamp()
      });
      console.log('Created internship application:', docRef.id);
    }

    console.log('Dummy data created successfully!');
    return { programRefs };
  } catch (error) {
    console.error('Error creating dummy data:', error);
    throw error;
  }
};

// Function to create a single internship application for testing
export const createTestApplication = async (applicantId: string) => {
  try {
    const testApplication: Omit<InternshipApplication, 'id' | 'appliedAt'> = {
      internshipId: 'test-internship',
      internshipTitle: 'Test Internship Program',
      applicantId: applicantId,
      applicantName: 'Test User',
      applicantEmail: 'test@example.com',
      companyId: 'test-company',
      companyName: 'Test Company',
      status: InternshipApplicationStatus.PENDING,
      resumeUrl: 'https://example.com/test-resume.pdf',
      resumeFileName: 'test_resume.pdf',
      coverLetterText: 'This is a test application for testing purposes.',
      portfolioUrl: undefined,
      assessmentNotes: undefined,
      interviewDate: undefined,
      interviewLocation: undefined,
      interviewNotes: undefined
    };

    const docRef = await addDoc(collection(db, 'internshipApplications'), {
      ...testApplication,
      appliedAt: serverTimestamp()
    });
    
    console.log('Test application created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating test application:', error);
    throw error;
  }
}; 