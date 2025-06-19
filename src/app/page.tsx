"use client";

import Blog from "@/components/Blog";
// import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen">
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Hero />
        <Services />
        <Skills />
        <Projects />
        <Blog />
        {/* <Contact /> */}
      </motion.main>{" "}
      <Footer />
      {/* <ThemeDebugger /> */}
    </div>
  );
}
