import { UserRole } from '@/types';

export const APP_NAME = "Medamel";

export const APP_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USER_MANAGEMENT: "/admin/users", 
  ADMIN_ACTIVITY_LOG: "/admin/activity-log",

  // Job Search System Routes
  JOBS: "/jobs", // Job search/listing page
  JOB_DETAIL: "/jobs/:jobId", // Detail of a single job
  POST_JOB: "/post-job", // Page for companies/admins to post new jobs
  EDIT_JOB: "/edit-job/:jobId", // Page for companies/admins to edit jobs
  MY_APPLICATIONS: "/my-applications", // Job seeker's list of their applications
  
  // Company Management Routes
  COMPANY_DASHBOARD: "/company/dashboard", // Dedicated dashboard for companies
  COMPANY_JOBS: "/company/jobs", // Company's list of jobs they posted
  COMPANY_APPLICATIONS: "/company/applications", // Company's view of applications for their jobs

  // Internship Program System Routes
  INTERNSHIPS: "/internships", // Internship catalog page
  INTERNSHIP_DETAIL: "/internships/:internshipId", // Detail of a single internship program
  POST_INTERNSHIP: "/internships/post", // Page for companies/admins to post new internship programs
  EDIT_INTERNSHIP: "/internships/edit/:internshipId", // Page for companies/admins to edit internship programs
  MY_INTERNSHIP_APPLICATIONS: "/internships/my-applications", // User's list of their internship applications
  COMPANY_INTERNSHIPS: "/company/internships", // Company's list of internships they posted
  COMPANY_INTERNSHIP_APPLICATIONS: "/company/internship-applications", // Company's view of applications for their internships
  INTERNSHIP_PROGRESS: "/internship-progress/:internshipId", // Page to track internship progress
  TEST_INTERNSHIP_DATA: "/internships/test-data",

  // Training System Routes
  TRAINING_CATALOG: "/trainings", // Training catalog page
  TRAINING_DETAIL: "/trainings/:programId", // Detail of a single training program
  POST_TRAINING: "/post-training", // Page for providers/admins to post new training programs
  EDIT_TRAINING: "/edit-training/:programId", // Page for providers/admins to edit training programs
  MY_TRAININGS: "/my-trainings", // User's list of their registered/completed trainings
  PROVIDER_DASHBOARD: "/provider/dashboard", // Dashboard for training providers
  PROVIDER_TRAININGS: "/provider/trainings", // Provider's list of trainings they offer
  PROVIDER_REGISTRATIONS: "/provider/registrations", // Provider's view of registrations for their trainings

  // Psychometric Testing System Routes
  PSYCHOMETRIC_TESTS_OVERVIEW: "/psychometric-tests", // Overview page listing available tests
  TAKE_PSYCHOMETRIC_TEST: "/psychometric-tests/take/:testTypePath", // Page to take a specific test (e.g., /mbti)
  VIEW_PSYCHOMETRIC_RESULT: "/psychometric-tests/result/:resultId", // Page to view a specific test result
  MY_PSYCHOMETRIC_RESULTS: "/my-psychometric-results", // Page for users to see their past test results

  // CV Builder System Routes
  MY_CVS: "/my-cvs", // Page listing all CVs created by the user
  CV_BUILDER: "/cv-builder", // Page to create a new CV
  CV_BUILDER_EDIT: "/cv-builder/:cvId", // Page to edit an existing CV
  CV_TEMPLATES: "/cv-templates", // (Future) Page to choose CV templates

  // Interview Routes
  INTERVIEW_ROOM: "/interview/:roomId", // Page for the video interview
};

// Firebase configuration keys (values should be in .env file)
// IMPORTANT: These are placeholders. Replace with your actual Firebase config values,
// preferably loaded from environment variables (e.g., process.env.REACT_APP_FIREBASE_API_KEY).
// For this example to run without a build step, you might need to hardcode them temporarily,
// but this is NOT recommended for production.
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Analytics
export const GA_MEASUREMENT_ID = 'G-Z69Z6JXWJW'; // Replace with your actual GA4 Measurement ID