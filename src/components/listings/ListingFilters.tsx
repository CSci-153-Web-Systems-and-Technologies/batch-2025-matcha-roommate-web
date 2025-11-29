export default function ListingFilters() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Active Filter */}
      <button className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm">
        All
      </button>

      {/* Other Filters */}
      {["Near Me", "Budget < 2k", "Students Only", "Bed Spacer"].map((label) => (
        <button
          key={label}
          className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium bg-white hover:border-gray-300 hover:bg-gray-50 transition"
        >
          {label}
        </button>
      ))}
    </div>
  );
}