import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Fade } from "react-awesome-reveal";

const StatCard = ({ title, value }) => (
  <div className="shadow-md stats bg-base-100/50">
    <div className="stat">
      <div className="stat-title text-base-content/60">{title}</div>
      <div className="stat-value text-primary">{value}</div>
    </div>
  </div>
);

const PlatformStats = () => {
  const axiosPublic = useAxios();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["platformStats"],
    queryFn: async () => {
      const res = await axiosPublic.get("/public-stats");
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

  if (isError || !stats) {
    return null;
  }

  return (
    <section className="mt-12">
      <Fade triggerOnce>
        <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl text-primary">
          Platform Stats
        </h2>
      </Fade>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <StatCard title="Total Posts" value={stats.totalPosts} />
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Comments" value={stats.totalComments} />
      </div>
    </section>
  );
};

export default PlatformStats;