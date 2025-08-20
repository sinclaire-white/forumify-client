import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Fade } from "react-awesome-reveal";
import { IconSearch } from "@tabler/icons-react";
import useAxios from "../../hooks/useAxios";

const Banner = ({ handleSearchSubmit, handleTagClick }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const axios = useAxios();

  // Fetch top 3 recent popular searches
  const { data: popularSearches = [], isLoading } = useQuery({
    queryKey: ["popularSearches"],
    queryFn: async () => {
      const response = await axios.get(
        "/popular-searches?limit=3&sort=lastSearched"
      );
      return response.data.filter(
        (search) => search._id && typeof search._id === "string"
      );
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching popular searches:", error);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    handleSearchSubmit(localSearchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: "url('https://picsum.photos/1920/1080?random=1')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-base-content/70 via-base-content/50 to-transparent"></div>
      </div>

      {/* Content Card */}
      <div
        className="relative z-10 flex flex-col items-center w-full max-w-3xl px-6 py-10 mx-auto text-center border shadow-2xl rounded-xl backdrop-blur-sm bg-base-100/10 border-primary/20 sm:px-8 sm:py-12 md:px-10 md:py-14 lg:px-12 lg:py-16"
      >
        {/* Title */}
        <Fade direction="up" triggerOnce>
          <motion.h1
            className="mb-8 text-3xl font-extrabold leading-snug sm:text-4xl md:text-5xl lg:text-6xl text-base-100 drop-shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Connect, Share, Grow.
            <br />
            Your Community Awaits.
          </motion.h1>
        </Fade>

        {/* Search Bar */}
        <Fade direction="up" delay={300} triggerOnce>
          <motion.form
            onSubmit={handleSearch}
            className="w-full max-w-lg mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex overflow-hidden border rounded-full shadow-lg border-primary/40 focus-within:border-primary">
              <input
                type="text"
                placeholder="Search posts by tags..."
                className="flex-grow py-3 pl-4 pr-2 text-sm rounded-l-full sm:text-base input input-bordered bg-base-100 text-base-content focus:outline-none focus:ring-0"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value || "")}
                onKeyPress={handleKeyPress}
                aria-label="Search posts"
              />
              <button
                type="submit"
                className="flex items-center flex-shrink-0 gap-2 px-5 py-3 text-sm rounded-r-full sm:text-base btn btn-primary"
                aria-label="Submit search"
              >
                <IconSearch className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </motion.form>
        </Fade>

        {/* Popular Tags */}
        {popularSearches.length > 0 && (
          <Fade direction="up" cascade damping={0.1} triggerOnce>
            <div className="mb-4 text-base font-semibold sm:text-lg text-base-100 drop-shadow-md">
              Recent Popular Tags:
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <AnimatePresence>
                {popularSearches.map((search, i) => (
                  <motion.button
                    key={search._id}
                    onClick={() => handleTagClick(search._id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold transition-colors duration-200 border rounded-full sm:gap-2 sm:text-sm text-base-100 border-base-100/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      delay: i * 0.1,
                      type: "spring",
                      damping: 12,
                    }}
                  >
                    <span>#</span>
                    <span>{search._id}</span>
                    <span className="font-bold bg-base-100/20 rounded-full px-2 py-0.5 text-[11px] sm:text-xs text-base-content/80">
                      {search.count}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </Fade>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex gap-3 mt-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-8 rounded-full sm:w-20 sm:h-10 bg-base-100/20 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
