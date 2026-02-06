import Link from "next/link";

export default function TestimonialsSection() {
  return (
    <div id="cta" className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to transform your workflow?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Join thousands of teams already using Synapse to achieve their goals faster.
          </p>
          <div className="mt-10">
            <Link
              href="/tasks"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start your free trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}