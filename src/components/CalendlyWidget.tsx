"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Calendar, ChevronDown, Clock, Video } from "lucide-react";
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
    consultation: "https://calendly.com/kybalooflo/30min", // Remplacez par votre vraie URL
    discovery: "https://calendly.com/kybalooflo/discovery", // Remplacez par votre vraie URL
    technical: "https://calendly.com/kybalooflo/technical", // Remplacez par votre vraie URL
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
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            {" "}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {language === "fr" ? "Choisir un type de rendez-vous" : "Choose a meeting type"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "fr"
                  ? "Sélectionnez le type de consultation qui vous convient"
                  : "Select the type of consultation that suits you"}
              </p>
            </div>
            <div className="p-2">
              {/* Consultation 30min */}
              <button
                onClick={() => openCalendly(calendlyUrls.consultation)}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    {" "}
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === "fr" ? "Consultation (30 min)" : "Consultation (30 min)"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "fr" ? "Discussion générale sur votre projet" : "General discussion about your project"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Discovery Call */}
              <button
                onClick={() => openCalendly(calendlyUrls.discovery)}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>{" "}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === "fr" ? "Appel de découverte (45 min)" : "Discovery Call (45 min)"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "fr" ? "Analyse approfondie de vos besoins" : "In-depth analysis of your needs"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Technical Review */}
              <button
                onClick={() => openCalendly(calendlyUrls.technical)}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === "fr" ? "Revue technique (60 min)" : "Technical Review (60 min)"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "fr" ? "Audit technique et recommandations" : "Technical audit and recommendations"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {language === "fr" ? "Tous les appels sont gratuits et sans engagement" : "All calls are free and without obligation"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
