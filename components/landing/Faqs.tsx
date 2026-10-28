"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";

interface FAQItem {
  qEn: string;
  qHi: string;
  aEn: string;
  aHi: string;
}

const FAQS: FAQItem[] = [
  {
    qEn: "How does Josh 1000 Capsule boost male stamina and energy?",
    qHi: "Josh 1000 कैप्सूल पुरुषों के स्टैमिना और ऊर्जा को कैसे बढ़ाता है?",
    aEn: "Josh 1000 is enriched with concentrated extracts of Shuddha Shilajit, Ashwagandha, and Safed Musli. It works at the cellular level by boosting mitochondrial ATP production, reducing cortisol fatigue, and promoting healthy micro-vascular blood circulation without synthetic chemicals.",
    aHi: "Josh 1000 में शुद्ध शिलाजीत, अश्वगंधा और सफेद मूसली का शुद्ध सत्व है। यह कोशिकाओं में ऊर्जा (ATP) उत्पादन बढ़ाकर थकान दूर करता है और प्राकृतिक ताकत व स्टैमिना में तीव्र सुधार करता है।",
  },
  {
    qEn: "How do Stop Sugar and Diasure powders manage blood glucose levels?",
    qHi: "Stop Sugar और Diasure पाउडर ब्लड शुगर को कैसे नियंत्रित करते हैं?",
    aEn: "Powered by Gurmar ('sugar destroyer'), Karela, Jamun seed, and Vijaysar, these powders delay intestinal sugar absorption, nourish pancreatic beta cells, and reduce post-meal glucose spikes naturally while curbing sugar cravings.",
    aHi: "गुड़मार, करेला, जामुन और विजयसार के मिश्रण से यह आंतों में चीनी के अवशोषण को रोकता है, पैंक्रियाज की बीटा कोशिकाओं को पोषण देता है और भोजन के बाद शुगर स्पाइक्स को रोकता है।",
  },
  {
    qEn: "Are Leafora Herbal formulations 100% safe and naturally pure?",
    qHi: "क्या Leafora Herbal के उत्पाद 100% सुरक्षित और प्राकृतिक हैं?",
    aEn: "Yes, all products from Leafora Herbal Private Limited are 100% natural, independently lab-tested, and manufactured under strict quality standards. They contain zero steroids, zero synthetic stimulants, and zero heavy metals.",
    aHi: "हाँ, Leafora Herbal Private Limited के सभी उत्पाद 100% प्राकृतिक और लैब-परीक्षित हैं। इनमें कोई हानिकारक स्टेरॉइड, भारी धातुएँ या केमिकल नहीं हैं।",
  },
  {
    qEn: "How long should I take these products to see lasting results?",
    qHi: "स्थायी परिणाम देखने के लिए कितने समय तक सेवन करना चाहिए?",
    aEn: "While customers report increased stamina, reduced fatigue, and normalized glucose levels within 15–30 days, we recommend a consistent course of 60 to 90 days for complete cellular revitalization and lasting health benefits.",
    aHi: "15 से 30 दिनों में ऊर्जा और शुगर नियंत्रण में स्पष्ट सुधार दिखता है, लेकिन पूर्ण और स्थायी लाभ के लिए 60 से 90 दिनों का नियमित सेवन अत्यंत लाभकारी है।",
  },
  {
    qEn: "How do I apply and use the Time Master Oil & Capsule combo?",
    qHi: "Time Master ऑयल और कैप्सूल का इस्तेमाल कैसे करें?",
    aEn: "Take 1 Time Master Capsule twice daily with water or warm milk after meals. Gently massage 5 to 7 drops of the Time Master herbal oil on the local area once daily before bedtime to stimulate micro-vascular circulation.",
    aHi: "प्रतिदिन 1 कैप्सूल सुबह-शाम भोजन के बाद दूध या पानी से लें। रात को सोने से पहले 5-7 बूँद हर्बल ऑयल से हल्के हाथों से मालिश करें ताकि रक्त संचार सुचारू हो सके।",
  },
  {
    qEn: "Is Cash on Delivery (COD) available across India?",
    qHi: "क्या पूरे भारत में कैश ऑन डिलीवरी (COD) उपलब्ध है?",
    aEn: "Yes! Leafora Herbal Private Limited provides 100% Free Express Cash on Delivery (COD) to all pin codes across India. You only pay when the parcel arrives at your doorstep. We also offer an extra ₹400 OFF on prepaid orders.",
    aHi: "हाँ! Leafora Herbal पूरे भारत में सभी पिनकोड पर फ्री कैश ऑन डिलीवरी प्रदान करता है। पार्सल हाथ में मिलने पर ही भुगतान करें। प्रीपेड ऑर्डर्स पर फ्लैट ₹400 की अतिरिक्त छूट भी मिलती है।",
  },
  {
    qEn: "Are there fake products in the market?",
    qHi: "क्या बाजार में नकली प्रोडक्ट भी हैं?",
    aEn: "Yes, beware of unauthorized copies and unauthorized online sellers. Always order directly from our official website to receive genuine, batch-certified original Leafora Herbal formulations with authentic security seals.",
    aHi: "हाँ, बाजार में नकली उत्पादों से सावधान रहें। असली, सीलबंद और लैब-प्रमाणित उत्पाद प्राप्त करने के लिए केवल आधिकारिक Leafora Herbal Private Limited वेबसाइट से ही ऑर्डर करें।",
  },
];

export function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#fcfbfa] border-b border-gray-100" id="faqs-sec">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 border border-emerald-300">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Got Questions?</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-2 font-medium">
            Clear answers to common questions about Leafora Herbal Private Limited products, dosage, safety, and delivery.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-gray-200 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-gray-900">
                      {faq.qEn}
                    </h3>
                    <p className="text-xs font-bold text-emerald-800 mt-0.5">
                      {faq.qHi}
                    </p>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-emerald-700 text-white" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 border-t border-gray-100 pt-4 text-xs sm:text-sm text-gray-700 space-y-2 leading-relaxed animate-in fade-in duration-200">
                    <p className="font-medium">{faq.aEn}</p>
                    <p className="text-xs text-gray-600 font-medium pt-2 border-t border-gray-50">
                      {faq.aHi}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
