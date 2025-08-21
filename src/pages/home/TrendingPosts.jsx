import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Fade } from "react-awesome-reveal";
import PostCard from "./PostCard";

const TrendingPosts = () => {
  const axiosPublic = useAxios();

  const { data: trendingPosts = [], isLoading, isError } = useQuery({
    queryKey: ["trendingPosts"],
    queryFn: async () => {
      // Assuming a new API endpoint to get trending posts by comment count
      const res = await axiosPublic.get("/trending-posts"); 
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError || trendingPosts.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <Fade triggerOnce>
        <h2 className="mb-6 text-3xl font-bold text-center sm:text-4xl text-primary">
          Trending Posts
        </h2>
      </Fade>
      <div>
        <div className="flex flex-col gap-8">
          {trendingPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingPosts;