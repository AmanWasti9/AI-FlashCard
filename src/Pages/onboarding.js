import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Github,
  SecondaryButton,
  DangerButton,
  DemoBtn,
} from "../components/buttons";
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
    <Box className="fluid-gradient">
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
      <motion.div
        ref={ref}
        className="w"
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
      >
        <DemoBtn />
      </motion.div>
    </Box>
    // </div>
  );
}
