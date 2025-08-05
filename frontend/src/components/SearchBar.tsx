interface SearchBarProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function SearchBar({ isExpanded, onToggleExpanded }: SearchBarProps) {
  return (
    <div className="w-full mt-12">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Find by Name / Fuel / Fee"
          className="w-full pl-12 pr-6 py-4 text-lg bg-white rounded-xl shadow-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
          onClick={onToggleExpanded}
        />
      </div>
    </div>
  );
} 