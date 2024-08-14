import "./App.css";
import Background from "./components/dashboard";
import Dashboard from "./Pages/dashboard";
import Login from "./Pages/login";
import Onboarding from "./Pages/onboarding";
import SignUp from "./Pages/signup";
import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
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

      <div
        style={{
          position: "fixed",
          zIndex: "2",
        }}
      >
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
