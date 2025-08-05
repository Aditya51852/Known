export function BrowseByBrand() {
  const brands = [
    { name: 'BMW', logo: '🚗' },
    { name: 'Audi', logo: '🚗' },
    { name: 'Mercedes', logo: '🚗' },
    { name: 'Toyota', logo: '🚗' },
    { name: 'Honda', logo: '🚗' },
    { name: 'Ford', logo: '🚗' },
    { name: 'Tesla', logo: '🚗' },
    { name: 'Volkswagen', logo: '🚗' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Brand</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {brands.map((brand) => (
          <button
            key={brand.name}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">{brand.logo}</div>
            <p className="text-sm font-medium text-gray-900">{brand.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
} 