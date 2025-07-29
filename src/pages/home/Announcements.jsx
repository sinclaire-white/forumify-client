import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center px-6 py-12 shadow-lg rounded-xl bg-gradient-to-br from-base-200 to-base-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </motion.div>
        <p className="mt-4 text-lg font-medium text-base-content/70">Loading announcements...</p>
      </section>
    );
  }

  // No announcements
  if (announcements.length === 0) {
    return null;
  }

  return (
    <section className="px-6 py-8 shadow-xl rounded-xl bg-gradient-to-br from-base-200 to-base-300">
      <motion.h3
        className="flex items-center gap-2 mb-6 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
        Announcements ({announcements.length})
      </motion.h3>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {announcements.map((note, i) => (
              <motion.div
                key={i}
                className="p-4 transition-all duration-300 border rounded-lg bg-base-100/50 backdrop-blur-sm border-base-300 hover:shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  {note.authorImage && (
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full ring ring-neutral ring-offset-base-200 ring-offset-1">
                        <img
                          src={note.authorImage}
                          alt={note.authorName || "Author"}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                  <h4 className="text-lg font-semibold text-base-content">{note.title}</h4>
                </div>
                <motion.p
                  className="mb-2 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                >
                  By <span className="font-medium text-base-content">{note.authorName || "Site Admin"}</span> •{" "}
                  {new Date(note.createdAt || Date.now()).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </motion.p>
                <p className="leading-relaxed text-gray-700">{note.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Announcements;