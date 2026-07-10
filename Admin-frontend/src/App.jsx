import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AuthBootstrap from "./components/AuthBootstrap";
import PushNotificationBootstrap from "./components/PushNotificationBootstrap";
import AdminLogin from "./page/admin/AdminLogin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./page/admin/AdminDashboard";
import AdminDemographics from "./page/admin/AdminDemographics";
import AdminEngagement from "./page/admin/AdminEngagement";
import AdminJobs from "./page/admin/AdminJobs";
import AdminList from "./page/admin/AdminList";
import AdminAdPro from "./page/admin/AdminAdPro";
import AdminUsers from "./page/admin/AdminUsers";
import EmailSent from "./page/auth/EmailSent";
import AuthSuccess from "./page/auth/AuthSuccess";
import AuthFailure from "./page/auth/AuthFailure";

import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminRevenue from "./page/admin/AdminRevenue";
import AdminRecruitment from "./page/admin/AdminRecruitment";
import AdminEmailOutreach from "./page/admin/AdminEmailOutreach";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthBootstrap>
          <PushNotificationBootstrap />
          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={<AdminLogin />} />
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
              <Route path="email-outreach" element={<AdminEmailOutreach />} />
            </Route>

            <Route path="/auth/email-sent" element={<EmailSent />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/auth/failure" element={<AuthFailure />} />
          </Routes>
          {/* <ProfileCompletionReminder /> */}
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
