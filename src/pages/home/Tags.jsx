// src/components/Announcements.jsx
import { useQuery } from "@tanstack/react-query";
import { Bounce } from "react-awesome-reveal";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [], isLoading, isError } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  // Return null if loading, error, or no announcements, so its grid column can collapse
  if (isLoading || isError || announcements.length === 0) {
    // Optionally, you can return a small loading spinner or placeholder if you want *some* visual presence
    // but for column collapsing, returning null is best.
    return null;
  }

  return (
    <motion.section
      className="px-4 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="p-1 shadow-lg bg-gradient-to-r from-primary to-secondary rounded-2xl">
          <div className="p-5 bg-base-100 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6z" /></svg> {/* Simple info icon */}
              </div>
              <h3 className="text-xl font-bold text-base-content">Announcements ({announcements.length})</h3>
            </div>

            <div className="space-y-4">
              {announcements.map((note, i) => (
                <motion.div
                  key={i}
                  className="p-4 border rounded-lg shadow-sm border-base-300 bg-base-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  // Removed whileHover as per general instruction for non-interactive elements,
                  // assuming announcements are read-only. Add back if interactive.
                >
                  <h4 className="flex items-center gap-2 mb-2 text-lg font-semibold text-base-content">
                    <span className="p-1 rounded-full bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.001 2.001 0 0118 14.59V10c0-3.21-1.79-5.905-5-6.57V3a1 1 0 10-2 0v.42c-3.21.66-5 3.36-5 6.57v4.59c0 .53-.21 1.04-.595 1.405L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
                      </svg>
                    </span>
                    {note.title}
                  </h4>
                  <p className="mb-2 text-sm text-gray-500">{new Date(note.timestamp).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="whitespace-pre-line text-base-content">{note.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Announcements;