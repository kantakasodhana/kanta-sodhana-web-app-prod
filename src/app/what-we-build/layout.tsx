import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Build",
  description:
    "The technology stack behind Kantaka Śodhana — Kafka, Airflow, PyTorch, MLflow, BentoML, KServe, and Kubernetes powering real-time fraud detection.",
  openGraph: {
    title: "What We Build | Kantaka Śodhana",
    description:
      "The technology stack behind Kantaka Śodhana — real-time fraud detection infrastructure.",
  },
};

export default function WhatWeBuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
