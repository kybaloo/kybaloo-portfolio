"use client";

import Link from "next/link";
import { useRef } from "react";

const ResumePage = () => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 mr-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Resume
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 font-medium text-blue-600 transition-colors bg-transparent border border-blue-600 rounded-lg hover:bg-blue-600/10"
          >
            ← Back to Portfolio
          </Link>
        </div>

        <div
          ref={resumeRef}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg print:shadow-none print:rounded-none"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-8 print:bg-blue-800">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">TCHANGAI Florentin Kybaloo</h1>
              <h2 className="text-xl mb-4">Full Stack Web Developer & Data Analyst</h2>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span>📧 kybalooflo@gmail.com</span>
                <span>📍 Lomé, Togo</span>
                <span>💼 Web & SQL Developer at Ecobank</span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Professional Summary */}
            <section>
              <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Professional Summary</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Experienced Full Stack Web Developer and Data Analyst with 4+ years of expertise in building scalable web applications
                and transforming data into actionable business insights. Currently serving as Web & SQL Developer at Ecobank
                Transnational Incorporated, delivering enterprise-level solutions that serve millions of users across Africa.
                Proficient in modern web technologies, database management, and business intelligence tools.
              </p>
            </section>

            {/* Work Experience */}
            <section>
              <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Work Experience</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">Web & SQL Developer</h4>
                      <p className="text-blue-600 font-semibold">Ecobank Transnational Incorporated</p>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">Sep 2022 - Present</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>Developed SmartLoan digital lending platform processing $50M+ in loan applications</li>
                    <li>Designed real-time analytics dashboards using Power BI and Tableau</li>
                    <li>Optimized database queries resulting in 40% performance improvement</li>
                    <li>Led integration of core banking systems with external APIs</li>
                    <li>Mentored junior developers and conducted code reviews</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">Full Stack Web Developer</h4>
                      <p className="text-blue-600 font-semibold">Freelance Developer</p>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">Jan 2021 - Aug 2022</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>Built 20+ custom web applications using React, Vue.js, and Laravel</li>
                    <li>Developed attendance management system with facial recognition</li>
                    <li>Created business intelligence dashboards for data-driven decisions</li>
                    <li>Maintained 98% client satisfaction rate with on-time delivery</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Key Projects */}
            <section>
              <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Key Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">SmartLoan Platform</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ecobank Digital Lending Solution</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Digital lending platform with automated credit scoring and risk assessment
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Attendance Management System</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI-Powered HR Solution</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Facial recognition attendance system with mobile apps and real-time monitoring
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Expo MIT 2023</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">IoT Environmental Monitoring</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    IoT solution for urban environmental monitoring presented at MIT Expo
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">BI Analytics Dashboard</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Business Intelligence Solution</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Real-time dashboard with predictive analytics and automated reporting
                  </p>
                </div>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Technical Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Frontend</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    JavaScript, TypeScript, React, Vue.js, Next.js, HTML5, CSS3, Tailwind CSS, Bootstrap
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Backend</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    PHP, Laravel, Node.js, Express.js, .NET, C#, Python, REST APIs
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Database & Analytics</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    SQL Server, MySQL, PostgreSQL, MongoDB, Power BI, Tableau, Excel
                  </p>
                </div>
              </div>
            </section>

            {/* Education & Certifications */}
            <section>
              <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-2">Education & Achievements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Computer Science & Software Engineering</h4>
                  <p className="text-gray-700 dark:text-gray-300">Specialized in web development and data analysis</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">MIT Expo 2023 Participant</h4>
                  <p className="text-gray-700 dark:text-gray-300">Presented IoT environmental monitoring solution</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Professional Achievements</h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 ml-4">
                    <li>4+ years of professional web development experience</li>
                    <li>50+ successful projects delivered</li>
                    <li>Expert in 15+ programming languages and frameworks</li>
                    <li>100% client satisfaction rate</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          .print\\:rounded-none {
            border-radius: 0 !important;
          }

          .print\\:bg-blue-800 {
            background-color: #1e40af !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          [data-resume-container] * {
            visibility: visible;
          }

          [data-resume-container] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePage;
