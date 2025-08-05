import { Routes, Route } from "react-router-dom";
import { Header } from "./src/components/Header";
import { Footer } from "./src/components/Footer";
import { ScrollToTop } from "./src/components/ScrollToTop";
import { Homepage } from "./src/pages/Homepage";
import AuthLanding from "./src/pages/AuthLanding";
import Login from "./src/pages/Login";
import Signup from "./src/pages/Signup";
import Profile from "./src/pages/Profile";
import MentorProfile from "./src/pages/MentorProfile";
import MentorSelection from "./src/pages/MentorSelection";
import MentorDetail from "./src/pages/MentorDetail";
import MentorChat from "./src/pages/MentorChat";
import { CarDetail } from "./src/pages/CarDetail";
import { StartupScreen } from "./src/pages/StartupScreen";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Routes>
        {/* Startup Screen Route */}
        <Route path="/startup" element={<StartupScreen />} />
        
        {/* Main App Routes with Header and Footer */}
        <Route path="/*" element={
          <>
            <ScrollToTop />
            <Header />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<AuthLanding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/mentor-profile" element={<MentorProfile />} />
              <Route path="/mentor-selection" element={<MentorSelection />} />
              <Route path="/mentor-detail/:mentorId" element={<MentorDetail />} />
              <Route path="/mentor-chat/:mentorId" element={<MentorChat />} />
              <Route path="/car/:carId" element={<CarDetail />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}