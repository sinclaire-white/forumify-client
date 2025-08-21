import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Fade } from "react-awesome-reveal";
import { FaCrown } from "react-icons/fa6";

const TopContributors = () => {
  const axiosPublic = useAxios();

  const { data: contributors = [], isLoading, isError } = useQuery({
    queryKey: ["topContributors"],
    queryFn: async () => {
      const res = await axiosPublic.get("/top-contributors");
      return res.data.slice(0, 3);
    },
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError || contributors.length === 0) {
    return null;
  }

  return (
    <section className="p-6 shadow-inner bg-base-200/50 rounded-xl">
      <Fade triggerOnce>
        <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl text-primary">
          Top Contributors
        </h2>
      </Fade>
      <div className="grid items-stretch grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {contributors.map((user) => (
          <div
            key={user.email}
            className="flex flex-col items-center justify-between h-full p-6 text-center rounded-lg shadow-md bg-base-100"
          >
            <div className="flex flex-col items-center mb-2">
              <img
                src={user.photo || "https://i.ibb.co/68H8w8c/user.png"}
                alt={user.name}
                className="object-cover w-20 h-20 rounded-full"
              />
              {user.badge === "Gold" && (
                <div className="absolute top-0 right-0 p-1 text-white transform bg-yellow-500 rounded-full translate-x-1/4 -translate-y-1/4">
                  <FaCrown className="w-4 h-4" />
                </div>
              )}
            </div>
            <h3 className="w-full text-sm font-semibold truncate text-base-content">
              {user.name || "Anonymous"}
            </h3>
            <p className="text-xs text-primary">
              {user.count} Contribution{user.count > 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopContributors;
