<<<<<<< HEAD
import "./App.css";
import Background from "./components/dashboard"; // Assuming this is your background component
import Dashboard from "./Pages/dashboard";
import Login from "./Pages/login";
import Onboarding from "./Pages/onboarding";
import SignUp from "./Pages/signup";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  // Get the current route
=======
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import Background from './components/dashboard';
import Dashboard from './Pages/dashboard';
import Login from './Pages/login';
import Onboarding from './Pages/onboarding';
import SignUp from './Pages/signup';

function App() {
>>>>>>> 6b30687540aa3492a50857df0e86c02c65394637
  const location = useLocation();

  return (
    <div>
      {/* Background Component */}
      <div
        style={{
          position: 'fixed',
          zIndex: '1',
          width: '100%',
          height: '100%',
        }}
      >
        <Background />
      </div>

      {/* Main Content */}
      <div
        style={{
<<<<<<< HEAD
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
=======
          position: 'fixed',
          zIndex: '2',
        }}
      >
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route path="/sign-up" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SignUp />
              </motion.div>
            } />
            <Route path="/" element={
                <Onboarding />
            } />
            <Route path="/login" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Login />
              </motion.div>
            } />
            <Route path="/dashboard" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Dashboard />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
>>>>>>> 6b30687540aa3492a50857df0e86c02c65394637
      </div>
    </div>
  );
}

export default App;
