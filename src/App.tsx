import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import { UserRole } from './types';
import { APP_ROUTES } from './constants';
import { trackPageView } from './utils/analytics';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Job System Pages
import JobSearchPage from './pages/jobs/JobSearchPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import PostJobPage from './pages/jobs/PostJobPage';
import MyApplicationsPage from './pages/jobs/MyApplicationsPage';
import CompanyJobsPage from './pages/jobs/CompanyJobsPage';

// Company Management Pages
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import CompanyApplicationsPage from './pages/company/CompanyApplicationsPage';
import CompanyInternshipsPage from './pages/company/CompanyInternshipsPage';
import CompanyInternshipApplicationsPage from './pages/company/CompanyInternshipApplicationsPage';

// Training System Pages
import TrainingCatalogPage from './pages/trainings/TrainingCatalogPage';
import TrainingDetailPage from './pages/trainings/TrainingDetailPage';
import PostTrainingPage from './pages/trainings/PostTrainingPage';
import MyTrainingsPage from './pages/trainings/MyTrainingsPage';
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage';
import ProviderTrainingsPage from './pages/provider/ProviderTrainingsPage';
import ProviderRegistrationsPage from './pages/provider/ProviderRegistrationsPage';

// Psychometric Testing System Pages
import PsychometricTestsOverviewPage from './pages/psychometric/PsychometricTestsOverviewPage';
import TakePsychometricTestPage from './pages/psychometric/TakePsychometricTestPage';
import ViewPsychometricResultPage from './pages/psychometric/ViewPsychometricResultPage';
import MyPsychometricResultsPage from './pages/psychometric/MyPsychometricResultsPage';

// Admin Pages
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminActivityLogPage from './pages/admin/AdminActivityLogPage'; 

// CV Builder Pages
import MyCVsPage from './pages/cv/MyCVsPage';
import CVBuilderPage from './pages/cv/CVBuilderPage';

// Interview Pages
import VideoInterviewRoomPage from './pages/interview/VideoInterviewRoomPage';

// Internship System Pages
import InternshipCatalogPage from './pages/internships/InternshipCatalogPage';
import InternshipDetailPage from './pages/internships/InternshipDetailPage';
import PostInternshipPage from './pages/internships/PostInternshipPage';
import MyInternshipApplicationsPage from './pages/internships/MyInternshipApplicationsPage';
import TestInternshipDataPage from './pages/internships/TestInternshipDataPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Component to track page views
const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);

  return null;
};

const AdminOnlyDevtools: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isAdminPage = location.pathname.startsWith(APP_ROUTES.ADMIN_DASHBOARD);

  // Also check for development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isDevelopment || !isAdmin || !isAdminPage) {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <PageTracker />
            <Routes>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />

              <Route element={<AuthLayout />}>
                <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={APP_ROUTES.SIGNUP} element={<SignupPage />} />
                <Route path={APP_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              </Route>

              <Route element={<Layout />}>
                <Route 
                  path={APP_ROUTES.DASHBOARD} 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={APP_ROUTES.PROFILE}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.ADMIN_DASHBOARD}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.ADMIN_USER_MANAGEMENT}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                      <AdminUserManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.ADMIN_ACTIVITY_LOG} 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                      <AdminActivityLogPage />
                    </ProtectedRoute>
                  }
                />

                {/* Job Search System Routes */}
                <Route 
                  path={APP_ROUTES.JOBS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <JobSearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.JOB_DETAIL.replace(':jobId', ':jobId')} 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <JobDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.POST_JOB}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />
                 <Route 
                  path={APP_ROUTES.EDIT_JOB.replace(':jobId', ':jobId')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <PostJobPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.MY_APPLICATIONS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER]}>
                      <MyApplicationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Company Management Routes */}
                <Route 
                  path={APP_ROUTES.COMPANY_DASHBOARD}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <CompanyDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.COMPANY_JOBS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <CompanyJobsPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.COMPANY_APPLICATIONS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <CompanyApplicationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.COMPANY_INTERNSHIPS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <CompanyInternshipsPage />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path={APP_ROUTES.COMPANY_INTERNSHIP_APPLICATIONS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <CompanyInternshipApplicationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Training System Routes */}
                <Route
                  path={APP_ROUTES.TRAINING_CATALOG}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <TrainingCatalogPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.TRAINING_DETAIL.replace(':programId', ':programId')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <TrainingDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.POST_TRAINING}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <PostTrainingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.EDIT_TRAINING.replace(':programId', ':programId')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <PostTrainingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.MY_TRAININGS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <MyTrainingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.PROVIDER_DASHBOARD}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <ProviderDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.PROVIDER_TRAININGS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <ProviderTrainingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.PROVIDER_REGISTRATIONS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <ProviderRegistrationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Psychometric Testing System Routes */}
                <Route
                  path={APP_ROUTES.PSYCHOMETRIC_TESTS_OVERVIEW}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.ADMIN]}>
                      <PsychometricTestsOverviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.TAKE_PSYCHOMETRIC_TEST.replace(':testTypePath', ':testTypePath')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.ADMIN]}>
                      <TakePsychometricTestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.VIEW_PSYCHOMETRIC_RESULT.replace(':resultId', ':resultId')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.ADMIN]}>
                      <ViewPsychometricResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.MY_PSYCHOMETRIC_RESULTS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.ADMIN]}>
                      <MyPsychometricResultsPage />
                    </ProtectedRoute>
                  }
                />

                {/* CV Builder System Routes */}
                <Route
                  path={APP_ROUTES.MY_CVS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.ADMIN]}>
                      <MyCVsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.CV_BUILDER}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.ADMIN]}>
                      <CVBuilderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.CV_BUILDER_EDIT.replace(':cvId', ':cvId')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.ADMIN]}>
                      <CVBuilderPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Interview Routes */}
                <Route
                  path={APP_ROUTES.INTERVIEW_ROOM.replace(':roomId', ':roomId')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN, UserRole.JOB_SEEKER]}>
                      <VideoInterviewRoomPage />
                    </ProtectedRoute>
                  }
                />

                {/* Internship System Routes */}
                <Route
                  path={APP_ROUTES.INTERNSHIPS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <InternshipCatalogPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.INTERNSHIP_DETAIL.replace(':internshipId', ':internshipId')}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <InternshipDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.POST_INTERNSHIP}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                      <PostInternshipPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={APP_ROUTES.MY_INTERNSHIP_APPLICATIONS}
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER]}>
                      <MyInternshipApplicationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Test Data Routes */}
                <Route 
                  path="/test-internship-data" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.JOB_SEEKER, UserRole.COMPANY, UserRole.TRAINING_PROVIDER, UserRole.ADMIN]}>
                      <TestInternshipDataPage />
                    </ProtectedRoute>
                  } 
                />
              </Route>
              
              {/* Catch-all for undefined routes */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <AdminOnlyDevtools />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;