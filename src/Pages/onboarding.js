import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Github, SecondaryButton, DangerButton } from "../components/buttons";
import { Box } from "@mui/material";

export default function Onboarding() {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.9, // Start animation when 90% of the element is in view
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
    // <div style={{ height: "150vh", paddingTop: "50vh" }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: "2",
      }}
    >
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
        <Github />
      </motion.div>
    </Box>
    // </div>
  );
}
