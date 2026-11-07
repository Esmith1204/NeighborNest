import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { MotionConfig } from "motion/react";
import "./index.css";
import { AppLayout } from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Start from "./pages/Start";
import Stub from "./pages/Stub";

/** Old links (/legacy?preset=...) land on the dashboard with the same example. */
function LegacyRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/dashboard${search}`} replace />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* reducedMotion="user": transforms off for people who ask for less motion; opacity fades stay. */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Landing />} />
            <Route path="start" element={<Start />} />
            <Route path="homeowner" element={<Stub title="Homeowner intake" />} />
            <Route path="renter" element={<Stub title="Renter intake" />} />
            <Route path="partner" element={<Stub title="Partner intake" />} />
            <Route path="how-it-works" element={<Stub title="How it works" />} />
            <Route path="sources" element={<Stub title="Sources" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="legacy" element={<LegacyRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
