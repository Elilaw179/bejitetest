import { Navigate, Route } from "react-router-dom";
import {
  AdProDashboard,
  CampaignReports,
  CampaignDetails,
  CreateCampaign,
  EditCampaign,
  EditCampaignAudience,
} from "../lazyPages.js";

export const adProRoutes = (
  <>
      <Route path="/adpro" element={<AdProDashboard />} />
      <Route path="/ad-pro-dashboard" element={<Navigate to="/adpro" replace />} />
      <Route path="/adpro/campaign/:id" element={<CampaignDetails />} />
      <Route path="/adpro/campaign/:id/reports" element={<CampaignReports />} />
      <Route path="/adpro/create" element={<CreateCampaign />} />
      <Route path="/adpro/campaign/:id/edit" element={<EditCampaign />} />
      <Route
        path="/adpro/campaign/:id/edit-audience"
        element={<EditCampaignAudience />}
      />
  </>
);
