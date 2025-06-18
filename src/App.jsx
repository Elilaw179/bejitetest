
import { BrowserRouter as Router, Routes, Route, Links } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ForgetPassword from "./pages/ForgetPassword";
import EmailCheck from "./pages/EmailCheck";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ConfirmPassword from "./pages/ConfirmPassword";
import SignUpRole from "./pages/SignUpRole";
import JobConnection from "./pages/JobConnection";
import JobSeekerOpt from "./pages/JobSeekerOpt";
import Resume from "./pages/Resume";
import Bio from "./pages/Bio";
import Education from "./pages/Education";
import ResumeLayout from "./components/ResumeLayout";
import Skills from "./pages/Skills";
import WorkHistory from "./pages/WorkHistory";
import Certificate from "./pages/Certificate";
import Link from "./pages/Link";

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
        <Route path="/jobseeker-option" element={< JobSeekerOpt/>}  />
        <Route path="/jobconnection" element={<JobConnection/>}/>
        <Route path="/resume"  element={<Resume/>}/>


          <Route element={<ResumeLayout />}>
          <Route path="/bio" element={<Bio />} />
          <Route path="/education" element={<Education />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/work-history" element={<WorkHistory />} />
          <Route path="/certificate" element={<Certificate/>} />
          <Route path="/links" element={<Link/>} />
         
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
