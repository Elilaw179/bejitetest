import { Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import {
  CandidateSearchPage,
  CreateJob,
  EmployerDashboard,
  BulkCreateJobs,
  ExtendJob,
  JobExtendCallback,
  JobApplications,
  RecruitWithASE,
  RepostJob,
} from "../lazyPages.js";

export const employerRoutes = (
  <>
      <Route
        path="/candidate-search-page"
        element={
          <ProtectedRoute redirectMessage="Your session has expired. Please log in again.">
            <CandidateSearchPage />
          </ProtectedRoute>
        }
      />
      <Route path="/employer/create-job" element={<CreateJob />} />
      <Route path="/employer/dashboard" element={<EmployerDashboard />} />
      <Route path="/employer/bulk-create" element={<BulkCreateJobs />} />
      <Route path="/employer/extend/callback" element={<JobExtendCallback />} />
      <Route path="/employer/job/:id/extend" element={<ExtendJob />} />
      <Route path="/employer/job/:id/applications" element={<JobApplications />} />
      <Route path="/employer/job/:id/recruit" element={<RecruitWithASE />} />
      <Route path="/employer/job/:id/repost" element={<RepostJob />} />
  </>
);
