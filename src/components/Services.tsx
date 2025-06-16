'use client';

import { Service } from '@/types/service.types';

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-6">
        {/* Services Header */}
        <div className="mb-16">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">
            ○ SERVICES
          </p>
          <h2 className="text-5xl md:text-6xl font-light">
            What I <span className="text-purple-500">Do</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="space-y-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                {/* Left side - Number and Title */}
                <div className="flex items-center gap-8">
                  <span className="text-2xl font-light text-gray-400">
                    {service.id}/
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{service.icon}</span>
                    <h3 className="text-2xl font-light text-white group-hover:text-purple-300 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Right side - Description */}
                <div className="max-w-md">
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
