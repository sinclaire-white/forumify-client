
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTag } from "react-icons/fa";

const Tags = ({ handleTagClick, selectedTag }) => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const { data: allAvailableTags = [], isLoading: areTagsLoading, isError: isTagsError } = useQuery({
    queryKey: ["allTags"],
    queryFn: async () => {
      const res = await axios.get("/tags");
      return res.data.map((tag) => tag.name);
    },
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 60 * 24,
    onError: (error) => {
      console.error("Error fetching tags:", error);
    },
  });

  // Loading state
  if (areTagsLoading) {
    return (
      <section className="flex flex-col items-center justify-center px-6 py-12 shadow-lg rounded-xl bg-gradient-to-br from-base-200 to-base-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </motion.div>
        <p className="mt-4 text-lg font-medium text-base-content/70">Loading tags...</p>
      </section>
    );
  }

  // Error state
  if (isTagsError) {
    return (
      <section className="flex flex-col items-center justify-center px-6 py-12 shadow-inner rounded-xl bg-error/10 text-error-content">
        <p className="mb-4 text-lg font-semibold">Error loading tags.</p>
        <button
          onClick={() => queryClient.invalidateQueries(["allTags"])}
          className="transition-all duration-300 rounded-full btn btn-error btn-sm hover:bg-error/80"
        >
          Retry
        </button>
      </section>
    );
  }

  // No tags
  if (allAvailableTags.length === 0) {
    return null;
  }

  // Tag size variation for dynamic cloud effect
  const getTagSize = (index) => {
    const sizes = ["text-sm px-3 py-1", "text-base px-4 py-2", "text-lg px-5 py-2"];
    return sizes[index % 3]; // Cycle through sizes
  };

  return (
    <section className="px-6 py-8 shadow-xl rounded-xl bg-gradient-to-br from-base-200 to-base-300">
      <motion.h3
        className="flex items-center gap-2 mb-6 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaTag className="text-primary" /> Explore Tags
      </motion.h3>
      <div className="flex flex-wrap gap-3">
        {allAvailableTags.map((tag, i) => (
          <motion.button
            key={i}
            onClick={() => handleTagClick(tag.toLowerCase())}
            className={`
              ${getTagSize(i)}
              rounded-full font-semibold transition-all duration-300
              ${
                selectedTag === tag.toLowerCase()
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-base-100 text-base-content hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:shadow-md"
              }
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-200
            `}
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.9, rotate: -3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
          >
            #{tag}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selectedTag && (
          <motion.div
            className="p-4 mt-6 text-center border rounded-lg bg-base-100/50 backdrop-blur-sm border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-medium text-base-content">
              Filtering by:{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                #{selectedTag}
              </span>
            </p>
            <button
              onClick={() => handleTagClick(null)}
              className="mt-2 text-sm font-semibold transition-all duration-200 text-secondary hover:text-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-base-200"
            >
              Clear Filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Tags;
