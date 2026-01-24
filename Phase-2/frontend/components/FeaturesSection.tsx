export default function FeaturesSection() {
  const features = [
    {
      title: "⚡ Neural Prioritization",
      description: "AI-powered task sorting that learns your workflow patterns and automatically prioritizes based on deadlines, complexity, and energy levels."
    },
    {
      title: "🛰️ Zero-Latency Ecosystem",
      description: "Lightning-fast sync across all devices with offline-first architecture. Never lose a thought, even without internet."
    },
    {
      title: "🤝 Deep-Link Collaboration",
      description: "Seamlessly share context with teammates. No more endless email chains or context switching."
    },
    {
      title: "📈 Flow-State Analytics",
      description: "Deep insights into your peak productivity windows and distraction patterns to maximize your cognitive performance."
    }
  ];

  return (
    <div id="features" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Synapseis Different
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Designed for elite performers who demand more from their tools
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-base text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}