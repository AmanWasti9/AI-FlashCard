import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Snackbar,
  Alert,
  Paper,
  Typography,
} from "@mui/material";
import { firestore } from "../firebase"; // Ensure you import and initialize Firebase correctly
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import CircleProgress from "../components/circleprogress";
import { Link } from "react-router-dom";

export default function Onboarding() {
  const [email, setEmail] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const controls = useAnimation();
  const [totalSignups, setTotalSignups] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  const fetchTotalSignups = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "waitlist"));
      const total = querySnapshot.size;
      setTotalSignups(total);
    } catch (error) {
      console.error("Error fetching total signups: ", error);
    }
  };

  useEffect(() => {
    fetchTotalSignups();
  }, []);

  useEffect(() => {
    let start = 0;
    const end = totalSignups;
    if (start === end) return;

    const incrementTime = Math.abs(Math.floor(2000 / (end - start)));

    const timer = setInterval(() => {
      start += 1;
      setDisplayCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [totalSignups]);
  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(firestore, "waitlist", email), {
        email: email,
      });
      setEmail("");

      setSnackbarMessage("Joined Our Waitlist successfully!");
      setSnackbarOpen(true);

      // Delay the Snackbar closing to show the message
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
    } catch (error) {
      // console.log(error.message);
      setSnackbarMessage("Registration failed. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.9,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1.5 },
      });
    }
  }, [controls, inView]);

  return (
    <Box className="fluid-gradient" component="form" onSubmit={handleJoin}>
      <motion.div
        ref={ref}
        className="w"
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
      >
        Welcome
      </motion.div>
      <motion.div
        ref={ref}
        className="w"
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
      >
        to
      </motion.div>
      <motion.div
        ref={ref}
        className="w1"
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
      >
        NeXoCard
      </motion.div>
      <br />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Link
          to="/sign-up"
          className="btn"
          type="submit"
          style={{
            textDecoration: "none",
          }}
        >
          Get Started
        </Link>
      </motion.div>
      <br />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            snackbarMessage === "Joined Our Waitlist successfully!"
              ? "success"
              : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
