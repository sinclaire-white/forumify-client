import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import PostCard from "./PostCard";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router";

const TrendingPosts = () => {
  const axiosPublic = useAxios();

  const { data: trendingPosts = [], isLoading, isError } = useQuery({
    queryKey: ["trendingPosts"],
    queryFn: async () => {
      const res = await axiosPublic.get("/posts?sort=popularity&limit=3");
      return res.data.posts;
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
    <section className="mt-12">
      <Fade triggerOnce>
        <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl text-primary">
          Trending Posts
        </h2>
      </Fade>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {trendingPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/posts">
          <button className="btn btn-outline btn-primary">
            View All Posts
          </button>
        </Link>
      </div>
    </section>
  );
};

export default TrendingPosts;