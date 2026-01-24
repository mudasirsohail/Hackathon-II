import Link from "next/link";

export default function HeroSection() {
  return (
    <div id="hero" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="pb-20 pt-10 sm:pb-24 sm:pt-16">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Master the Chaos.</span>
                <span className="block text-indigo-600 mt-2">Own Every Action-Item.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto">
                The next-generation to-do app engineered for high-performance humans. Log tasks in milliseconds, let AI architect your daily list, and transform your "to-do" into "done" with surgical precision.
              </p>
              <div className="mt-10">
                <Link
                  href="/tasks"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Deploy Your First Task
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}