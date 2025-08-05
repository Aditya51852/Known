export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CarSearch</h3>
            <p className="text-gray-400">Find your perfect car with confidence</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Buy</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">New Cars</a></li>
              <li><a href="#" className="hover:text-white">Used Cars</a></li>
              <li><a href="#" className="hover:text-white">Dealers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Sell</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Sell Your Car</a></li>
              <li><a href="#" className="hover:text-white">Trade In</a></li>
              <li><a href="#" className="hover:text-white">Dealer Portal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CarSearch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 