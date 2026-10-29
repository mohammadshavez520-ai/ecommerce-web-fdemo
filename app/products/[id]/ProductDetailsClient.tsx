"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Check,
  X,
  HelpCircle,
  BadgeCheck,
  Leaf,
  Sprout,
  Zap,
  SunMedium,
  TreePine,
  Shield,
  Flower2,
  Activity,
  Flame,
  Mountain,
  Brain,
  Compass,
  Heart,
  Dumbbell,
  Droplets,
  Moon,
  TrendingUp,
  Layers,
  Minus,
  Plus,
  CreditCard,
  CalendarCheck,
} from "lucide-react";
import { Product } from "@/lib/types";
import { RichMarkdownView } from "@/components/admin/RichMarkdownView";

interface ProductDetailsClientProps {
  product: Product;
  allProducts: Product[];
}

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  likes: number;
}

interface HerbItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  name: string;
  amount: string;
  purpose: string;
  color: string;
  bgColor: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Neha Joshi",
    rating: 5.0,
    date: "19 August 2025",
    comment:
      "Maine Leafora Herbal formulation ko 45 din tak regular use kiya, meri stamina aur energy level me visible improvement dikhi. Pure Ayurvedic product hai without any side effects.",
    verified: true,
    likes: 48,
  },
  {
    id: "rev-2",
    name: "Karan Patel",
    rating: 5.0,
    date: "2 September 2025",
    comment:
      "After 2 months of following the morning scoop and capsules routine along with morning stretching, I noticed significant posture improvement and a visible height difference. Zero side effects.",
    verified: true,
    likes: 36,
  },
  {
    id: "rev-3",
    name: "Aman Verma",
    rating: 4.8,
    date: "12 September 2025",
    comment:
      "2 mahine ke regular use ke baad mujhe body structure aur spine posture me visible difference dikha. Bilkul genuine product hai aur delivery bhi timely aayi thi.",
    verified: true,
    likes: 52,
  },
  {
    id: "rev-4",
    name: "Rohit Sharma",
    rating: 5.0,
    date: "28 September 2025",
    comment:
      "Best Ayurvedic growth formulation. Clean ingredients list, easy to consume daily with warm milk, and saw steady progress in 60 days.",
    verified: true,
    likes: 29,
  },
  {
    id: "rev-5",
    name: "Priya Singh",
    rating: 4.9,
    date: "5 October 2025",
    comment:
      "Ordered with Cash on Delivery, delivered in 3 days with tamper-proof packaging. Natural taste and works gently without any heat or discomfort.",
    verified: true,
    likes: 19,
  },
];

const STANDARD_HERBS: HerbItem[] = [
  {
    icon: Leaf,
    name: "Ashwagandha",
    amount: "Withania Somnifera · 250mg",
    purpose: "Promotes deep restorative sleep and supports natural growth hormone secretion.",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50/90 border-emerald-200/90",
  },
  {
    icon: Sprout,
    name: "Shatavari",
    amount: "Asparagus Racemosus · 150mg",
    purpose: "Deeply nourishes bone tissues, cartilage flexibility, and physical vitality.",
    color: "text-green-700",
    bgColor: "bg-green-50/90 border-green-200/90",
  },
  {
    icon: Zap,
    name: "Safed Musli",
    amount: "Chlorophytum Borivilianum · 120mg",
    purpose: "Enhances joint lubrication, muscular stamina, and overall physical tone.",
    color: "text-amber-700",
    bgColor: "bg-amber-50/90 border-amber-200/90",
  },
  {
    icon: SunMedium,
    name: "Amla (Vitamin C)",
    amount: "Phyllanthus Emblica · 100mg",
    purpose: "Rich natural Vitamin C that enhances collagen formation and calcium absorption.",
    color: "text-amber-600",
    bgColor: "bg-amber-50/90 border-amber-200/90",
  },
  {
    icon: TreePine,
    name: "Moringa Leaf",
    amount: "Moringa Oleifera · 100mg",
    purpose: "Plant-derived bioavailable calcium matrix that strengthens bone density.",
    color: "text-teal-700",
    bgColor: "bg-teal-50/90 border-teal-200/90",
  },
  {
    icon: Shield,
    name: "Hadjod Bone Fortifier",
    amount: "Cissus Quadrangularis · 100mg",
    purpose: "Classical bone-building herb that accelerates natural bone mineralization.",
    color: "text-emerald-800",
    bgColor: "bg-emerald-50/90 border-emerald-200/90",
  },
  {
    icon: Flower2,
    name: "Tulsi (Holy Basil)",
    amount: "Ocimum Sanctum · 80mg",
    purpose: "Purifying adaptogen supporting cellular health, detox, and stamina.",
    color: "text-green-800",
    bgColor: "bg-green-50/90 border-green-200/90",
  },
  {
    icon: Activity,
    name: "Vidarikand Tuber",
    amount: "Pueraria Tuberosa · 100mg",
    purpose: "Nutrient-rich botanical supporting healthy muscle mass and body growth.",
    color: "text-purple-700",
    bgColor: "bg-purple-50/90 border-purple-200/90",
  },
  {
    icon: Flame,
    name: "Gokhru Extract",
    amount: "Tribulus Terrestris · 100mg",
    purpose: "Supports physical vitality, metabolic balance, and bone endurance.",
    color: "text-orange-700",
    bgColor: "bg-orange-50/90 border-orange-200/90",
  },
  {
    icon: Mountain,
    name: "Himalayan Shilajit",
    amount: "Purified Asphaltum · 75mg",
    purpose: "Fulvic mineral complex delivering 84+ essential trace minerals directly to cells.",
    color: "text-slate-700",
    bgColor: "bg-slate-100/90 border-slate-200/90",
  },
  {
    icon: Sparkles,
    name: "Kaunch Beej",
    amount: "Mucuna Pruriens · 80mg",
    purpose: "Natural source of L-Dopa supporting the pituitary gland and growth hormone release.",
    color: "text-amber-800",
    bgColor: "bg-amber-50/90 border-amber-200/90",
  },
  {
    icon: Brain,
    name: "Shankhpushpi",
    amount: "Convolvulus Pluricaulis · 60mg",
    purpose: "Calms mental stress for deeper REM sleep during which the body grows.",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50/90 border-indigo-200/90",
  },
  {
    icon: Compass,
    name: "Pippali (Bio-Catalyst)",
    amount: "Piper Longum · 50mg",
    purpose: "Ayurvedic bio-enhancer ensuring rapid and complete absorption of all herbs.",
    color: "text-red-700",
    bgColor: "bg-red-50/90 border-red-200/90",
  },
  {
    icon: Heart,
    name: "Yashtimadhu",
    amount: "Glycyrrhiza Glabra · 70mg",
    purpose: "Soothes digestion, protects stomach lining, and hydrates cellular tissues.",
    color: "text-rose-700",
    bgColor: "bg-rose-50/90 border-rose-200/90",
  },
  {
    icon: Dumbbell,
    name: "Bala Root",
    amount: "Sida Cordifolia · 80mg",
    purpose: "Classical Rasayana herb strengthening spinal muscles and skeletal frame.",
    color: "text-emerald-800",
    bgColor: "bg-emerald-50/90 border-emerald-200/90",
  },
];

const STANDARD_FAQS = [
  {
    q: "How long does it take to see visible height growth results?",
    a: "Most users begin noticing improved posture, flexibility, and physical energy within 3 to 4 weeks. For measurable height increases (typically 1 to 3 inches depending on age and biological responsiveness), consistent consumption for 60 to 90 days along with daily light stretching and 8 hours of sleep is recommended.",
  },
  {
    q: "Are there any side effects, steroids, or chemical additives?",
    a: "Zero side effects. Leafora Herbal formulations are 100% Ayurvedic, formulated with pure standardized herbs, and independently lab-tested. They are completely free from chemical steroids, synthetic hormones, heavy metals, or habit-forming substances.",
  },
  {
    q: "Are Leafora Herbal formulations safe for long-term daily use?",
    a: "Yes. All Leafora Herbal formulations are 100% classical Ayurvedic preparations made from pure herbs. They work synergistically with your body's natural metabolism and are completely non-habit forming.",
  },
  {
    q: "Is Cash on Delivery (COD) available with Free Shipping?",
    a: "Yes! We provide Free Pan-India Express Shipping on all orders. You can choose Cash on Delivery (COD) at checkout with zero extra fees, or pay online to enjoy an additional flat ₹400 instant prepaid discount.",
  },
  {
    q: "Do I need a prescription to order Leafora Herbal products?",
    a: "No prescription is required. Leafora Herbal formulations are authentic herbal health supplements and are completely safe for daily use.",
  },
  {
    q: "What daily routine should I follow for peak results?",
    a: "Take your morning scoop with warm milk or water, do 15 minutes of light spine stretching (hanging bar, Cobra pose, Surya Namaskar), drink 2.5–3 liters of water, and ensure 7–8 hours of sound nighttime sleep.",
  },
];

export function ProductDetailsClient({
  product,
  allProducts,
}: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image_url);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "dosage" | "reviews">("benefits");
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url].filter(Boolean);

  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: newReviewName.trim(),
      rating: newReviewRating,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      comment: newReviewComment.trim(),
      verified: true,
      likes: 1,
    };

    setReviews([newRev, ...reviews]);
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
    setIsWriteReviewOpen(false);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 4500);
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-24 md:pb-0">
      {/* Toast Notification */}
      {reviewSubmittedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16341f] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400 animate-in fade-in slide-in-from-bottom duration-300">
          <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">
            Thank you! Your verified review has been submitted.
          </span>
        </div>
      )}

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 bg-white p-4 sm:p-7 lg:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/90 items-start">
        {/* Left Column: Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-3.5 sm:space-y-4">
          {/* Main Selected Image Showcase */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-[#fcfbfa] via-white to-emerald-50/20 border border-gray-200/80 p-4 sm:p-7 flex items-center justify-center min-h-[260px] sm:min-h-[400px] shadow-inner group">
            {product.badge && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide text-white bg-gradient-to-r from-emerald-600 to-green-700 shadow-sm">
                {product.badge}
              </span>
            )}

            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{product.in_stock ? "In Stock" : "Out of Stock"}</span>
            </div>

            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-[250px] sm:max-h-[360px] w-auto object-contain drop-shadow-lg transition duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/400x400/eaf7f0/16341f?text=Height+Veda";
              }}
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative rounded-xl overflow-hidden p-1.5 bg-gray-50 border-2 transition aspect-square flex items-center justify-center cursor-pointer ${
                  selectedImage === img
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x100/eaf7f0/16341f?text=HV";
                  }}
                />
              </button>
            ))}
          </div>

          {/* Quick Trust Highlights with Premium Icon Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 sm:p-3 bg-emerald-50/50 rounded-xl sm:rounded-2xl border border-emerald-100 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200/90 flex items-center justify-center mb-1 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" strokeWidth={2.2} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-900 block leading-tight">Lab-Tested Purity</span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium block leading-tight mt-0.5 truncate">100% Herbal Formula</span>
            </div>

            <div className="p-2 sm:p-3 bg-emerald-50/50 rounded-xl sm:rounded-2xl border border-emerald-100 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200/90 flex items-center justify-center mb-1 shadow-2xs">
                <Truck className="w-4 h-4 text-emerald-700" strokeWidth={2.2} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-900 block leading-tight">Free Delivery</span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium block leading-tight mt-0.5 truncate">Pan-India Express</span>
            </div>

            <div className="p-2 sm:p-3 bg-emerald-50/50 rounded-xl sm:rounded-2xl border border-emerald-100 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-amber-100/90 text-amber-800 border border-amber-200/90 flex items-center justify-center mb-1 shadow-2xs">
                <Award className="w-4 h-4 text-amber-700" strokeWidth={2.2} />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-900 block leading-tight">Zero Side Effects</span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium block leading-tight mt-0.5 truncate">Safe for Ages 12–35</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Pricing, Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-3.5 sm:space-y-5">
          {/* Header Info */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{product.category || "Body Growth Supplement"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2 tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-emerald-800 mt-1">
              {product.tagline || "Ayurvedic Herbal Formula for Natural Height & Posture Support"}
            </p>

            {/* Ratings & Trust */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900 ml-1">4.9 / 5.0</span>
              </div>
              <span className="text-xs text-gray-500 font-normal">
                (10,000+ verified customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-green-50/40 border border-emerald-200/90 space-y-2">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#16341f]">
                ₹{product.price.toLocaleString("en-IN")}/-
              </span>
              <del className="text-sm sm:text-base font-medium text-gray-400">
                ₹{product.original_price.toLocaleString("en-IN")}/-
              </del>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-2xs">
                SAVE ₹{product.save_amount.toLocaleString("en-IN")}
                {product.discount_percent ? ` (${product.discount_percent}% OFF)` : ""}
              </span>
            </div>

            <div className="text-xs text-gray-600 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1">
              <span>MRP (Inclusive of all taxes) · Free Express Shipping</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-white px-2.5 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto shadow-2xs">
                <CreditCard className="w-3 h-3 text-emerald-600" />
                Flat ₹400 OFF on Prepaid
              </span>
            </div>
          </div>

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition flex items-center justify-center cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 text-xs font-bold text-gray-900 min-w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition flex items-center justify-center cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-gray-500 font-normal">
                (Total: ₹{(product.price * quantity).toLocaleString("en-IN")})
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Shiprocket Checkout trigger — opens fastrr 1-click checkout */}
              <button
                type="button"
                data-fastrr-buy
                data-product-id={product.id}
                data-variant-id={`${product.id}-default`}
                data-quantity={String(quantity)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#16341f] hover:bg-[#0f2415] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" strokeWidth={2.2} />
                <span>BUY NOW</span>
                <ArrowRight className="w-4 h-4 ml-0.5" strokeWidth={2.2} />
              </button>

              <a
                href="tel:+918630552164"
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-300 transition flex items-center justify-center gap-2 active:scale-98"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" strokeWidth={2.2} />
                <span>ORDER VIA CALL (+91 8630552164)</span>
              </a>
            </div>
          </div>

          {/* Quick Dispatch Banner */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/90 text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Express Dispatch: Orders placed now ship within 24 hours.</span>
            </div>
            <div className="flex items-center gap-2 font-normal text-gray-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Cash on Delivery (COD) available with zero extra charges.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Benefits, Ingredients, Dosage, Reviews */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-sm border border-gray-200/90 space-y-6">
        {/* Mobile Tab Chips / Desktop Navigation */}
        <div className="flex gap-2 sm:gap-6 overflow-x-auto pb-2 border-b border-gray-200 -mx-2 px-2 sm:mx-0 sm:px-0 no-scrollbar">
          {[
            { id: "benefits", label: "Key Benefits", icon: Activity },
            { id: "ingredients", label: "15 Super Herbs", icon: Leaf },
            { id: "dosage", label: "Daily Routine", icon: Clock },
            { id: "reviews", label: "Customer Reviews", icon: Star },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-[#16341f] text-white sm:bg-emerald-50 sm:text-emerald-900 sm:border-b-2 sm:border-emerald-700 shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 sm:bg-transparent sm:text-gray-500 sm:hover:text-gray-900 sm:border-b-2 sm:border-transparent"
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-300 sm:text-emerald-700" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Benefits */}
        {activeTab === "benefits" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Natural Body Growth Benefits
              </h3>
              <div className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                {product.description ? (
                  <RichMarkdownView content={product.description} />
                ) : (
                  <p>
                    Leafora Herbal products are formulated with concentrated Ayurvedic botanical extracts that work together to support vitality, endurance, and natural bodily equilibrium.
                  </p>
                )}
              </div>
            </div>

            {/* Rich Shopify-like Description Sections if configured */}
            {product.description_sections && product.description_sections.length > 0 && (
              <div className="space-y-4 pt-1">
                {product.description_sections.map((sec) => (
                  <div key={sec.id} className="space-y-2">
                    {sec.type === "heading" && sec.title && (
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 border-l-3 border-emerald-600 pl-3">
                        {sec.title}
                      </h4>
                    )}
                    {sec.type === "text" && sec.content && (
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 font-normal">
                        {sec.content}
                      </p>
                    )}
                    {sec.type === "callout" && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                        {sec.title && <h5 className="font-semibold text-xs sm:text-sm mb-1">{sec.title}</h5>}
                        {sec.content && <p className="text-xs text-emerald-900 leading-relaxed font-normal">{sec.content}</p>}
                      </div>
                    )}
                    {sec.type === "list" && sec.items && (
                      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                        {sec.title && <h5 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2">{sec.title}</h5>}
                        <ul className="space-y-1.5 text-xs text-gray-600 font-normal">
                          {sec.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {sec.type === "image" && sec.image_url && (
                      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white p-2">
                        <img
                          src={sec.image_url}
                          alt={sec.title || "Section Image"}
                          className="max-h-60 sm:max-h-72 w-full object-contain mx-auto"
                        />
                        {sec.title && (
                          <p className="text-xs text-center text-gray-500 mt-1 font-medium">{sec.title}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Standard Key Benefits & Growth Actions */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                6 Core Body Growth Actions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/90 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/90 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Brain className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-900">
                      Pituitary &amp; Growth Hormone Support
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5 font-normal leading-relaxed">
                      Supports natural growth hormone secretion and cell rejuvenation during deep nighttime sleep.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/90 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Layers className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-900">
                      Bone Mineralization &amp; Strength
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5 font-normal leading-relaxed">
                      Pure Hadjod and Moringa deliver bioavailable plant calcium directly to bones and joints.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/90 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Dumbbell className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-900">
                      Muscle Tone &amp; Cartilage Flexibility
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5 font-normal leading-relaxed">
                      Shatavari and Safed Musli restore connective tissue elasticity and muscular stamina.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/90 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/90 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <TrendingUp className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-900">
                      Spinal Posture &amp; Alignment
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5 font-normal leading-relaxed">
                      Relieves spinal compression and helps correct slumping posture for an upright silhouette.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/90 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-200/90 text-green-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-900">
                      100% Safe &amp; Non-Hormonal
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5 font-normal leading-relaxed">
                      Zero artificial steroids, zero synthetic hormones, and completely non-habit forming.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/90 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/90 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Award className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-900">
                      Standardized Laboratory Quality
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5 font-normal leading-relaxed">
                      Manufactured in certified cleanroom facilities complying with highest purity and herbal standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Ingredients (15 Super Herbs) */}
        {activeTab === "ingredients" && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                15 Pure Ayurvedic Botanical Extracts
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-normal">
                Each serving contains standardized herbal extracts sourced from certified organic cultivators.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {STANDARD_HERBS.map((ing, i) => {
                const HerbIcon = ing.icon;
                return (
                  <div key={i} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/90 hover:border-emerald-200 transition shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${ing.bgColor} border flex items-center justify-center shrink-0 shadow-2xs`}>
                        <HerbIcon className={`w-5 h-5 ${ing.color}`} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-gray-900 leading-snug">{ing.name}</h4>
                        <p className="text-[10px] sm:text-xs text-emerald-700 font-medium truncate">{ing.amount}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 font-normal leading-relaxed">{ing.purpose}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 3: Dosage (Daily Routine) */}
        {activeTab === "dosage" && (
          <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Simple Daily Routine for Peak Results
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 font-normal">
                Follow this simple routine every day at the same time to allow your body to respond consistently.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block">
                Recommended Routine
              </span>
              <p className="text-xs sm:text-sm font-medium text-gray-800 mt-1 leading-relaxed">
                {product.dosage ||
                  "Mix 1 scoop with warm water/milk or take 1 capsule twice daily after meals as directed on packaging. Continue consistently for 60–90 days for peak lasting results."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/90 text-center">
                <div className="w-8 h-8 rounded-full bg-[#16341f] text-white flex items-center justify-center font-bold mx-auto mb-2 text-xs">
                  1
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-gray-900">Morning Scoop</h4>
                <p className="text-xs text-gray-600 mt-1 font-normal leading-relaxed">
                  Mix 1 scoop of powder in 200ml of warm milk or water after breakfast.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/90 text-center">
                <div className="w-8 h-8 rounded-full bg-[#16341f] text-white flex items-center justify-center font-bold mx-auto mb-2 text-xs">
                  2
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-gray-900">Capsule &amp; Tablet</h4>
                <p className="text-xs text-gray-600 mt-1 font-normal leading-relaxed">
                  Take 1 capsule in the morning and 1 tablet at night after meals with water.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/90 text-center">
                <div className="w-8 h-8 rounded-full bg-[#16341f] text-white flex items-center justify-center font-bold mx-auto mb-2 text-xs">
                  3
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-gray-900">45–90 Days Cycle</h4>
                <p className="text-xs text-gray-600 mt-1 font-normal leading-relaxed">
                  Maintain daily for 45 to 90 days. Combine with light stretching and sound sleep.
                </p>
              </div>
            </div>

            {/* Pro Tips Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h5 className="font-semibold text-xs sm:text-sm text-gray-900 mb-2.5">
                Recommended Daily Habits
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-gray-700">
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-0.5 text-xs">
                    <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Hydration Protocol</span>
                  </div>
                  <span className="text-xs text-gray-600 font-normal leading-relaxed">
                    Drink 2.5 to 3 liters of fresh water daily to maximize nutrient absorption.
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-0.5 text-xs">
                    <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Spine Stretching</span>
                  </div>
                  <span className="text-xs text-gray-600 font-normal leading-relaxed">
                    15 minutes daily: hanging bar, Cobra stretch, and Surya Namaskar.
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-0.5 text-xs">
                    <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Restorative Sleep</span>
                  </div>
                  <span className="text-xs text-gray-600 font-normal leading-relaxed">
                    Sleep 7–8 hours uninterrupted. Growth hormones naturally peak during deep sleep.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Reviews Header & Breakdown */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-center md:justify-start">
                <div className="text-center">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">4.9</span>
                  <div className="flex text-amber-400 justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium block mt-1">
                    10,000+ reviews
                  </span>
                </div>

                <div className="space-y-1.5 w-36 sm:w-48 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-4">5★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full w-[92%]" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">92%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-4">4★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full w-[6%]" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">6%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-4">3★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[2%]" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">2%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-semibold text-xs transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Write a Review</span>
                </button>
                <button
                  type="button"
                  data-fastrr-buy
                  data-product-id={product.id}
                  data-variant-id={`${product.id}-default`}
                  data-quantity="1"
                  className="py-2.5 px-5 rounded-xl bg-[#16341f] text-white font-bold text-xs shadow-md hover:bg-[#0f2415] transition cursor-pointer text-center"
                >
                  Buy Now &amp; Try Risk-Free
                </button>
              </div>
            </div>

            {/* Write Review Modal */}
            {isWriteReviewOpen && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-300 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">
                    Write Your Verified Experience
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsWriteReviewOpen(false)}
                    className="p-1 rounded-full hover:bg-emerald-100 text-gray-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Star Rating (1 - 5)
                      </label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      >
                        <option value={5}>★★★★★ (5.0 - Excellent Results)</option>
                        <option value={4}>★★★★☆ (4.0 - Good Experience)</option>
                        <option value={3}>★★★☆☆ (3.0 - Average)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Review / Experience *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience with Leafora Herbal, duration of use, and visible changes..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWriteReviewOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#16341f] text-white text-xs font-bold shadow-md hover:bg-emerald-900 cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Review Cards */}
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-gray-50/80 border border-gray-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(rev.rating) ? "fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-gray-900 ml-1">
                        ({rev.rating.toFixed(1)})
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900 text-xs">{rev.name}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLikeReview(rev.id)}
                      className="flex items-center gap-1 text-emerald-800 font-semibold hover:text-emerald-900 cursor-pointer text-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{rev.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-sm border border-gray-200/90 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {STANDARD_FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className="py-3 sm:py-3.5">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-3 font-semibold text-xs sm:text-sm text-gray-900 hover:text-emerald-800 transition cursor-pointer"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed mt-2 pr-2 sm:pr-6 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Authentic Trust & Safety Guarantee Banner */}
      <div className="p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#16341f] via-[#102717] to-[#0c1d11] text-white shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold">100% Pure Herbal Extracts</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Crafted with authentic Ayurvedic botanicals and zero synthetic steroids, heavy metals, or chemicals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <Truck className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold">Free Express Pan-India Shipping</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Dispatched within 24 hours. Cash on Delivery (COD) available across India, plus flat ₹400 off on prepaid.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <Award className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold">10,000+ Happy Customers</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Consistent 4.9★ rating backed by thousands of genuine transformations and verified customer reviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Leafora Herbal Formulations Grid */}
      <div className="space-y-4">
        <div className="text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Complete Range
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1.5">
            Explore Other Growth Plans
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {allProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 rounded-xl bg-gray-50 flex items-center justify-center p-3 mb-2.5">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">{item.name}</h4>
                  <p className="text-xs text-gray-500 font-normal mt-0.5">{item.tagline}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base sm:text-lg font-extrabold text-[#16341f]">
                      ₹{item.price.toLocaleString("en-IN")}/-
                    </span>
                    <del className="text-xs text-gray-400 font-normal">
                      ₹{item.original_price.toLocaleString("en-IN")}/-
                    </del>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <Link
                    href={`/product/${item.slug || item.id}`}
                    className="py-2.5 px-2 text-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition flex items-center justify-center"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/checkout?productId=${item.id}`}
                    className="py-2.5 px-2 text-center rounded-xl bg-[#16341f] hover:bg-[#0f2415] text-white font-bold text-xs shadow-2xs transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ORDER NOW</span>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Mobile Floating Conversion Bar (Sticky at bottom on Mobile View) */}
      <aside
        id="mobile-buy-now-bar"
        aria-label="Mobile Checkout Action"
        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-3 py-2 transition-all duration-300"
      >
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          {/* Quick Call Helpline Button */}
          <a
            href="tel:+918630552164"
            className="w-11 h-11 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-900 border border-emerald-300 flex items-center justify-center shrink-0 transition shadow-2xs"
            title="Order via Call (+91 8630552164)"
          >
            <PhoneCall className="w-4 h-4 text-emerald-800" strokeWidth={2.2} />
          </a>

          {/* Pricing Info */}
          <div className="flex flex-col justify-center shrink-0 pr-1">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#16341f] leading-none">
                ₹{(product.price * quantity).toLocaleString("en-IN")}
              </span>
              <del className="text-[11px] text-gray-400 font-normal">
                ₹{(product.original_price * quantity).toLocaleString("en-IN")}
              </del>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 leading-none mt-0.5">
              Free Express Shipping
            </span>
          </div>

          {/* Primary CTA Button */}
          <button
            type="button"
            data-fastrr-buy
            data-product-id={product.id}
            data-variant-id={`${product.id}-default`}
            data-quantity={String(quantity)}
            className="flex-1 h-11 px-3.5 rounded-xl bg-[#16341f] hover:bg-[#0f2415] active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.2} />
            <span>ORDER NOW</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
          </button>
        </div>
      </aside>
    </div>
  );
}
