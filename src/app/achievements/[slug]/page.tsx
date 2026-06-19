"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Award, Users, Calendar, MapPin } from "lucide-react";

interface TeamMember {
  name: string;
  role?: string;
}

interface PressMention {
  title: string;
  source: string;
  url: string;
  date: string;
}

interface AchievementArticle {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  caseId: string;
  prize: string;
  teamName: string;
  team: TeamMember[];
  problemStatement: string;
  problemDetail: string;
  approach: string;
  impact: string;
  tech: string[];
  pressMentions: PressMention[];
  relatedDemo?: string;
  eventContext: string;
  heroImage: string;
  gallery: { src: string; alt: string }[];
}

const ARTICLES: AchievementArticle[] = [
  {
    slug: "ps-02-radiology",
    badge: "Runner-up - 2nd Place",
    title: "Radiological Image-Based Condition Detection and Report Correlation",
    subtitle: "NHA Hackathon - Problem Statement 2",
    date: "9 May 2026",
    venue: "IISc Bengaluru",
    caseId: "PS-02",
    prize: "Rs. 3,00,000",
    teamName: "Kantaka Sodhana",
    team: [],
    problemStatement:
      "Healthcare insurance fraud in India often involves mismatches between radiological images (X-rays, CT scans, MRI) and the textual diagnostic reports accompanying insurance claims. Fraudulent actors submit radiology reports that do not correspond to the actual images, inflating conditions or fabricating findings to claim higher reimbursements under AB PM-JAY.",
    problemDetail:
      "The National Health Authority posed a challenge: build an AI system capable of reading radiological images, detecting medical conditions present in them, and cross-correlating those findings with the accompanying textual reports. The system needed to flag discrepancies where a report claims a condition that the image does not support, or where image findings are omitted from the report to hide certain patterns.",
    approach:
      "Team Kantaka Sodhana built an end-to-end AI pipeline combining computer vision models for radiological image analysis with Natural Language Processing for report parsing. The system extracts condition indicators from medical images using deep learning models trained on radiology datasets, then parses the associated discharge summaries and diagnostic reports to verify consistency. An anomaly scoring engine compares both outputs and flags claims where the image evidence and text narrative diverge beyond a confidence threshold. The pipeline was designed for scale, capable of processing thousands of claims daily with minimal manual intervention.",
    impact:
      "The solution demonstrated the ability to surface fraud patterns that manual review would miss, particularly in high-volume claims processing environments. With AB PM-JAY processing approximately 50,000 claims daily across 1,900+ treatment packages, even a small percentage improvement in fraud detection translates to crores saved in public healthcare funds. The jury recognized the solution for its innovation, scalability, and direct applicability to real-world healthcare claims workflows.",
    tech: [
      "Computer Vision",
      "Deep Learning",
      "NLP",
      "Medical Imaging",
      "Anomaly Detection",
      "Python",
      "PyTorch",
      "FastAPI",
    ],
    pressMentions: [
      {
        title: "National Health Authority concludes AB PM-JAY Auto-Adjudication Hackathon Showcase 2026 at IISc Bengaluru",
        source: "Press Information Bureau (Government of India)",
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2259365",
        date: "9 May 2026",
      },
      {
        title: "NHA recognises innovators for developing AI systems for healthcare claims processing and fraud detection",
        source: "The Hindu",
        url: "https://www.thehindu.com/news/national/karnataka/nha-recognises-innovators-for-developing-ai-systems-for-healthcare-claims-processing-and-fraud-detection/article70958979.ece",
        date: "May 2026",
      },
      {
        title: "IndiaAI Mission and NHA Felicitate Winners of AB PM-JAY Auto-Adjudication Hackathon Showcase 2026",
        source: "Ease My Prep",
        url: "https://easemyprep.in/news/1092-indiaai-mission-and-nha-felicitate-winners-of-ab-pm-jay-auto-adjudication-hackat",
        date: "13 May 2026",
      },
    ],
    relatedDemo: "/demo/uc-medai",
    eventContext:
      "The AB PM-JAY Auto-Adjudication Hackathon was organized by the National Health Authority in collaboration with IndiaAI Mission (under MeitY) and the Indian Institute of Science, Bengaluru. Over 3,500 participants registered nationwide, with solutions evaluated by an expert jury from government, academia, healthcare, and technology institutions. The hackathon addressed three critical problem statements aimed at strengthening speed, transparency, accuracy, and programme integrity in health claims adjudication under Ayushman Bharat PM-JAY, the world's largest publicly funded health insurance scheme.",
    heroImage:
      "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/ps2-ceremony.jpg",
    gallery: [
      {
        src: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/teams-group.jpg",
        alt: "All winning teams with cheques at IISc Bengaluru",
      },
      {
        src: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/andhra-prabha-clipping.jpg",
        alt: "Andhra Prabha newspaper coverage - Telugu engineers shine at NHA Hackathon",
      },
    ],
  },
  {
    slug: "ps-03-document-forgery",
    badge: "3rd Place",
    title: "Document Forgery and Deepfake Detection",
    subtitle: "NHA Hackathon - Problem Statement 3",
    date: "9 May 2026",
    venue: "IISc Bengaluru",
    caseId: "PS-03",
    prize: "Rs. 2,00,000",
    teamName: "Sushurutha Health AI",
    team: [],
    problemStatement:
      "The healthcare insurance ecosystem faces an increasing threat from forged and manipulated medical documents, including tampered discharge summaries, manipulated bills, fabricated prescriptions, and even deepfake-generated identity documents. These fraudulent documents are submitted as part of insurance claims to extract illegitimate reimbursements from public health programmes.",
    problemDetail:
      "The National Health Authority challenged participants to build AI-driven systems capable of detecting document forgery and deepfakes within healthcare claims pipelines. The system needed to identify tampered discharge summaries, manipulated billing documents, ghost identities created through deepfake technology, and other forms of document manipulation used to defraud AB PM-JAY.",
    approach:
      "Team Sushurutha Health AI developed a multi-layered AI/ML-based fraud detection system. The solution combines document forensic analysis, examining pixel-level inconsistencies, metadata anomalies, and font/layout irregularities, with deep learning models trained to detect manipulated images and deepfake-generated content. The system uses SHA-256 hash verification for document integrity checks, OCR-based text extraction for cross-referencing claim details, and anomaly scoring to prioritize suspicious documents for human review. The pipeline was designed to integrate directly into existing claims processing workflows with minimal disruption.",
    impact:
      "The solution addresses one of the most pressing challenges in public healthcare: programme leakage through document fraud. By automating the detection of forged documents, the system reduces the manual burden on claims reviewers while catching sophisticated fraud that would otherwise slip through. The jury recognized the solution for its practical approach to AI/ML-based healthcare insurance fraud detection.",
    tech: [
      "Computer Vision",
      "Deep Learning",
      "OCR",
      "Document Forensics",
      "SHA-256",
      "Deepfake Detection",
      "Python",
      "TensorFlow",
    ],
    pressMentions: [
      {
        title: "National Health Authority concludes AB PM-JAY Auto-Adjudication Hackathon Showcase 2026 at IISc Bengaluru",
        source: "Press Information Bureau (Government of India)",
        url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2259365",
        date: "9 May 2026",
      },
      {
        title: "NHA recognises innovators for developing AI systems for healthcare claims processing and fraud detection",
        source: "The Hindu",
        url: "https://www.thehindu.com/news/national/karnataka/nha-recognises-innovators-for-developing-ai-systems-for-healthcare-claims-processing-and-fraud-detection/article70958979.ece",
        date: "May 2026",
      },
      {
        title: "IndiaAI Mission and NHA Felicitate Winners of AB PM-JAY Auto-Adjudication Hackathon Showcase 2026",
        source: "Ease My Prep",
        url: "https://easemyprep.in/news/1092-indiaai-mission-and-nha-felicitate-winners-of-ab-pm-jay-auto-adjudication-hackat",
        date: "13 May 2026",
      },
    ],
    relatedDemo: "/demo/uc-docforgery",
    eventContext:
      "The AB PM-JAY Auto-Adjudication Hackathon was organized by the National Health Authority in collaboration with IndiaAI Mission (under MeitY) and the Indian Institute of Science, Bengaluru. Over 3,500 participants registered nationwide, with solutions evaluated by an expert jury from government, academia, healthcare, and technology institutions. The hackathon addressed three critical problem statements aimed at strengthening speed, transparency, accuracy, and programme integrity in health claims adjudication under Ayushman Bharat PM-JAY, the world's largest publicly funded health insurance scheme.",
    heroImage:
      "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/ps3-ceremony.jpg",
    gallery: [
      {
        src: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/teams-group.jpg",
        alt: "All winning teams with cheques at IISc Bengaluru",
      },
      {
        src: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/andhra-prabha-clipping.jpg",
        alt: "Andhra Prabha newspaper coverage - Telugu engineers shine at NHA Hackathon",
      },
    ],
  },
];

export default function AchievementArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-4">
            Article Not Found
          </h1>
          <Link
            href="/achievements"
            className="px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-[0.2em] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition"
          >
            Return to Achievements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent)] mb-8 transition"
          >
            <ArrowLeft size={14} />
            Back to Achievements
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5">
                <Award size={14} className="text-[var(--accent)]" />
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--accent)]">
                  {article.badge}
                </span>
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)]">
                {article.caseId}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-[var(--text)] leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-[var(--text-muted)] font-mono mb-8">
              {article.subtitle}
            </p>

            <div className="flex flex-wrap gap-6 font-mono text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <Calendar size={14} className="text-[var(--accent)]" />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-[var(--accent)]" />
                {article.venue}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users size={14} className="text-[var(--accent)]" />
                Team {article.teamName}
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {article.heroImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-5xl mx-auto px-6 -mb-4 mt-12"
        >
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
            <Image
              src={article.heroImage}
              alt={`${article.teamName} receiving the award at ${article.venue}`}
              width={1280}
              height={720}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Team {article.teamName} - Felicitation Ceremony - {article.venue}
          </p>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            The Event
          </p>
          <p className="text-base leading-relaxed text-[var(--text)]">
            {article.eventContext}
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
            The Problem
          </p>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-[var(--text)]">
              {article.problemStatement}
            </p>
            <p className="text-base leading-relaxed text-[var(--text)]">
              {article.problemDetail}
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
            Our Approach
          </p>
          <p className="text-base leading-relaxed text-[var(--text)]">
            {article.approach}
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            Results and Impact
          </p>
          <p className="text-base leading-relaxed text-[var(--text)] mb-6">
            {article.impact}
          </p>
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2">
            <Award size={16} className="text-[var(--accent)]" />
            <span className="font-mono text-sm text-[var(--accent)] font-bold">
              Prize: {article.prize}
            </span>
          </div>
        </motion.section>

        {article.team.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
              The Team - {article.teamName}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {article.team.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
                >
                  <p className="font-bold text-[var(--text)] mb-1">
                    {member.name}
                  </p>
                  {member.role && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {member.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
            Technology Stack
          </p>
          <div className="flex flex-wrap gap-3">
            {article.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] bg-[var(--surface)] hover:border-[var(--accent)] transition"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.section>

        {article.gallery.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
              Gallery
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.gallery.map((img) => (
                <div
                  key={img.src}
                  className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface)]"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={640}
                    height={420}
                    className="w-full h-auto object-cover"
                  />
                  <p className="px-4 py-3 font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)]">
                    {img.alt}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
            Press and Media Mentions
          </p>
          <div className="space-y-4">
            {article.pressMentions.map((mention) => (
              <a
                key={mention.url}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--accent)]/50 transition group"
              >
                <ExternalLink
                  size={18}
                  className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition mt-0.5 shrink-0"
                />
                <div>
                  <p className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition mb-1 leading-snug">
                    {mention.title}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {mention.source} - {mention.date}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </motion.section>

        {article.relatedDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"
          >
            <p className="text-[var(--text-muted)] mb-4 font-mono text-sm">
              See this solution in action
            </p>
            <Link
              href={article.relatedDemo}
              className="inline-block px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-white transition"
            >
              Watch Demo
            </Link>
          </motion.div>
        )}

        <div className="text-center border-t border-[var(--border)] pt-12">
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--text-muted)]">
            Kantaka Sodhana - Recognition Log - {article.caseId}
          </p>
        </div>
      </div>
    </article>
  );
}
