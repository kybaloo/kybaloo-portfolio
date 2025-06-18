"use client";

import { Service } from "@/types/service.types";
import { Code2, Globe, Palette, Smartphone } from "lucide-react";

interface ServicesProps {
  services: Service[];
}

const iconMapping = {
  Code2: <Code2 className="w-12 h-12 text-blue-600" />,
  Palette: <Palette className="w-12 h-12 text-purple-600" />,
  Globe: <Globe className="w-12 h-12 text-green-600" />,
  Smartphone: <Smartphone className="w-12 h-12 text-orange-600" />,
};

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Mes Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Je propose une gamme complète de services pour concrétiser vos projets digitaux
          </p>
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
            >
              <div className="mb-6 flex justify-center">{iconMapping[service.icon as keyof typeof iconMapping]}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
