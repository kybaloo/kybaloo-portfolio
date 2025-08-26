"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Clock, Video, X } from "lucide-react";
import { useState } from "react";

interface CalendlyWidgetProps {
  variant?: "button" | "inline";
  className?: string;
}

export default function CalendlyWidget({ variant = "button", className = "" }: CalendlyWidgetProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Replace with your actual Calendly URLs
  const calendlyUrls = {
    consultation: "https://calendly.com/tchangaiflorentin6/30min",
    discovery: "https://calendly.com/tchangaiflorentin6/discovery",
    technical: "https://calendly.com/tchangaiflorentin6/technical",
  };

  const openCalendly = (url: string) => {
    // Open Calendly in a new window/tab
    window.open(url, "_blank", "width=800,height=600,scrollbars=yes,resizable=yes");
    setIsOpen(false);
  };

  if (variant === "inline") {
    return (
      <div className={`calendly-inline-widget ${className}`}>
        {/* For inline widget, you would use the Calendly embed */}
        <iframe src="https://calendly.com/kybalooflo/30min" width="100%" height="630" frameBorder="0" title="Calendly Scheduling" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      >
        <Calendar className="w-5 h-5 mr-2" />
        {t.hero.scheduleCall}
      </button>

      {isOpen && (
        <>
          {/* Modal Backdrop */}
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal Content */}
            <div className="relative w-full max-w-lg mx-4 bg-white border border-gray-200 shadow-2xl dark:bg-gray-800 rounded-xl dark:border-gray-700">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.calendly.scheduleCall}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "fr"
                      ? "Sélectionnez le type de consultation qui vous convient"
                      : "Select the type of consultation that suits you"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Consultation 30min */}
                <button
                  onClick={() => openCalendly(calendlyUrls.consultation)}
                  className="w-full p-4 mb-3 text-left transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
                >
                  <div className="flex items-start">
                    <div className="p-2 mr-3 transition-colors bg-blue-100 rounded-lg dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{t.calendly.freeConsultation}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t.calendly.discussProjectAndGoals}</p>
                    </div>
                  </div>
                </button>

                {/* Discovery Call */}
                <button
                  onClick={() => openCalendly(calendlyUrls.discovery)}
                  className="w-full p-4 mb-3 text-left transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
                >
                  <div className="flex items-start">
                    <div className="p-2 mr-3 transition-colors bg-green-100 rounded-lg dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50">
                      <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{t.calendly.discoveryCall}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t.calendly.inDepthAnalysis}</p>
                    </div>
                  </div>
                </button>

                {/* Technical Review */}
                <button
                  onClick={() => openCalendly(calendlyUrls.technical)}
                  className="w-full p-4 mb-3 text-left transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group"
                >
                  <div className="flex items-start">
                    <div className="p-2 mr-3 transition-colors bg-purple-100 rounded-lg dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{t.calendly.technicalReview}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t.calendly.technicalAuditAndRecommendations}</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">{t.calendly.allCallsFreeAndWithoutObligation}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
