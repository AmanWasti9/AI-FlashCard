import "./App.css";
import Background from "./components/dashboard"; // Assuming this is your background component
import Dashboard from "./Pages/dashboard";
import Login from "./Pages/login";
import Onboarding from "./Pages/onboarding";
import SignUp from "./Pages/signup";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  // Get the current route
  const location = useLocation();

  return (
    <div>
      {/* Background Component */}
      <div
        style={{
          position: "fixed",
          zIndex: "1",
          width: "100%",
          height: "100%",
        }}
      >
        <Background />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: "fixed",
          zIndex: "2",
          width: "100%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />

          {/* Render Dashboard with Navigation and Content */}
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
