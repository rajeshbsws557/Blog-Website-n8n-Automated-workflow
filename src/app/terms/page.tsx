"use client";

import { motion } from "framer-motion";

const LAST_UPDATED = "February 22, 2026";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing and using Daily Developer Insights (\"the Website\"), accessible at dailydeveloperinsights.tech, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the Website.",
      "We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Website after any modifications indicates your acceptance of the updated terms.",
    ],
  },
  {
    title: "2. Description of Service",
    content: [
      "Daily Developer Insights is an online technology blog that publishes articles, tutorials, opinion pieces, and analysis on topics including but not limited to Artificial Intelligence, Machine Learning, Deep Learning, Cloud Computing, DevOps, and Software Engineering.",
      "We also offer a newsletter subscription service that delivers content updates to users who voluntarily subscribe via their email address.",
    ],
  },
  {
    title: "3. Intellectual Property Rights",
    content: [
      "All content published on the Website — including but not limited to articles, text, graphics, logos, images, code snippets, and page layouts — is the intellectual property of Daily Developer Insights or its content creators and is protected by applicable copyright and trademark laws.",
      "You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any content from this Website without prior written consent, except for personal, non-commercial use such as sharing links or quoting brief excerpts with proper attribution.",
    ],
  },
  {
    title: "4. User Conduct",
    content: [
      "When using the Website, you agree to the following:",
      "• You will not use the Website for any unlawful purpose or in violation of any applicable local, national, or international law.",
      "• You will not attempt to gain unauthorised access to any part of the Website, its servers, or any connected systems or databases.",
      "• You will not engage in any activity that disrupts or interferes with the Website's functionality, including distributing malware, spam, or executing denial-of-service attacks.",
      "• You will not impersonate any person or entity, or falsely represent your affiliation with any person or entity.",
      "• If you submit comments or feedback, you agree that such content does not violate the rights of any third party and is not defamatory, obscene, or otherwise objectionable.",
    ],
  },
  {
    title: "5. Newsletter Subscription",
    content: [
      "By subscribing to our newsletter, you consent to receive periodic emails from Daily Developer Insights containing blog updates, curated content, and occasional announcements.",
      "You may unsubscribe from the newsletter at any time by clicking the \"Unsubscribe\" link included in each email or by contacting us directly. Upon unsubscribing, we will promptly remove your email address from our mailing list.",
    ],
  },
  {
    title: "6. Third-Party Links",
    content: [
      "The Website may contain links to third-party websites, services, or resources that are not owned or controlled by Daily Developer Insights. We provide these links for convenience and informational purposes only.",
      "We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You access third-party links at your own risk and are advised to review their respective terms and policies.",
    ],
  },
  {
    title: "7. Advertisements",
    content: [
      "The Website displays third-party advertisements, including ads served by Google AdSense and other advertising networks. These advertisements may use cookies and tracking technologies to serve relevant ads based on your browsing behaviour.",
      "We are not responsible for the content of third-party advertisements. Any transactions or interactions between you and advertisers are solely between you and the respective advertiser. Please refer to our Privacy Policy for more information about advertising cookies and how to opt out.",
    ],
  },
  {
    title: "8. Disclaimer of Warranties",
    content: [
      "The content on Daily Developer Insights is provided on an \"as is\" and \"as available\" basis for general informational and educational purposes only. We make no representations or warranties of any kind, express or implied, regarding:",
      "• The accuracy, completeness, or reliability of any content published on the Website.",
      "• The suitability of the information for any particular purpose.",
      "• The uninterrupted or error-free availability of the Website.",
      "The articles and tutorials on this Website do not constitute professional advice. You should always consult qualified professionals before making decisions based on information found here. We are not liable for any decisions or actions taken based on the content provided.",
    ],
  },
  {
    title: "9. Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, Daily Developer Insights, its authors, contributors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of profits, data, or other intangible losses — arising out of or in connection with your use of (or inability to use) the Website, even if we have been advised of the possibility of such damages.",
      "In no event shall our total liability exceed the amount you have paid to us (if any) for accessing the Website in the twelve (12) months preceding the claim.",
    ],
  },
  {
    title: "10. Indemnification",
    content: [
      "You agree to indemnify, defend, and hold harmless Daily Developer Insights, its authors, contributors, and affiliates from and against any and all claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising out of or in connection with your use of the Website, your violation of these Terms of Service, or your violation of any rights of a third party.",
    ],
  },
  {
    title: "11. Governing Law",
    content: [
      "These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Daily Developer Insights operates, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the competent courts of that jurisdiction.",
    ],
  },
  {
    title: "12. Severability",
    content: [
      "If any provision of these Terms of Service is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.",
    ],
  },
  {
    title: "13. Contact Us",
    content: [
      "If you have any questions or concerns about these Terms of Service, please contact us at:",
      "Email: contact@dailydeveloperinsights.tech",
    ],
  },
];

export default function TermsOfServicePage() {
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
          Terms of Service
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
          Welcome to <strong className="text-foreground">Daily Developer Insights</strong>.
          Please read these Terms of Service carefully before using our website.
          These terms govern your access to and use of the Website and all
          content, services, and features available through it.
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
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
