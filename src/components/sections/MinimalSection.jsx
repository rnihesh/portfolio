import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "../../data/skills";
import { projects } from "../../data/projects";
import { experience } from "../../data/experience";
import {
  LuMail,
  LuPhone,
  LuGithub,
  LuLinkedin,
  LuExternalLink,
  LuArrowUp,
  LuKeyboard,
} from "react-icons/lu";
import "./MinimalSection.css";

function MinimalSection({ onBackToChoice }) {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const sections = useMemo(
    () => [
      { id: "about", label: "About", key: "1" },
      { id: "skills", label: "Skills", key: "2" },
      { id: "experience", label: "Experience", key: "3" },
      { id: "projects", label: "Projects", key: "4" },
      { id: "contact", label: "Contact", key: "5" },
    ],
    []
  );

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Numbers 1-5 for section navigation
      const sectionIndex = parseInt(e.key) - 1;
      if (sectionIndex >= 0 && sectionIndex < sections.length) {
        scrollToSection(sections[sectionIndex].id);
        return;
      }

      // Other shortcuts
      switch (e.key.toLowerCase()) {
        case "h":
          setShowKeyboardHelp(!showKeyboardHelp);
          break;
        case "b":
        case "escape":
          onBackToChoice();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showKeyboardHelp, onBackToChoice, sections]);

  const contactInfo = [
    {
      icon: LuMail,
      label: "Email",
      value: "niheshr03@gmail.com",
      href: "mailto:niheshr03+portfolio@gmail.com",
    },
    {
      icon: LuPhone,
      label: "Phone",
      value: "+91 83280 94810",
      href: "tel:+918328094810",
    },
    {
      icon: LuGithub,
      label: "GitHub",
      value: "github.com/rnihesh",
      href: "https://github.com/rnihesh",
    },
    {
      icon: LuLinkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/rachakonda-nihesh",
      href: "https://www.linkedin.com/in/rachakonda-nihesh/",
    },
  ];

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white minimal-section">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Nihesh
          </h1>

          <nav className="hidden md:flex gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-sm transition-colors text-gray-500 hover:text-black dark:hover:text-white"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span className="text-xs opacity-50 mr-1">{section.key}</span>
                {section.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <LuKeyboard size={16} className="inline mr-1" />
              <span className="hidden lg:inline">H</span>
            </button>

            <button
              onClick={onBackToChoice}
              className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <LuArrowUp size={16} className="inline mr-1" />
              Back
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <motion.nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 "
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="flex justify-around py-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-xs py-2 px-3 transition-colors text-gray-500 hover:text-black dark:hover:text-white"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {section.label}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content - All sections visible */}
      <main className="pt-20 pb-20 md:pb-8 bg-img">
        <div className="max-w-4xl mx-auto px-6 space-y-20">
          {/* About Section */}
          <motion.section
            id="about"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={staggerItem}>
              <h2
                className="text-2xl font-bold text-black dark:text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Hi, I'm Nihesh <span className="text-gray-500">Rachakonda</span>
              </h2>
              <div
                className="text-gray-600 dark:text-gray-400 space-y-4"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <p>
                  A passionate Full Stack Developer with a strong eye for design
                  and detail.
                </p>
                <p>
                  I build modern web applications that are not only functional
                  but also intuitive and visually clean.
                </p>
                <p>
                  Currently exploring new technologies and constantly learning
                  to improve my craft.
                </p>
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <h3
                className="text-lg font-semibold text-black dark:text-white mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                What I Do
              </h3>
              <ul
                className="text-gray-600 dark:text-gray-400 space-y-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <li>
                  • Frontend Development with React.js & modern frameworks
                </li>
                <li>• Backend Development with Node.js & Express</li>
                <li>• Database Design & Management (MongoDB, MySQL)</li>
                <li>• UI/UX Design with focus on clean aesthetics</li>
                <li>• Mobile Development with React Native</li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Skills Section */}
          <motion.section
            id="skills"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h2
              className="text-2xl font-bold text-black dark:text-white mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Skills
            </h2>
            {Object.entries(skillsByCategory).map(
              ([category, categorySkills]) => (
                <motion.div key={category} variants={staggerItem}>
                  <h3
                    className="text-lg font-semibold text-black dark:text-white mb-4"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categorySkills.map((skill) => (
                      <motion.div
                        key={skill.name}
                        className="text-gray-600 dark:text-gray-400 text-sm"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        whileHover={{
                          color: "#000000",
                          transition: { duration: 0.2 },
                        }}
                      >
                        {skill.name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            )}
          </motion.section>

          {/* Experience Section */}
          <motion.section
            id="experience"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h2
              className="text-2xl font-bold text-black dark:text-white mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Experience
            </h2>
            {experience.map((job, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className="text-xl font-semibold text-black dark:text-white"
                      style={{ fontFamily: "'Cascadia Code', monospace" }}
                    >
                      {job.company}
                    </h3>
                    <p
                      className="text-blue-600 dark:text-blue-400 font-medium"
                      style={{ fontFamily: "'Bodoni Moda', serif" }}
                    >
                      {job.role}
                    </p>
                  </div>
                  <span
                    className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {job.period}
                  </span>
                </div>

                <p
                  className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Projects Section */}
          <motion.section
            id="projects"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <h2
              className="text-2xl font-bold text-black dark:text-white mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Projects
            </h2>
            {projects.map((project) => (
              <motion.div
                key={project.title}
                variants={staggerItem}
                className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3
                    className="text-xl font-semibold text-black dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {project.title}
                  </h3>
                  <div className="flex gap-3">
                    {project.ctaLink && (
                      <a
                        href={project.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <LuExternalLink size={18} />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <LuGithub size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <p
                  className="text-gray-600 dark:text-gray-400 text-sm mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {project.description}
                </p>

                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  {project.content && (
                    <div className="minimal-project-content">
                      {project.content()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Education Section */}
          {/* <motion.section
            id="education"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={staggerItem}>
              <h2
                className="text-2xl font-bold text-black dark:text-white mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Education
              </h2>

              <div className="space-y-6">
                <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-6">
                  <h3
                    className="text-lg font-semibold text-black dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Bachelor's in Computer Science
                  </h3>
                  <p
                    className="text-gray-600 dark:text-gray-400 text-sm mb-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    2021 - 2025 • Pursuing
                  </p>
                  <p
                    className="text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Focused on web development, algorithms, and software
                    engineering principles. Active in coding competitions and
                    open-source contributions.
                  </p>
                </div>

                <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-6">
                  <h3
                    className="text-lg font-semibold text-black dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Certifications & Learning
                  </h3>
                  <ul
                    className="text-gray-600 dark:text-gray-400 space-y-2 mt-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <li>• Full Stack Web Development (Self-taught)</li>
                    <li>• MongoDB & Database Design</li>
                    <li>• React.js & Modern Frontend Development</li>
                    <li>• Cloud Computing with AWS</li>
                    <li>• Git & Version Control Systems</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.section> */}

          {/* Contact Section */}
          <motion.section
            id="contact"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={staggerItem}>
              <h2
                className="text-2xl font-bold text-black dark:text-white mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Let's Connect
              </h2>
              <p
                className="text-gray-600 dark:text-gray-400 mb-8"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                I'm always open to discussing new opportunities, interesting
                projects, or just having a chat about technology.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-4">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors group"
                >
                  <item.icon
                    size={20}
                    className="text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors"
                  />
                  <div>
                    <div
                      className="text-sm text-gray-500 dark:text-gray-400"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-black dark:text-white group-hover:font-medium transition-all"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </motion.div>
          </motion.section>
        </div>
      </main>

      {/* Keyboard Help Overlay */}
      <AnimatePresence>
        {showKeyboardHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-xs z-50 flex items-center justify-center"
            onClick={() => setShowKeyboardHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-6 rounded-lg max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className="text-lg font-semibold text-black dark:text-white mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Keyboard Shortcuts
              </h3>

              <div
                className="space-y-2 text-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {sections.map((section) => (
                  <div key={section.id} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {section.label}
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      {section.key}
                    </kbd>
                  </div>
                ))}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Show/Hide Help
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      H
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Back to Choice
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      B / ESC
                    </kbd>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="mt-4 w-full py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .minimal-project-content p {
          margin-bottom: 1rem;
        }
        .minimal-project-content .flex {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .minimal-project-content span {
          padding: 0.25rem 0.75rem;
          background-color: transparent;
          border: 1px solid;
          border-color: #e5e7eb;
          color: #6b7280;
          font-size: 0.75rem;
          font-family: "JetBrains Mono", monospace;
        }
        .dark .minimal-project-content span {
          border-color: #374151;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default MinimalSection;
