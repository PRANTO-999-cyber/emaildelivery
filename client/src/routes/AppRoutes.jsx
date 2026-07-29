import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../constants";

// Core Dashboard Components
import DashboardOverview from "../components/dashboard/DashboardOverview";
import CampaignList from "../components/campaigns/CampaignList";
import ContactList from "../components/contacts/ContactList";
import DomainList from "../components/domains/DomainList";
import AnalyticsOverview from "../components/analytics/AnalyticsOverview";

// Pages
const DeliverabilityDetails = lazy(
  () => import("../pages/DeliverabilityDetails"),
);
const DomainDetails = lazy(() => import("../pages/DomainDetails"));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-slate-400">
          Loading page...
        </div>
      }
    >
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path={ROUTES.HOME}
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
            <Route path={ROUTES.DASHBOARD} element={<DashboardOverview />} />
            <Route path={ROUTES.CAMPAIGNS} element={<CampaignList />} />
            <Route path={ROUTES.CONTACTS} element={<ContactList />} />
            <Route path={ROUTES.DOMAINS} element={<DomainList />} />
            <Route path={`${ROUTES.DOMAINS}/:id`} element={<DomainDetails />} />
            <Route path={ROUTES.ANALYTICS} element={<AnalyticsOverview />} />
            <Route path="/deliverability" element={<DeliverabilityDetails />} />
          </Route>
        </Route>

        {/* Catch-all redirect to Dashboard */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </Suspense>
  );
}
