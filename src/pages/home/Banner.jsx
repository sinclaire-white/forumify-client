import { useState } from "react";
import { Zoom, Fade } from "react-awesome-reveal"; // For animations

const Banner = ({ handleSearchSubmit }) => { // Accept handleSearchSubmit prop
  const [localSearchQuery, setLocalSearchQuery] = useState(""); // Local state for input field

  const onSearch = () => {
    handleSearchSubmit(localSearchQuery); // Pass the query up to Home component
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="relative px-4 py-20 overflow-hidden text-white shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 md:px-10">
      {/* Background overlay/design elements if any from Aceternity UI, e.g., patterns */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/clean-textile.png")' }}></div>

      <div className="relative z-10 mx-auto space-y-6 text-center max-w-7xl">
        <Zoom cascade damping={0.1} triggerOnce>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Welcome to <span className="text-yellow-300">Forumify</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg font-light md:text-2xl opacity-90">
            Connect, Share, and Grow with a vibrant community. Your thoughts matter.
          </p>
        </Zoom>

        {/* Search Bar */}
        <Fade delay={500} triggerOnce>
          <div className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row">
            <input
              type="text"
              placeholder="Search posts by title or tag..."
              className="w-full px-6 py-3 text-lg text-gray-800 transition-all duration-300 transform border border-blue-400 rounded-full shadow-xl md:w-3/5 lg:w-2/5 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-transparent hover:scale-105"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={onSearch}
              className="px-8 py-3 text-lg font-bold text-blue-900 transition-all duration-300 transform bg-yellow-400 rounded-full shadow-xl btn hover:bg-yellow-500 hover:scale-105 hover:shadow-2xl"
            >
              Search
            </button>
          </div>
        </Fade>
      </div>

      {/* No direct search results display here; Home component manages it */}
    </section>
  );
};

export default Banner;