// src/components/Announcements.jsx
import { useQuery } from "@tanstack/react-query";
import { Bounce } from "react-awesome-reveal";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Announcements = () => {
  const axiosSecure = useAxiosSecure();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  if (isLoading || announcements.length === 0) return null;

  return (
    <section className="p-4 mt-4 rounded-lg shadow-md bg-base-200">
      <div className="max-w-md p-4 mx-auto border-l-4 rounded-md shadow-lg border-info bg-info-content text-info-content">
        <Bounce triggerOnce>
          <h3 className="mb-3 text-xl font-bold text-center">
            📢 Announcements ({announcements.length})
          </h3>
          <ul className="space-y-2 text-sm list-disc list-inside">
            {announcements.map((note, i) => (
              <li key={i}>
                <strong>{note.title}</strong>: {note.description}
              </li>
            ))}
          </ul>
        </Bounce>
      </div>
    </section>
  );
};

export default Announcements;
