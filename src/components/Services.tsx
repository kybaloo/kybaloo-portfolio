"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Code2, Globe, Palette, Smartphone } from "lucide-react";

const iconMapping = {
  Code2: <Code2 className="w-12 h-12 text-blue-600" />,
  Palette: <Palette className="w-12 h-12 text-purple-600" />,
  Globe: <Globe className="w-12 h-12 text-green-600" />,
  Smartphone: <Smartphone className="w-12 h-12 text-orange-600" />,
};

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      id: "01",
      icon: "Code2",
      title: t.services.webDevelopment.title,
      description: t.services.webDevelopment.description,
    },
    {
      id: "02",
      icon: "Palette",
      title: t.services.uiuxDesign.title,
      description: t.services.uiuxDesign.description,
    },
    {
      id: "03",
      icon: "Globe",
      title: t.services.websites.title,
      description: t.services.websites.description,
    },
    {
      id: "04",
      icon: "Smartphone",
      title: t.services.mobileApps.title,
      description: t.services.mobileApps.description,
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t.services.title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t.services.subtitle}</p>
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
            >
              <div className="mb-6 flex justify-center">{iconMapping[service.icon as keyof typeof iconMapping]}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
