import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import PageLoader from "./components/common/PageLoader";
import Home from "./pages/Home";
import Portal from "./pages/Portal";
import Browse from "./pages/Browse";
import Watch from "./pages/Watch";
import Character from "./pages/Character";
import Staff from "./pages/Staff";


import Schedule from "./pages/Schedule";


export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <PageLoader />
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/character/:id" element={<Character />} />
        <Route path="/staff/:id" element={<Staff />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}
