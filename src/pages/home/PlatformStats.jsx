import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Fade } from "react-awesome-reveal";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const StatCard = ({ title, value }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3, // start counting when 30% of card is visible
  });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-between h-full p-6 text-center rounded-lg shadow-md bg-base-100"
    >
      <p className="text-sm font-medium text-base-content/70">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-primary">
        {inView ? <CountUp end={value} duration={1.5} separator="," /> : 0}
      </h3>
    </div>
  );
};

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
    return (
      <section className="p-6 shadow-inner bg-base-200/50 rounded-xl">
        <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl text-primary">
          Platform Stats
        </h2>
        <div className="p-4 text-center text-red-500 bg-red-100 border border-red-300 rounded-md">
          <p>Failed to load platform stats. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 shadow-inner bg-base-200/50 rounded-xl">
      <Fade triggerOnce>
        <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl text-primary">
          Platform Stats
        </h2>
      </Fade>
      <div className="grid items-stretch grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <StatCard title="Total Posts" value={stats.totalPosts} />
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Comments" value={stats.totalComments} />
      </div>
    </section>
  );
};

export default PlatformStats;
