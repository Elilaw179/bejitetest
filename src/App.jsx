import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import EmailCheck from "./pages/EmailCheck";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import EmailSent from "./pages/auth/EmailSent";
import ConfirmPassword from "./pages/ConfirmPassword";
import SignUpRole from "./pages/SignUpRole";
import JobConnection from "./pages/jobseekerSignup/JobConnection.jsx";
import JobSeekerOpt from "./pages/jobseekerSignup/JobSeekerOpt.jsx";
import Resume from "./pages/jobseekerSignup/Resume.jsx";
import Bio from "./pages/jobseekerSignup/cvBuilder/Bio.jsx";
import Education from "./pages/jobseekerSignup/cvBuilder/Education.jsx";
import ResumeLayout from "./components/ResumeLayout";
import Skills from "./pages/jobseekerSignup/cvBuilder/Skills.jsx";
import WorkHistory from "./pages/jobseekerSignup/cvBuilder/WorkHistory.jsx";
import Certificate from "./pages/jobseekerSignup/cvBuilder/Certificate.jsx";
import Link from "./pages/jobseekerSignup/cvBuilder/Link.jsx";
import JobType from "./pages/jobseekerSignup/JobType.jsx";
import SaveProgress from "./pages/jobseekerSignup/SaveProgress.jsx";
import EmployerOpt from "./pages/EmployerOpt";
import BasicDetails from "./pages/corporate/BasicDetails.jsx";
import ProfileSetup from "./pages/individual/ProfileSetup";
import Location from "./pages/individual/Location";
import Verify from "./pages/individual/Verify";
import SelectId from "./pages/individual/SelectId";
import UploadDoc from "./pages/individual/UploadDoc";
import InReview from "./pages/individual/InReview";
import IndividualVerificationLayout from "./components/IndividualVerificationLayout";
import CoperateVerificationLayout from "./components/CoperateVerificationLayout";
import CoperateBasicDetails from "./pages/corporate/BasicDetails.jsx";
import CoperateProfileSetup from "./pages/corporate/ProfileSetup.jsx";
import CompanyDetails from "./pages/corporate/CompanyDetails.jsx";
import CoperateLocation from "./pages/corporate/Location.jsx";
import CoperateVerify from "./pages/corporate/Verify.jsx";
import CoperateUploadDoc from "./pages/corporate/UploadDoc.jsx";
import CoperateInReview from "./pages/corporate/InReview.jsx";
import Recruitment from "./pages/employerDashboard/Recruitment.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import SharedPostRedirect from "./pages/SharedPostRedirect.jsx";
import CandidateSearchPage from "./pages/employerDashboard/CandidateSearchPage.jsx";
import Chat from "./pages/employerDashboard/Chat.jsx";
import Connections from "./pages/Connections.jsx";
import PostPage from "./pages/employerDashboard/PostPage.jsx";
import Notifications from "./pages/employerDashboard/Notifications.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PaymentPage from "./pages/paymentMethod/PaymentPage";
import PaymentType from "./pages/paymentMethod/PaymentTypePage.jsx";
import AddCard from "./pages/paymentMethod/AddCardPage.jsx";
import PaymentProcessing from "./pages/paymentMethod/PaymentProcessing.jsx";
import PaymentSuccess from "./pages/paymentMethod/PaymentSuccessPage.jsx";
import SentInvite from "./pages/individual/SentInvite.jsx";
import EmployeeSentInvite from "./pages/employerDashboard/EmployeeSentInvite.jsx";
import InterviewInvite from "./components/InterviewInvite.jsx";
import InterviewNotifications from "./pages/individual/InterviewNotifications.jsx";
import SentInvitations from "./pages/employerDashboard/SentInvitations.jsx";
import About from "./pages/misc/About.jsx";
import Teams from "./pages/misc/Teams.jsx";
import SecurityAdvice from "./pages/misc/SecurityAdvice.jsx";
import PrivacyPolicy from "./pages/misc/PrivacyPolicy.jsx";
import Contact from "./pages/misc/Contact.jsx";
import Help from "./pages/misc/Help.jsx";
import AuthSuccess from "./pages/auth/AuthSuccess.jsx";
import AuthFailure from "./pages/auth/AuthFailure.jsx";
import CompleteSignup from "./pages/CompleteSignup.jsx";
import Profile from "./pages/Profile.jsx";
import UserProfilePosts from "./pages/UserProfilePosts.jsx";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ASEPricingPage from "./pages/employerDashboard/ASEPricingPage.jsx";
import ASEPaymentCallback from "./pages/employerDashboard/ASEPaymentCallback.jsx";
import ASESubscriptionDashboard from "./pages/employerDashboard/ASESubscriptionDashboard.jsx";
import "react-toastify/dist/ReactToastify.css";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminJobs from "./pages/admin/AdminJobs.jsx";
import AdminRevenue from "./pages/admin/AdminRevenue.jsx";
import AdminEngagement from "./pages/admin/AdminEngagement.jsx";
import AdminRecruitment from "./pages/admin/AdminRecruitment.jsx";
import AdminDemographics from "./pages/admin/AdminDemographics.jsx";
import AdminList from "./pages/admin/AdminList.jsx";
import AdminAdPro from "./pages/admin/AdminAdPro.jsx";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import PushNotificationBootstrap from "./components/PushNotificationBootstrap.jsx";
import AuthBootstrap from "./components/AuthBootstrap.jsx";
import ProfileCompletionReminder from "./components/ProfileCompletionReminder.jsx";
import { Navigate } from "react-router-dom";
import BadgeStatus from "./pages/badge/BadgeStatus.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";
import ActivityLog from "./pages/ActivityLog.jsx";
import BadgeHolder from "./pages/badge/BadgeHolder.jsx";
import BadgePaymentCallback from "./pages/badge/BadgePaymentCallback.jsx";
import CreateJob from "./pages/employerDashboard/CreateJob.jsx";
import EmployerDashboard from "./pages/employerDashboard/EmployerDashboard.jsx";
import BulkCreateJobs from "./pages/employerDashboard/BulkCreateJobs.jsx";
import ExtendJob from "./pages/employerDashboard/ExtendJob.jsx";
import JobExtendCallback from "./pages/employerDashboard/JobExtendCallback.jsx";
import JobApplications from "./pages/employerDashboard/JobApplications.jsx";
import RecruitWithASE from "./pages/employerDashboard/RecruitWithASE.jsx";
import RepostJob from "./pages/employerDashboard/RepostJob.jsx";
import JobVacancyListing from "./pages/jobseekerSignup/Jobs/JobVacancyListing.jsx";
import AdProDashboard from "./pages/ads/AdProDashboard.jsx";
import CampaignReports from "./pages/ads/CampaignReports.jsx";
import CampaignDetails from "./pages/ads/CampaignDetails.jsx";
import CreateCampaign from "./pages/ads/CreateCampaign.jsx";
import EditCampaign from "./pages/ads/EditCampaign.jsx";
import EditCampaignAudience from "./pages/ads/EditCampaignAudience.jsx";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthBootstrap>
          <PushNotificationBootstrap />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="revenue" element={<AdminRevenue />} />
              <Route path="engagement" element={<AdminEngagement />} />
              <Route path="recruitment" element={<AdminRecruitment />} />
              <Route path="demographics" element={<AdminDemographics />} />
              <Route path="admins" element={<AdminList />} />
              <Route path="adpro" element={<AdminAdPro />} />
            </Route>

            <Route path="/auth/email-sent" element={<EmailSent />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/auth/failure" element={<AuthFailure />} />
            <Route path="/complete-signup" element={<CompleteSignup />} />
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/email-check" element={<EmailCheck />} />
            <Route path="/signup-role" element={<SignUpRole />} />
            <Route path="/confirmpassword" element={<ConfirmPassword />} />
            <Route path="/jobseeker-option" element={<JobSeekerOpt />} />
            <Route path="/employer-option" element={<EmployerOpt />} />
            <Route path="/jobconnection" element={<JobConnection />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/save-progress" element={<SaveProgress />} />

            <Route
              element={
                <ProtectedRoute>
                  <ResumeLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/bio" element={<Bio />} />
              <Route path="/education" element={<Education />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/job-type" element={<JobType />} />
              <Route path="/work-history" element={<WorkHistory />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/links" element={<Link />} />
            </Route>

            <Route
              element={
                <ProtectedRoute>
                  <ResumeLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/edit-profile/bio" element={<Bio />} />
              <Route path="/edit-profile/education" element={<Education />} />
              <Route path="/edit-profile/skills" element={<Skills />} />
              <Route
                path="/edit-profile/work-history"
                element={<WorkHistory />}
              />
              <Route
                path="/edit-profile/certificate"
                element={<Certificate />}
              />
              <Route path="/edit-profile/links" element={<Link />} />
              <Route path="/edit-profile/job-type" element={<JobType />} />
            </Route>
            <Route element={<IndividualVerificationLayout />}>
              <Route
                path="/individual/basic-details"
                element={<BasicDetails />}
              />
              <Route
                path="/individual/profile-setup"
                element={<ProfileSetup />}
              />
              <Route path="/individual/location" element={<Location />} />
              <Route path="/individual/verify" element={<Verify />} />
              <Route path="/individual/selectid" element={<SelectId />} />
              <Route path="/individual/upload" element={<UploadDoc />} />
              <Route path="/individual/inreview" element={<InReview />} />
            </Route>
            <Route element={<CoperateVerificationLayout />}>
              <Route
                path="/corporate/basic-details"
                element={<CoperateBasicDetails />}
              />{" "}
              <Route
                path="/corporate/profile-setup"
                element={<CoperateProfileSetup />}
              />{" "}
              <Route
                path="/corporate/company-details"
                element={<CompanyDetails />}
              />
              <Route
                path="/corporate/location"
                element={<CoperateLocation />}
              />
              <Route path="/corporate/verify" element={<CoperateVerify />} />
              <Route path="/corporate/upload" element={<CoperateUploadDoc />} />
              <Route
                path="/corporate/inreview"
                element={<CoperateInReview />}
              />
              <Route
                path="/edit-profile/recruiter/basic-details"
                element={<CoperateBasicDetails />}
              />
              <Route
                path="/edit-profile/recruiter/profile-setup"
                element={<CoperateProfileSetup />}
              />
              <Route
                path="/edit-profile/recruiter/company-details"
                element={<CompanyDetails />}
              />
              <Route
                path="/edit-profile/recruiter/location"
                element={<CoperateLocation />}
              />
              <Route
                path="/edit-profile/recruiter/verify"
                element={<CoperateVerify />}
              />
              <Route
                path="/edit-profile/recruiter/upload-doc"
                element={<CoperateUploadDoc />}
              />
            </Route>
            <Route path="/post-page" element={<PostPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
            <Route path="/p/:postId" element={<SharedPostRedirect />} />
            <Route path="/news-feed" element={<Recruitment />} />
            <Route path="/badge" element={<BadgeStatus />} />
            <Route path="/badge/payment-callback" element={<BadgePaymentCallback />} />
            <Route path="/activity-logs" element={<ActivityLog />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/badge-holder" element={<BadgeHolder />} />

            {/* ads */}
            <Route path="/adpro" element={<AdProDashboard />} />
            <Route
              path="/ad-pro-dashboard"
              element={<Navigate to="/adpro" replace />}
            />
            <Route path="/adpro/campaign/:id" element={<CampaignDetails />} />
            <Route
              path="/adpro/campaign/:id/reports"
              element={<CampaignReports />}
            />
            <Route path="/adpro/create" element={<CreateCampaign />} />
            <Route path="/adpro/campaign/:id/edit" element={<EditCampaign />} />
            <Route
              path="/adpro/campaign/:id/edit-audience"
              element={<EditCampaignAudience />}
            />

            {/* jobseeker */}
            <Route path="/job-vacancy" element={<JobVacancyListing />} />

            <Route
              path="/candidate-search-page"
              element={
                <ProtectedRoute redirectMessage="Your session has expired. Please log in again.">
                  <CandidateSearchPage />
                </ProtectedRoute>
              }
            />
            <Route path="/chats" element={<Chat />} />
            <Route path="/connection" element={<Connections />} />
            <Route path="/notification" element={<Notifications />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-type" element={<PaymentType />} />
            <Route path="/add-card" element={<AddCard />} />
            <Route path="/payment-processing" element={<PaymentProcessing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/sent-invite" element={<SentInvite />} />
            <Route
              path="/employee-sent-invite"
              element={<EmployeeSentInvite />}
            />
            <Route path="/interview-invite" element={<InterviewInvite />} />
            <Route
              path="/my-invitations"
              element={<InterviewNotifications />}
            />
            <Route path="/sent-invitations" element={<SentInvitations />} />
            <Route
              path="/profile/posts"
              element={
                <ProtectedRoute>
                  <UserProfilePosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile/:userId/posts"
              element={
                <ProtectedRoute>
                  <UserProfilePosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/security-advice" element={<SecurityAdvice />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/ase/pricing" element={<ASEPricingPage />} />
            <Route
              path="/ase/payment-callback"
              element={<ASEPaymentCallback />}
            />
            <Route
              path="/ase/subscription-callback"
              element={<ASEPaymentCallback />}
            />
            <Route
              path="/ase/dashboard"
              element={<ASESubscriptionDashboard />}
            />
            <Route path="/employer/create-job" element={<CreateJob />} />

            <Route path="/employer/dashboard" element={<EmployerDashboard />} />

            <Route path="/employer/bulk-create" element={<BulkCreateJobs />} />
            <Route
              path="/employer/extend/callback"
              element={<JobExtendCallback />}
            />
            <Route path="/employer/job/:id/extend" element={<ExtendJob />} />
            <Route
              path="/employer/job/:id/applications"
              element={<JobApplications />}
            />
            <Route
              path="employer/job/:id/recruit"
              element={<RecruitWithASE />}
            />
            <Route path="employer/job/:id/repost" element={<RepostJob />} />
          </Routes>
          <ProfileCompletionReminder />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthBootstrap>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
