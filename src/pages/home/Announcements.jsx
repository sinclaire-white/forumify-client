import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AnimatePresence, motion } from "framer-motion";

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

  if (isLoading || announcements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {announcements.map((note, i) => (
          <motion.div
            key={i}
            className="p-4 transition-all duration-300 border rounded-lg bg-base-100/50 backdrop-blur-sm border-base-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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
            <p className="leading-relaxed text-base-content/80">{note.description}</p>
            <p className="mt-2 text-xs text-base-content/60">
              By <span className="font-medium text-base-content">{note.authorName || "Site Admin"}</span> •{" "}
              {new Date(note.createdAt || Date.now()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;