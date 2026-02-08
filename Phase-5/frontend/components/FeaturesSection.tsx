export default function FeaturesSection() {
  const features = [
    {
      title: "Smart Task Management",
      description: "Organize your tasks with smart categories, priorities, and deadlines. Never miss a deadline again."
    },
    {
      title: "Team Collaboration",
      description: "Work seamlessly with your team. Share tasks, assign work, and track progress in real-time."
    },
    {
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions and insights to boost your productivity and work smarter."
    }
  ];

  return (
    <div id="features" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Powerful features built for you
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Everything you need to manage tasks, collaborate with your team, and achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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