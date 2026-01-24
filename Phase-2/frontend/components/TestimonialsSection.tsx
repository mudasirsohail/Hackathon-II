export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Synapseis the 'Force Multiplier' for our dev team. We've reduced meeting overhead by 40% and increased feature delivery by 65%. It's become the central nervous system of our workflow.",
      author: "Alex Johnson",
      role: "CTO, TechNova"
    },
    {
      quote: "I've tried every productivity app since 2025, but Synapseis the first that actually understands how my brain works. The neural prioritization feels like having a personal assistant who knows me better than I know myself.",
      author: "Sarah Williams",
      role: "Product Lead, InnovateX"
    }
  ];

  return (
    <div id="testimonials" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Voices from the Frontier
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">Q</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">{testimonial.author}</h4>
                  <p className="text-indigo-600">{testimonial.role}</p>
                </div>
              </div>

              <blockquote className="border-l-4 border-indigo-200 pl-4 py-2">
                <p className="text-lg text-gray-700 italic">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300">
                  Start Building
                </button>
                <button className="px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300">
                  Go Pro
                </button>
                <button className="px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-300">
                  Scale the Team
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}