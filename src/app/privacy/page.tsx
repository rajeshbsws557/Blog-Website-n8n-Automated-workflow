"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const LAST_UPDATED = "February 22, 2026";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "We may collect the following types of information when you visit or interact with Daily Developer Insights:",
      "**Personal Information:** When you subscribe to our newsletter, leave a comment, or contact us via email, we may collect your name and email address.",
      "**Usage Data:** We automatically collect certain information when you visit our website, including your IP address, browser type and version, operating system, referring URLs, pages viewed, time spent on pages, and the date and time of your visit.",
      "**Cookies and Tracking Technologies:** We use cookies, web beacons, and similar tracking technologies to collect usage data, remember your preferences, and serve relevant advertisements. See Section 4 for full details on our cookie practices.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect for the following purposes:",
      "• To provide, maintain, and improve our website and content.",
      "• To send you newsletters and updates you have subscribed to.",
      "• To respond to your inquiries and provide customer support.",
      "• To analyse website traffic and usage patterns to improve user experience.",
      "• To display personalised or non-personalised advertisements through third-party advertising partners.",
      "• To detect, prevent, and address technical issues and security threats.",
    ],
  },
  {
    title: "3. Third-Party Vendors and Advertising",
    content: [
      "Daily Developer Insights uses third-party advertising companies, including **Google AdSense**, to serve ads when you visit our website. These companies may use cookies and similar technologies to collect information about your visits to this and other websites in order to provide advertisements about goods and services that may interest you.",
      "**Google**, as a third-party vendor, uses cookies — including the **DART cookie** and cookies served through **Google Analytics** — to serve ads based on your prior visits to this website and other sites on the Internet. Google's use of advertising cookies enables it and its partners to serve ads to you based on your browsing history.",
      "Other third-party vendors and ad networks may also use cookies to serve and target ads. These third parties are subject to their own privacy policies, and we encourage you to review them.",
    ],
  },
  {
    title: "4. Cookies",
    content: [
      "Cookies are small text files placed on your device by websites you visit. We use the following types of cookies:",
      "**Essential Cookies:** Required for basic website functionality, such as remembering your session and preferences.",
      "**Analytics Cookies:** Help us understand how visitors interact with our website by collecting and reporting information anonymously (e.g., Google Analytics).",
      "**Advertising Cookies:** Used by third-party advertising partners (e.g., Google AdSense) to build a profile of your interests and show you relevant ads on other sites.",
      "You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete them. Please note that disabling cookies may affect the functionality of certain parts of this website.",
    ],
  },
  {
    title: "5. Opt-Out of Personalised Advertising",
    content: [
      "You have the right to opt out of personalised advertising. You can do so through the following methods:",
      "• **Google Ads Settings:** Visit [Google Ads Settings](https://www.google.com/settings/ads) to manage your ad personalisation preferences or opt out entirely.",
      "• **Network Advertising Initiative (NAI):** Visit [www.networkadvertising.org/choices](https://www.networkadvertising.org/choices/) to opt out of personalised advertising from NAI member companies.",
      "• **Digital Advertising Alliance (DAA):** Visit [www.aboutads.info/choices](https://www.aboutads.info/choices/) to opt out of interest-based advertising from DAA participating companies.",
      "• **Your Browser:** You may also adjust your browser settings to block third-party cookies or clear existing cookies.",
      "Please note that opting out of personalised advertising does not mean you will stop seeing ads — you will still receive non-personalised (generic) advertisements.",
    ],
  },
  {
    title: "6. Data Sharing and Disclosure",
    content: [
      "We do not sell, trade, or rent your personal information to third parties. We may share information in the following limited circumstances:",
      "• With trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality obligations.",
      "• With advertising partners (as described in Section 3) for the purpose of serving relevant ads.",
      "• When required by law, regulation, or legal process.",
      "• To protect our rights, privacy, safety, or property, or that of our users or the public.",
    ],
  },
  {
    title: "7. Data Security",
    content: [
      "We implement reasonable technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      "Daily Developer Insights is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately so we can delete it.",
    ],
  },
  {
    title: "9. Your Rights",
    content: [
      "Depending on your jurisdiction, you may have the following rights regarding your personal data:",
      "• The right to access, update, or delete your personal information.",
      "• The right to object to or restrict the processing of your personal data.",
      "• The right to data portability.",
      "• The right to withdraw consent at any time.",
      "To exercise any of these rights, please contact us at the email address provided below.",
    ],
  },
  {
    title: "10. Changes to This Privacy Policy",
    content: [
      "We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated \"Last Updated\" date. We encourage you to review this page periodically to stay informed about how we protect your information.",
    ],
  },
  {
    title: "11. Contact Us",
    content: [
      "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:",
      "**Email:** contact@dailydeveloperinsights.tech",
    ],
  },
];

function renderText(text: string) {
  // Handle bold markdown **text** and markdown links [text](url)
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default function PrivacyPolicyPage() {
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
          Legal
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted">
          Last updated: {LAST_UPDATED}
        </p>
      </motion.div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-border/50 bg-card/50 p-8 sm:p-10 mb-10"
      >
        <p className="text-muted leading-relaxed">
          At <strong className="text-foreground">Daily Developer Insights</strong>{" "}
          (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), accessible at{" "}
          <a
            href="https://dailydeveloperinsights.tech"
            className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors"
          >
            dailydeveloperinsights.tech
          </a>
          , your privacy is important to us. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit
          our website. Please read this policy carefully. By using our website,
          you consent to the practices described herein.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + index * 0.03 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-8 sm:p-10"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">
              {section.title}
            </h2>
            <div className="space-y-3 text-muted leading-relaxed">
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>{renderText(paragraph)}</p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
