"use client";

import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ExternalLink, Award } from "lucide-react";
import CountUp from "@/components/CountUp";
import ProtectedSection from "@/components/ProtectedSection";

const DEMOS = [
  {
    id: "uc-rs",
    caseId: "KS-RS-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Insurance Claim Risk Scoring",
    tagline: "Live XGBoost + SHAP fraud detection dashboard",
    description: "Healthcare insurance claims face constant fraud from inflated bills, phantom procedures, and collusion between providers and patients. Manual review cannot scale to millions of claims processed daily. Our solution leverages an XGBoost ensemble model with Platt scaling calibrated to 99.7% AUC. Real-time risk scoring via FastAPI delivers predictions under 100ms per claim with complete SHAP explainability—every flagged claim includes detailed reasoning. Hospital ranking by fraud exposure enables proactive auditing and compliance monitoring.",
    impact: [
      { label: "AUC Score", value: "99.7%" },
      { label: "Latency", value: "<100ms" },
      { label: "Claims Scored", value: "10M+" },
      { label: "Fraud Caught", value: "$42M" },
    ],
    tech: ["XGBoost", "FastAPI", "SHAP", "Recharts", "Platt Scaling"],
    video: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/risk-scoring.mp4",
    demoUrl: "https://risk-scoring.streamlit.app/",
  },
  {
    id: "uc-docforgery",
    caseId: "KS-DF-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Document Forgery Detection",
    tagline: "4-engine forensic pipeline for PM-JAY claim authentication",
    description: "PM-JAY claim fraud includes forged discharge summaries, tampered bills, and spliced documents from multiple patients. Manual review misses sophisticated digital forgeries created with modern editing tools. Our 4-engine forensic pipeline independently analyzes each document: C1 detects copy-paste regions via DCT + ORB keypoint matching, C3 identifies fake stamps and signatures, C4 analyzes erasure patterns across 5 signal dimensions, C5 detects content merging using Error Level Analysis. Each engine votes on the final forensic classification—no single point of failure.",
    impact: [
      { label: "Detection Types", value: "4" },
      { label: "Engines", value: "C1–C5" },
      { label: "False Positive", value: "<8%" },
      { label: "Processing", value: "<3s" },
    ],
    tech: ["OpenCV", "scikit-image", "DCT", "ORB", "ELA", "FastAPI"],
    video: "",
  },
  {
    id: "uc-clinical",
    caseId: "KS-PS1-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Clinical Document Classifier",
    tagline: "NHA PS1 multi-package claim document classification",
    description: "AB PM-JAY claim adjudication requires classifying hundreds of document types per claim package—discharge summaries, lab reports, operative notes, implant invoices, consent forms. Manual classification is slow and error-prone. Our hybrid pipeline combines filename pattern matching with Gemma 3 12B vision-language inference. For each document page, the system assigns clinical document type, medical rank, and STG compliance flags. Outputs are validated and ranked per package code (MG064A, SG039C, MG006A, SB039A). Downstream systems receive clean, structured JSON ready for adjudication.",
    impact: [
      { label: "Packages", value: "4" },
      { label: "Doc Types", value: "32" },
      { label: "Pages", value: "1,200+" },
      { label: "Accuracy", value: "94%" },
    ],
    tech: ["Gemma 3 12B", "PyMuPDF", "NHA Client", "Python", "JSON"],
    video: "",
  },
  {
    id: "uc-dupcheck",
    caseId: "KS-DT-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Duplication & Tampering Detection",
    tagline: "SHA-256, pHash, and pixel-level tampering analysis",
    description: "Fraudsters reuse the same medical images across multiple claims or digitally tamper with discharge summaries and lab reports to alter patient details, dates, or values. Generic image comparison fails on compressed JPEG artifacts and minor edits. Our three-layer detection system provides defense in depth: Layer 1 computes SHA-256 hash of raw image bytes for exact duplicate matching, Layer 2 uses perceptual hashing (pHash) to find visual duplicates across JPEG quality loss, Layer 3 performs pixel-level SSIM difference analysis combined with contour region mapping to pinpoint tampering locations. Each layer operates independently; anomalies trigger investigation workflows.",
    impact: [
      { label: "Hash Match", value: "SHA-256" },
      { label: "Similarity", value: "pHash" },
      { label: "Tamper Detection", value: "SSIM" },
      { label: "Speed", value: "<2s" },
    ],
    tech: ["OpenCV", "imagehash", "scikit-image", "FastAPI", "SSIM"],
    video: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/duplication-tampering.mp4",
    demoUrl: "https://duplication-and-tampering.streamlit.app/",
  },
  {
    id: "uc-qrverify",
    caseId: "KS-QR-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Death Certificate QR Verification",
    tagline: "QR decode, registry cross-reference, OCR field matching",
    description: "Fraudulent PM-JAY claims exploit forged or stolen death certificates to claim beneficiary payouts. Fake QR codes either don't exist in government registries or point to different beneficiaries. Our verification pipeline: (1) pyzbar decodes the QR code from document image, (2) requests library scrapes the official state registry portal using decoded credentials, (3) Tesseract OCR extracts text fields from certificate (name, date, certificate number), (4) fuzzy field matching compares OCR results against registry data to flag discrepancies. High-confidence matches clear the claim; mismatches trigger manual review.",
    impact: [
      { label: "QR Decode", value: "pyzbar" },
      { label: "OCR", value: "Tesseract" },
      { label: "Registry Scrape", value: "BeautifulSoup" },
      { label: "Field Match", value: "Fuzzy" },
    ],
    tech: ["pyzbar", "Tesseract", "BeautifulSoup", "FastAPI", "OpenCV"],
    video: "",
  },
  {
    id: "uc-sameday",
    caseId: "KS-SD-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Same-Day Admission Fraud Detection",
    tagline: "Temporal pattern analysis for admission/discharge abuse",
    description: "Fraudulent PM-JAY claims exploit same-day admission loops—patient admitted and discharged on the same date to inflate claim counts without genuine medical need. Repeated same-day admissions across the same hospital raise suspicion; patterns across multiple hospitals and networks suggest organized rings. Our pipeline accepts CSV claim data, computes the Is_Same_Day flag by comparing admission and discharge timestamps, calculates hospital-level fraud rates, identifies temporal admission clusters (e.g., multiple same-day admits in a 24-hour window), and flags repeat offenders. Risk scores are assigned per claim and per provider.",
    impact: [
      { label: "Fraud Patterns", value: "4" },
      { label: "Risk Signals", value: "5" },
      { label: "Analysis", value: "Real-time" },
      { label: "Export Format", value: "CSV" },
    ],
    tech: ["Next.js", "PapaParse", "Recharts", "TypeScript"],
    video: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/same-day-admission.mp4",
    demoUrl: "https://same-day-admission-discharge-tks.streamlit.app/",
  },
  {
    id: "uc-family",
    caseId: "KS-FC-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Family Cluster Fraud Ring Detection",
    tagline: "Coordinated diagnosis patterns and timing cluster analysis",
    description: "Fraud rings exploit family benefit cards by submitting coordinated high-value claims (heart attacks, strokes, emergency surgeries) across family members within narrow time windows. Detection requires understanding both claim patterns and timing relationships. Our system identifies three red flags: (1) Multiple high-risk diagnoses (ICU-level) within a 48-hour family window, (2) Excess unique diagnoses per family (beyond realistic medical conditions), (3) Mixed-diagnosis clusters (heart + liver + stroke in siblings) that defy natural disease incidence. Each flag is scored; clusters exceeding thresholds are flagged as suspicious or warning level.",
    impact: [
      { label: "Pattern Types", value: "3" },
      { label: "Monitored Diagnoses", value: "15+" },
      { label: "Detection Mode", value: "Real-time" },
      { label: "Cluster Scoring", value: "Automated" },
    ],
    tech: ["Next.js", "PapaParse", "Recharts", "TypeScript"],
    video: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/family-cluster.mp4",
    demoUrl: "https://family-cluster-tks.streamlit.app/",
  },
  {
    id: "uc-medoo",
    caseId: "KS-MD-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Medical Consultation AI Platform",
    tagline: "Intelligent symptom analysis and clinical guidance",
    description: "Patients lack immediate access to reliable medical guidance between appointments, leading to delayed diagnoses and unnecessary emergency room visits. Clinicians need faster triage tools to prioritize critical cases. Our conversational AI platform is built on Next.js with Supabase backend, providing real-time symptom analysis, consultation history tracking, and intelligent clinical decision support. The system guides patients through symptom assessment, suggests preliminary conditions, and recommends action (monitor, urgent care, emergency). Over 25,000 successful consultations with 91.4% accuracy and 4.8-star user ratings demonstrate clinical reliability.",
    impact: [
      { label: "Total Consultations", value: "25K+" },
      { label: "Response Time", value: "<2s" },
      { label: "Accuracy Rate", value: "91.4%" },
      { label: "User Rating", value: "4.8★" },
    ],
    tech: ["Next.js", "Supabase", "OpenAI", "TypeScript", "Tailwind"],
    video: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/medoo-consultation.mp4",
  },
  {
    id: "uc-medai",
    caseId: "KS-MA-001",
    sector: "Healthcare",
    status: "DEPLOYED",
    title: "Medical Claim AI Adjudication",
    tagline: "Dual-model pipeline: image analysis + report verification",
    description: "India's PM-JAY program processes millions of health claims annually, but doctors cannot manually verify every angiogram, X-ray, lab result, and written report for fraud and clinical accuracy. Bottlenecks delay claims; fraudsters exploit slow review cycles. Our two-model pipeline runs in parallel: MedGemma 4B extracts structured clinical findings from medical images (reads radiology reports embedded in images), Gemma 3 4B cross-checks written reports against image findings to detect mismatches. A rules engine validates STG compliance and flags fraud patterns (phantom procedures, incorrect diagnoses). The system processes 50K+ claims monthly with 94.2% accuracy and 10× faster review speed.",
    impact: [
      { label: "Claims/Month", value: "50K+" },
      { label: "Accuracy", value: "94.2%" },
      { label: "Review Speed", value: "10× faster" },
      { label: "Fraud Detection", value: "12%" },
    ],
    tech: ["Flask", "MedGemma", "Gemma 3", "Ollama", "SQLite", "OpenCV"],
    video: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/medai-adjudication.mp4",
  },
  {
    id: "uc-whatsapp-face",
    caseId: "KS-WF-001",
    sector: "Identity",
    status: "DEPLOYED",
    title: "WhatsApp Face Verification",
    tagline: "Liveness detection + Aadhaar photo matching",
    description: "Ghost beneficiaries and proxy claimants exploit PM-JAY by registering with stolen identity documents or impersonating eligible beneficiaries. Manual verification at hospitals is slow and easily bypassed by sophisticated fraudsters. Our WhatsApp-native verification system requires zero app installation—beneficiaries verify via WhatsApp using built-in camera. The system performs real-time liveness detection using MediaPipe facial landmarks and anti-spoofing models to prevent presentation attacks (printed photos, deepfakes). The live selfie is compared against Aadhaar photo database with confidence scoring. Liveness accuracy reaches 99.1%; spoof attempts are blocked.",
    impact: [
      { label: "Liveness Accuracy", value: "99.1%" },
      { label: "Spoof Block Rate", value: "100%" },
      { label: "Verification Time", value: "<5s" },
      { label: "App Install", value: "Zero" },
    ],
    tech: ["WhatsApp API", "MediaPipe", "Face Recognition", "FastAPI", "OpenCV"],
    video: "https://kjadudctpnweailiaeor.supabase.co/storage/v1/object/public/demos/face-verification.mp4",
  },
  {
    id: "uc-resume",
    caseId: "KS-RP-001",
    sector: "Healthcare",
    status: "PILOT",
    title: "Resume & Document Parser",
    tagline: "Multimodal AI for structured data extraction",
    description: "Healthcare organizations spend thousands of hours manually digitizing paper records, resumes, and claim forms. Generic OCR fails on handwritten documents, multi-column layouts, tables, and stamps. Our vision-language model pipeline extracts structured fields from any document layout: handwritten text is recognized accurately, stamps and signatures are detected, tables are parsed into JSON, mixed formats (text + images) are unified. The system outputs clean, validated JSON ready for downstream systems (databases, workflow engines). Achieves 96.8% accuracy across 15+ document formats, processing at 3 seconds per document, reducing manual work by 90%.",
    impact: [
      { label: "Extraction Accuracy", value: "96.8%" },
      { label: "Processing Speed", value: "3s/doc" },
      { label: "Document Formats", value: "15+" },
      { label: "Manual Work Saved", value: "90%" },
    ],
    tech: ["Gemma 3", "PaddleOCR", "FastAPI", "PyMuPDF", "Tesseract"],
    video: "",
  },
];

const DEMO_TO_ACHIEVEMENT: Record<string, { slug: string; label: string }> = {
  "uc-medai": { slug: "ps-02-radiology", label: "Runner-up — NHA Hackathon PS-02" },
  "uc-docforgery": { slug: "ps-03-document-forgery", label: "3rd Place — NHA Hackathon PS-03" },
};

const STATUS_COLORS: Record<string, string> = {
  DEPLOYED: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  RESOLVED: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  PILOT: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  INVESTIGATING: "border-[var(--accent)]/30 text-[var(--accent)] bg-[var(--accent)]/10",
};

export default function DemoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const demoId = params.id as string;
  const fromIndex = searchParams.get("from");
  const demo = DEMOS.find((d) => d.id === demoId);

  if (!demo) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-4">Dossier Not Found</h1>
          <Link href="/#use-cases" className="px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-[0.2em] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition">
            Return to Registry
          </Link>
        </div>
      </div>
    );
  }

  const hasVideo = demo.video && demo.video.trim() !== "";
  const backLink = fromIndex !== null ? `/#use-cases` : `/#use-cases`;

  return (
    <ProtectedSection title="DEMO ACCESS RESTRICTED">
      <div className="min-h-screen bg-[var(--bg)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <Link href={backLink} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent)] mb-6 transition">
              ← Return to Use Cases
            </Link>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--accent)] mb-3">{demo.caseId}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-3">{demo.title}</h1>
            <p className="text-lg text-[var(--text-muted)] font-mono">{demo.tagline}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
          {/* Metadata */}
          <div className="flex gap-3 flex-wrap">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {demo.sector}
            </span>
            <span className={`rounded-full border px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] ${STATUS_COLORS[demo.status]}`}>
              {demo.status}
            </span>
          </div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
          >
            <div className="bg-[var(--bg)] min-h-96 flex items-center justify-center">
              {hasVideo ? (
                <video src={demo.video} controls autoPlay className="w-full max-h-[600px]" />
              ) : (
                <div className="text-center py-24">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--accent)]/30 bg-[var(--accent)]/10 mx-auto"
                  >
                    <Play size={40} className="text-[var(--accent)] ml-1" />
                  </motion.div>
                  <p className="text-[var(--text)] font-bold mb-2 text-lg">Video Coming Soon</p>
                  <p className="text-[var(--text-muted)] text-sm font-mono">Demo walkthrough will be published shortly</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Try Live Demo */}
          {demo.demoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex justify-center"
            >
              <a
                href={demo.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--accent)] text-white font-mono text-xs uppercase tracking-[0.2em] hover:brightness-110 hover:scale-105 transition-all duration-300 shadow-lg shadow-[var(--accent)]/20"
              >
                <ExternalLink size={16} />
                Try Live Demo
              </a>
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-10"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4">Overview</p>
            <p className="text-base leading-relaxed text-[var(--text)]">
              {demo.description}
            </p>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">Impact Metrics</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {demo.impact.map((m) => (
                <div key={m.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                  <div className="text-3xl font-bold text-[var(--accent)] mb-2">
                    <CountUp value={m.value} />
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-6">Technology Stack</p>
            <div className="flex flex-wrap gap-3">
              {demo.tech.map((t) => (
                <span key={t} className="rounded-full border border-[var(--border)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] bg-[var(--surface)] hover:border-[var(--accent)] transition">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Related Achievement */}
          {DEMO_TO_ACHIEVEMENT[demo.id] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                href={`/achievements/${DEMO_TO_ACHIEVEMENT[demo.id].slug}`}
                className="flex items-center gap-4 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-6 hover:border-[var(--accent)]/50 transition group"
              >
                <Award size={20} className="text-[var(--accent)] shrink-0" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] mb-1">Hackathon Achievement</p>
                  <p className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition">
                    {DEMO_TO_ACHIEVEMENT[demo.id].label}
                  </p>
                </div>
              </Link>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"
          >
            <p className="text-[var(--text-muted)] mb-4 font-mono text-sm">Interested in similar results?</p>
            <Link href="/#contact" className="inline-block px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-white transition">
              Initiate Contact
            </Link>
          </motion.div>
        </div>
      </div>
    </ProtectedSection>
  );
}
