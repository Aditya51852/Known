export function Compare() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Compare</h2>
      
      {/* Tabs */}
      <div className="flex space-x-8 mb-8">
        <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-2">
          Top Rating
        </button>
        <button className="text-gray-600 hover:text-gray-900 font-medium">
          For You
        </button>
      </div>

      {/* Featured Cars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-900">Toyota Camry</h3>
          <p className="text-blue-600 font-bold">$35,000</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-900">Honda Accord</h3>
          <p className="text-blue-600 font-bold">$32,000</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-900">Ford F-150</h3>
          <p className="text-blue-600 font-bold">$45,000</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-semibold text-gray-900">Chevrolet Silverado</h3>
          <p className="text-blue-600 font-bold">$48,000</p>
        </div>
      </div>

      {/* Compare Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BMW M3 Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop" 
              alt="BMW M3" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">BMW M3</h3>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-gray-700 font-medium">4.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">$65,000</span>
            </div>
          </div>
        </div>

        {/* Audi RS6 Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop" 
              alt="Audi RS6" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Audi RS6</h3>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-gray-700 font-medium">4.7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">$75,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 