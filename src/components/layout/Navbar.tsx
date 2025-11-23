// src/components/layout/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-green-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">MatchaRoommate</h1>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="search"
                className="w-full px-5 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full hover:bg-green-500 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Bell + Profile placeholders */}
          <div className="flex items-center gap-4">
            {/* Bell */}
            <div className="w-10 h-10 bg-green-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-lg">bell</span>
            </div>

            {/* Profile Avatar */}
            <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}