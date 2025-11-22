// src/components/ListingFilters.tsx
export default function ListingFilters() {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
      {/* Green "All" button */}
      <button className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-md">
        All
      </button>

      {/* Dropdowns */}
      {["Near Me", "P1000-2000", "Any", "Student", "Bed Spacer"].map((label) => (
        <select
          key={label}
          className="px-6 py-4 rounded-full border-2 border-green-600 text-green-800 font-medium bg-white cursor-pointer hover:border-green-700 transition focus:outline-none"
        >
          <option>{label}</option>
        </select>
      ))}
    </div>
  );
}