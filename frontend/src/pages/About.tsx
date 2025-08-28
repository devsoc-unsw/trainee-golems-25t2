import { Navbar } from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="w-full sm:px-6 lg:px-8 md:ml-[calc(var(--sidebar-width,16rem))] duration-500 delay-100">
        <Navbar />
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            About This Project
          </h1>

          <div className="prose prose-lg text-gray-600">
            <p>
              This is a full-stack application built with modern technologies:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Frontend
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• React 18</li>
                  <li>• TypeScript</li>
                  <li>• Vite</li>
                  <li>• Tailwind CSS</li>
                  <li>• React Router</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Backend
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Node.js</li>
                  <li>• Express</li>
                  <li>• TypeScript</li>
                  <li>• Prisma ORM</li>
                  <li>• PostgreSQL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
