"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, X, ChevronLeft, ChevronRight, Tag, ShoppingBag, ShieldCheck, Award } from "lucide-react";

interface ExpertVideo {
  title: string;
  doctor: string;
  role: string;
  thumbnail: string;
  videoUrl: string;
}

const EXPERTS: ExpertVideo[] = [
  {
    title: "Shilajit & Ashwagandha for Natural Stamina & Vigour",
    doctor: "Dr. Sharma, BAMS",
    role: "Senior Ayurvedic Practitioner (18+ Yrs Exp)",
    thumbnail: "https://heightveda.com/wp-content/uploads/2026/09/b1-1-1.webp",
    videoUrl: "https://github.com/HeightVeda/Expert-Video/raw/refs/heads/main/Height%20Veda%201.mp4",
  },
  {
    title: "Natural Glycemic Balance & Pancreatic Health",
    doctor: "Dr. Verma, MD (Ayurveda)",
    role: "Ayurvedic Physician & Metabolic Consultant",
    thumbnail: "https://heightveda.com/wp-content/uploads/2026/09/male-doctor-1.webp",
    videoUrl: "https://github.com/HeightVeda/Expert-Video/raw/refs/heads/main/Height%20Veda%203.mp4",
  },
  {
    title: "Micro-Vascular Blood Warmth & Topical Oil Therapy",
    doctor: "Vedant V.",
    role: "Ayurvedic Vitality Specialist",
    thumbnail: "https://heightveda.com/wp-content/uploads/2026/09/Height-Veda_Website-Thumbnail_05_12-Sep-2025-1.webp",
    videoUrl: "https://heightveda.com/wp-content/uploads/2026/09/Vedant-Height-Veda-Square-1.mp4",
  },
  {
    title: "Dietary Guidance for Blood Sugar Stabilization",
    doctor: "Nikita S.",
    role: "Clinical Ayurvedic Nutritionist",
    thumbnail: "https://heightveda.com/wp-content/uploads/2026/09/Height-Veda_Website-Thumbnail3-1.webp",
    videoUrl: "https://heightveda.com/wp-content/uploads/2026/09/Nikita-Normal-1.mp4",
  },
  {
    title: "Patient Recovery & Safety Evaluation",
    doctor: "Nidhi Deolekar",
    role: "Holistic Ayurvedic Health Advisor",
    thumbnail: "https://heightveda.com/wp-content/uploads/2026/09/Height-Veda_Website-Thumbnail2-1.webp",
    videoUrl: "https://heightveda.com/wp-content/uploads/2026/09/Nidhi-Deolekar-Reel-In-Square-Format1-1.mp4",
  },
];

export function ExpertsView() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const prev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const next = () => {
    setStartIndex((prev) => Math.min(EXPERTS.length - 3, prev + 1));
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white border-b border-gray-100" id="expertview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 border border-emerald-300">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Herbal Insights &amp; Expert Opinions</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
            Ayurvedic Experts <span className="text-gradient-green">Viewpoint</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-2 font-medium">
            Watch verified Ayurvedic wellness specialists explain the science behind Leafora Herbal Private Limited&apos;s natural formulations.
          </p>
        </div>

        {/* Video Slider */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPERTS.slice(startIndex, startIndex + 3).map((expert, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video sm:aspect-square w-full overflow-hidden bg-black/5">
                  <img
                    src={expert.thumbnail}
                    alt={expert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x600/0f3d23/ffffff?text=Doctor+Interview";
                    }}
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setActiveVideo(expert.videoUrl)}
                    className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer"
                    aria-label={`Play ${expert.title}`}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#d4af37] text-gray-950 flex items-center justify-center shadow-xl ring-4 ring-white/30">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </button>

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold border border-emerald-800">
                    Verified BAMS Doctor
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="text-base font-black text-gray-900 group-hover:text-emerald-800 transition line-clamp-2 mb-1.5">
                      {expert.title}
                    </h3>
                    <p className="text-xs font-bold text-emerald-900">{expert.doctor}</p>
                    <p className="text-[11px] text-gray-500">{expert.role}</p>
                  </div>

                  <button
                    onClick={() => setActiveVideo(expert.videoUrl)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Full Interview</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          {EXPERTS.length > 3 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                disabled={startIndex === 0}
                className="p-3 rounded-full bg-white border border-gray-300 text-gray-800 hover:bg-emerald-50 disabled:opacity-30 transition shadow-sm cursor-pointer"
                aria-label="Previous expert"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                disabled={startIndex >= EXPERTS.length - 3}
                className="p-3 rounded-full bg-white border border-gray-300 text-gray-800 hover:bg-emerald-50 disabled:opacity-30 transition shadow-sm cursor-pointer"
                aria-label="Next expert"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Video Lightbox Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition cursor-pointer"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>
              <video src={activeVideo} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
