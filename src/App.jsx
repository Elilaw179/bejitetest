
import { BrowserRouter as Router, Routes, Route, Links } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import EmailCheck from "./pages/EmailCheck";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
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
import BasicDetails from "./pages/coperate/BasicDetails.jsx";
import ProfileSetup from "./pages/individual/ProfileSetup";
import Location from "./pages/individual/Location";
import Verify from "./pages/individual/Verify";
import SelectId from "./pages/individual/SelectId";
import UploadDoc from "./pages/individual/UploadDoc";
import InReview from "./pages/individual/InReview";
import IndividualVerificationLayout from "./components/IndividualVerificationLayout";
import CoperateVerificationLayout from "./components/CoperateVerificationLayout";
import CoperateBasicDetails from "./pages/coperate/BasicDetails.jsx";
import CoperateProfileSetup from "./pages/coperate/ProfileSetup";
import CompanyDetails from "./pages/coperate/CompanyDetails.jsx";
import CoperateLocation from "./pages/coperate/Location.jsx";
import CoperateVerify from "./pages/coperate/Verify.jsx";
import CoperateUploadDoc from "./pages/coperate/UploadDoc.jsx";
import CoperateInReview from "./pages/coperate/InReview.jsx";
import Recruitment from "./pages/employerDashboard/Recruitment.jsx";
import CandidateSearchPage from "./pages/employerDashboard/CandidateSearchPage.jsx";
import Chat from "./pages/employerDashboard/Chat.jsx";
import Connection from "./pages/employerDashboard/Connection.jsx";
import PostPage from "./pages/employerDashboard/PostPage.jsx";
import Notifications from "./pages/employerDashboard/Notifications.jsx";


function App() {
  return (
    <Router>
      <Routes>
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
        <Route path="/save-progress" element={<SaveProgress />} />\


        <Route element={<ResumeLayout />}>
          <Route path="/bio" element={<Bio />} />
          <Route path="/education" element={<Education />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/work-history" element={<WorkHistory />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/links" element={<Link />} />
        </Route>

       
        <Route element={<IndividualVerificationLayout />}>
          <Route path="/individual/basic-details" element={<BasicDetails />} />
          <Route path="/individual/profile-setup" element={<ProfileSetup />} />
          <Route path="/individual/location" element={<Location />} />
          <Route path="/individual/verify" element={<Verify />} />
          <Route path="/individual/selectid" element={<SelectId />} />
          <Route path="/individual/upload" element={<UploadDoc />} />
          <Route path="/individual/inreview" element={<InReview />} />
        </Route>

      
        <Route element={<CoperateVerificationLayout />}>
          <Route
            path="/coperate/basic-details" element={<CoperateBasicDetails />}/> <Route
            path="/coperate/profile-setup" element={<CoperateProfileSetup />}/> <Route
            path="/coperate/company-details"element={<CompanyDetails />}/>
          <Route path="/coperate/location" element={<CoperateLocation />} />
          <Route path="/coperate/verify" element={<CoperateVerify />} />
          <Route path="/coperate/upload" element={<CoperateUploadDoc />} />
          <Route path="/coperate/inreview" element={<CoperateInReview />} />
        </Route>
        <Route path="/job-type" element={<JobType />} />


        <Route path="/post-page" element={<PostPage />} />
        <Route path="/recruitment" element={<Recruitment/>} />
        <Route path="/candidate-search-page" element={<CandidateSearchPage />} />
        <Route path="/chats" element={<Chat/>} />
        <Route path="/connection" element={<Connection/>} />
        <Route path="/notification" element={<Notifications/>} />
      </Routes>
    </Router>
  );
}

export default App;
