"use client";

import { motion } from "framer-motion";
import type { Metadata } from "next";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const VALUES = [
  {
    icon: "🔬",
    title: "Data-Driven Research",
    description:
      "Every article is grounded in verifiable data, peer-reviewed research, and real-world benchmarks — never hype.",
  },
  {
    icon: "🧠",
    title: "Deep Technical Expertise",
    description:
      "Written by engineers who build production AI/ML systems, our content goes beyond surface-level summaries.",
  },
  {
    icon: "🌍",
    title: "Industry-Wide Perspective",
    description:
      "We cover the full technology stack — from low-level ML infrastructure to cloud-native DevOps and modern web frameworks.",
  },
  {
    icon: "🎯",
    title: "Actionable Insights",
    description:
      "Readers walk away with practical knowledge they can apply to their own projects, teams, and careers.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-accent/10 text-accent border border-accent/20 mb-6">
          About Us
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-6">
          Daily Developer Insights
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Your trusted source for cutting-edge, data-driven insights into
          Artificial Intelligence, software engineering, and the future of
          Information Technology.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-16"
      >
        <div className="rounded-2xl border border-border/50 bg-card/50 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Our Mission
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              At <strong className="text-foreground">Daily Developer Insights</strong>, we
              believe that staying informed is the first step to building the
              future. The AI and IT landscape evolves at an extraordinary pace —
              new models, frameworks, and paradigms emerge weekly. Our mission is
              to distil that complexity into clear, authoritative, and
              actionable content that empowers developers, engineers, and
              technology leaders to make better decisions.
            </p>
            <p>
              We publish in-depth articles, tutorials, and analysis pieces
              covering topics such as <strong className="text-foreground">Artificial Intelligence</strong>,{" "}
              <strong className="text-foreground">Machine Learning</strong>,{" "}
              <strong className="text-foreground">Deep Learning</strong>,{" "}
              <strong className="text-foreground">Cloud Computing</strong>,{" "}
              <strong className="text-foreground">DevOps</strong>, and{" "}
              <strong className="text-foreground">Modern Web Development</strong>. Every piece
              is rigorously researched, technically accurate, and written with
              the working professional in mind.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        initial="hidden"
        animate="visible"
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
          What Sets Us Apart
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              custom={i}
              variants={fadeUp}
              className="rounded-xl border border-border/50 bg-card/50 p-6 hover:border-accent/30 transition-colors"
            >
              <div className="text-3xl mb-3">{value.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* E-E-A-T: Experience & Expertise */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-16"
      >
        <div className="rounded-2xl border border-border/50 bg-card/50 p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Experience &amp; Expertise
          </h2>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              Our editorial team comprises seasoned software engineers, machine
              learning practitioners, and cloud architects with years of
              hands-on experience building production-grade systems. We draw on
              direct, first-hand experience deploying large-scale AI models,
              architecting distributed infrastructure, and shipping software
              used by millions.
            </p>
            <p>
              This depth of experience ensures that every article published on
              Daily Developer Insights is not just theoretically sound, but
              practically relevant. We don&apos;t just report on technology — we
              build with it every day.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="rounded-2xl border border-border/50 bg-card/50 p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-muted leading-relaxed mb-6 max-w-xl mx-auto">
            Have a question, feedback, or a collaboration idea? We&apos;d love to
            hear from you. Reach out and our team will get back to you as soon
            as possible.
          </p>
          <a
            href="mailto:contact@dailydeveloperinsights.tech"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            contact@dailydeveloperinsights.tech
          </a>
        </div>
      </motion.section>
    </div>
  );
}
