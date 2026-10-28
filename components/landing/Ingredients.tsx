"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Shield,
  Sparkles,
  Zap,
  Activity,
  Award
} from "lucide-react";

interface Herb {
  nameEn: string;
  nameHi: string;
  botanical: string;
  target: "Men's Vitality" | "Sugar Care" | "Cellular Energy";
  benefitEn: string;
  benefitHi: string;
  color: string;
}

const HERBS: Herb[] = [
  {
    nameEn: "Shuddha Shilajit",
    nameHi: "शुद्ध शिलाजीत",
    botanical: "Asphaltum punjabianum",
    target: "Men's Vitality",
    benefitEn: "Rich in 84+ minerals & fulvic acid. Revitalizes mitochondrial ATP and surges physical stamina.",
    benefitHi: "84+ खनिजों और फुल्विक एसिड से भरपूर, जो शरीर को तुरंत नई ऊर्जा और स्टैमिना प्रदान करता है।",
    color: "from-amber-600/20 to-stone-900/10",
  },
  {
    nameEn: "Gurmar (Sugar Destroyer)",
    nameHi: "गुड़मार (मधुमेह विनाशक)",
    botanical: "Gymnema sylvestre",
    target: "Sugar Care",
    benefitEn: "Gymnemic acids block sugar absorption in intestines and stimulate pancreatic insulin secretion.",
    benefitHi: "आंतों में चीनी के अवशोषण को रोकता है और पैंक्रियाज से प्राकृतिक इंसुलिन को बढ़ावा देता है।",
    color: "from-emerald-600/20 to-teal-900/10",
  },
  {
    nameEn: "Ashwagandha",
    nameHi: "अश्वगंधा",
    botanical: "Withania somnifera",
    target: "Men's Vitality",
    benefitEn: "Contains standardized withanolides to reduce cortisol stress and optimize male strength & stamina.",
    benefitHi: "मानसिक तनाव घटाकर मांसपेशियों की ताकत, पौरुष और शारीरिक क्षमता में वृद्धि करता है।",
    color: "from-amber-500/20 to-stone-900/10",
  },
  {
    nameEn: "Jamun Seed Extract",
    nameHi: "जामुन गुठली चूर्ण",
    botanical: "Syzygium cumini",
    target: "Sugar Care",
    benefitEn: "Jamboline glucoside prevents the conversion of starch into sugar, maintaining steady glucose levels.",
    benefitHi: "स्टार्च को चीनी में बदलने से रोकता है, जिससे भोजन के बाद शुगर स्पाइक्स नहीं होती।",
    color: "from-purple-600/20 to-indigo-900/10",
  },
  {
    nameEn: "Safed Musli",
    nameHi: "सफेद मूसली",
    botanical: "Chlorophytum borivilianum",
    target: "Men's Vitality",
    benefitEn: "Potent natural Rasayana providing deep tissue nourishment, cellular vitality, and endurance.",
    benefitHi: "शरीर की सप्त धातुओं को पुष्ट कर लंबे समय तक चलने वाला आंतरिक बल और जोश प्रदान करती है।",
    color: "from-emerald-500/20 to-stone-900/10",
  },
  {
    nameEn: "Karela (Bitter Melon)",
    nameHi: "करेला सत्व",
    botanical: "Momordica charantia",
    target: "Sugar Care",
    benefitEn: "Contains natural plant polypeptide-P which mimics insulin to transport glucose into body cells.",
    benefitHi: "प्राकृतिक प्लांट-इंसुलिन की तरह काम कर कोशिकाओं तक ग्लूकोज पहुँचाने में सहायक है।",
    color: "from-emerald-700/20 to-green-950/10",
  },
  {
    nameEn: "Vijaysar",
    nameHi: "विजयसार",
    botanical: "Pterocarpus marsupium",
    target: "Sugar Care",
    benefitEn: "Classical herb famous for regenerating beta cells in the pancreas and reducing frequent urination.",
    benefitHi: "पैंक्रियाज की बीटा-कोशिकाओं को नया जीवन देकर बार-बार पेशाब आने की समस्या दूर करता है।",
    color: "from-amber-700/20 to-stone-900/10",
  },
  {
    nameEn: "Kaunch Beej",
    nameHi: "कौंच बीज",
    botanical: "Mucuna pruriens",
    target: "Men's Vitality",
    benefitEn: "Rich in natural L-DOPA. Stimulates nervous coordination, enhances stamina, and restores vigor.",
    benefitHi: "नसों को सक्रिय कर प्राकृतिक स्टैमिना, चुस्ती और शारीरिक आत्मविश्वास को दोगुना करता है।",
    color: "from-orange-600/20 to-stone-900/10",
  },
  {
    nameEn: "Neem",
    nameHi: "नीम पत्र",
    botanical: "Azadirachta indica",
    target: "Sugar Care",
    benefitEn: "Purifies the bloodstream, cleanses metabolic toxins, and enhances receptor sensitivity.",
    benefitHi: "खून को शुद्ध कर टॉक्सिन्स को बाहर निकालता है और अंगों को शुगर के नुकसान से बचाता है।",
    color: "from-green-600/20 to-emerald-950/10",
  },
  {
    nameEn: "Gokshura",
    nameHi: "गोक्षुर",
    botanical: "Tribulus terrestris",
    target: "Men's Vitality",
    benefitEn: "Boosts nitric oxide blood flow, strengthens renal function, and supports enduring performance.",
    benefitHi: "शरीर में रक्त संचार तेज करता है और मांसपेशियों को मजबूत बनाकर ऊर्जा स्तर बनाए रखता है।",
    color: "from-amber-500/20 to-stone-900/10",
  },
  {
    nameEn: "Methi (Fenugreek)",
    nameHi: "मेथी दाना",
    botanical: "Trigonella foenum-graecum",
    target: "Sugar Care",
    benefitEn: "High soluble fiber and 4-hydroxyisoleucine delay gastric carbohydrate digestion.",
    benefitHi: "कार्बोहाइड्रेट के पाचन को धीमा कर ब्लड शुगर और कोलेस्ट्रॉल दोनों को नियंत्रित रखता है।",
    color: "from-yellow-600/20 to-stone-900/10",
  },
  {
    nameEn: "Malkangani & Clove",
    nameHi: "मालकांगनी व लौंग तैल",
    botanical: "Celastrus & Syzygium",
    target: "Men's Vitality",
    benefitEn: "Stimulates localized vascular dilation and instant micro-circulation during massage.",
    benefitHi: "मालिश के दौरान नसों में तुरंत गर्मी और रक्त संचार बढ़ाकर पूर्ण संवेदनशीलता प्रदान करता है।",
    color: "from-red-600/20 to-stone-900/10",
  },
];

export function Ingredients() {
  const [startIndex, setStartIndex] = useState(0);

  const prev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, HERBS.length - 3)));
  };

  const next = () => {
    setStartIndex((prev) => (prev + 3 < HERBS.length ? prev + 1 : 0));
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#f8faf8] border-b border-gray-100" id="ingredients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 border border-emerald-300">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ethical Botanical Sourcing</span>
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
            15 Potent Super Herbs <span className="text-gradient-green">&amp; Standardized Extracts</span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-2 font-medium">
            Every bottle from <strong>Leafora Herbal Private Limited</strong> contains standardized active phyto-nutrients, extracted at optimal temperatures for maximum biological potency.
          </p>
        </div>

        {/* Carousel / Cards Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERBS.slice(startIndex, startIndex + 3).map((herb, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-6 sm:p-7 bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        herb.target === "Men's Vitality"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {herb.target}
                    </span>
                    <span className="text-xs font-mono text-gray-400">100% Extract</span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900">{herb.nameEn}</h3>
                  <div className="text-sm font-bold text-emerald-800 mb-1">{herb.nameHi}</div>
                  <div className="text-xs italic text-gray-500 font-serif mb-4">({herb.botanical})</div>

                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                      {herb.benefitEn}
                    </p>
                    <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed font-normal bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                      {herb.benefitHi}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                  <span className="flex items-center gap-1 text-emerald-800">
                    <Award className="w-3.5 h-3.5" /> Lab Tested
                  </span>
                  <span>Non-Toxic</span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-white border border-gray-300 text-gray-800 hover:bg-emerald-50 hover:border-emerald-600 transition shadow-sm cursor-pointer"
              aria-label="Previous herbs"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-black text-gray-600 tracking-wider">
              Showing {startIndex + 1}-{Math.min(startIndex + 3, HERBS.length)} of {HERBS.length} Herbs
            </span>
            <button
              onClick={next}
              className="p-3 rounded-full bg-white border border-gray-300 text-gray-800 hover:bg-emerald-50 hover:border-emerald-600 transition shadow-sm cursor-pointer"
              aria-label="Next herbs"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
