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
import CustomMatch from "./src/pages/CustomMatch";
import ServiceDashboard from "./src/pages/ServiceDashboard";
import BargeinLanding from "./src/pages/BargeinLanding";
import BargeinConsent from "./src/pages/BargeinConsent";
import BargeinSelectCar from "./src/pages/BargeinSelectCar";
import BargeinArenaRoom from "./src/pages/BargeinArenaRoom";
import LoanArenaRoom from "./src/pages/LoanArenaRoom";
import BargeinTokenSuccess from "./src/pages/BargeinTokenSuccess";
import DealerPage from "./src/pages/DealerPage";
import MentorPage from "./src/pages/MentorPage";
import ServiceProviderPage from "./src/pages/ServiceProviderPage";
import { ProfileSetup } from "./src/pages/ProfileSetup";
import SimpleLogin from "./src/pages/SimpleLogin";
import DealerLogin from "./src/pages/dealer/Login";
import DealerSignup from "./src/pages/dealer/Signup";
import DealerDashboard from "./src/pages/dealer/Dashboard";

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
            {/* Global spacer to avoid content under the fixed Header */}
            <main className="pt-20 md:pt-24">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/auth" element={<AuthLanding />} />
                <Route path="/login" element={<Login />} />
                <Route path="/simple-login" element={<SimpleLogin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/mentor-profile" element={<MentorProfile />} />
                <Route path="/mentor-selection" element={<MentorSelection />} />
                <Route path="/mentor-detail/:mentorId" element={<MentorDetail />} />
                <Route path="/mentor-chat/:mentorId" element={<MentorChat />} />
                <Route path="/car/:carId" element={<CarDetail />} />
                <Route path="/custom-match" element={<CustomMatch />} />
                <Route path="/service-dashboard" element={<ServiceDashboard />} />
                {/* New raw pages */}
                <Route path="/dealer" element={<DealerPage />} />
                <Route path="/dealer/login" element={<DealerLogin />} />
                <Route path="/dealer/signup" element={<DealerSignup />} />
                <Route path="/dealer/dashboard" element={<DealerDashboard />} />
                <Route path="/mentor" element={<MentorPage />} />
                <Route path="/service-provider" element={<ServiceProviderPage />} />
                {/* Bargein Arena Routes */}
                <Route path="/bargein" element={<BargeinLanding />} />
                <Route path="/bargein/consent" element={<BargeinConsent />} />
                <Route path="/bargein/token-success/:tokenId" element={<BargeinTokenSuccess />} />
                <Route path="/bargein/select-car" element={<BargeinSelectCar />} />
                <Route path="/bargein/arena/:arenaId" element={<BargeinArenaRoom />} />
                {/* Loan Arena Route */}
                <Route path="/loan-arena/:arenaId" element={<LoanArenaRoom />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}