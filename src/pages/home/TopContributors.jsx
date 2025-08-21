import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Fade } from "react-awesome-reveal";

const TopContributors = () => {
  const axiosPublic = useAxios();

  const { data: contributors = [], isLoading, isError } = useQuery({
    queryKey: ["topContributors"],
    queryFn: async () => {
      const res = await axiosPublic.get("/top-contributors");
      return res.data;
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
    <section className="mt-12">
      <Fade triggerOnce>
        <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl text-primary">
          Top Contributors
        </h2>
      </Fade>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {contributors.map((user) => (
          <div
            key={user.email}
            className="flex flex-col items-center p-4 text-center rounded-lg shadow-md bg-base-100"
          >
            <div className="relative mb-2">
              <div className="w-16 h-16 mask mask-squircle">
                <img
                  src={user.photo || "https://i.ibb.co/68H8w8c/user.png"}
                  alt={user.name}
                  className="object-cover w-full h-full"
                />
              </div>
              {user.badge === "gold" && (
                <span className="absolute bottom-0 right-0 badge badge-warning badge-xs">
                  Gold
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold truncate text-base-content">
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