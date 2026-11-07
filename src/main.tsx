import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { MotionConfig } from "motion/react";
import "./index.css";
import { AppLayout } from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Legacy from "./pages/Legacy";
import NotFound from "./pages/NotFound";
import Start from "./pages/Start";
import Stub from "./pages/Stub";

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
            <Route path="legacy" element={<Legacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
