export function NewsAndBrowse() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* News Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">News</h2>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {/* News Item 1 */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" fill="#e5e7eb" />
                <path
                  d="M8 10h8M8 14h4"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Electric Vehicle Market Sees Record Growth in 2024
              </h3>
              <p className="text-gray-500 text-xs">Jan 15</p>
            </div>
          </div>

          {/* News Item 2 */}
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=80&h=80&fit=crop"
              alt="BMW"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                BMW Unveils New Sustainable Manufacturing Process
              </h3>
              <p className="text-gray-500 text-xs">Jan 12</p>
            </div>
          </div>

          {/* News Item 3 */}
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=80&h=80&fit=crop"
              alt="Tesla"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                Tesla Model Y Becomes Best-Selling Electric SUV
              </h3>
              <p className="text-gray-500 text-xs">Jan 10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Type Section - Vertical */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Type</h2>
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-y-auto max-h-80">
          <ul className="space-y-4">
            {[
              { label: "SUV", emoji: "🚙" },
              { label: "Hatchback", emoji: "🚗" },
              { label: "Sedan", emoji: "🚙" },
              { label: "Saloon", emoji: "🚙" },
              { label: "Minivan", emoji: "🚐" },
              { label: "Pickup", emoji: "🛻" },
              { label: "Coupe", emoji: "🏎️" },
              { label: "Convertible", emoji: "🚘" },
              { label: "Station Wagon", emoji: "🚐" },
              { label: "Sport", emoji: "🏁" },
            ].map((type) => (
              <li key={type.label} className="flex items-center space-x-4">
                <span className="bg-gray-100 p-2 rounded-lg text-xl">
                  {type.emoji}
                </span>
                <span className="font-medium text-gray-800">{type.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
