export default function StatsSection() {
  const stats = [
    { value: "2.1M+", label: "Milestones Reached" },
    { value: "6.2h", label: "Weekly Time Saved" },
    { value: "85k+", label: "Elite Builders" },
    { value: "99.9%", label: "Sync Reliability" },
  ];

  return (
    <div id="stats" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl font-extrabold text-indigo-600">{stat.value}</p>
              <p className="mt-2 text-base text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}