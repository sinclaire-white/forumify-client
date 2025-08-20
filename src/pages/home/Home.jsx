import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PostCard from "./PostCard";
import Banner from "./Banner";
import Tags from "./Tags";
import Announcements from "./Announcements";
import { Fade } from "react-awesome-reveal";
import Swal from "sweetalert2";
import SplitText from "../../components/SplitText";

const Home = () => {
  const axiosPublic = useAxios();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const recordSearchMutation = useMutation({
    mutationFn: async (query) => {
      if (!query || !query.trim()) return;
      await axiosSecure.post("/record-search", { searchTerm: query });
    },
    onSuccess: () => queryClient.invalidateQueries(["popularSearches"]),
    onError: (error) => {
      console.error("Error recording search:", error);
      Swal.fire({
        icon: "error",
        title: "Search Error",
        text: "Failed to record search. Please try again.",
        confirmButtonColor: "#EF4444",
        timer: 2000,
      });
    },
  });

  const { data: postsData, isLoading: arePostsLoading, isError: isPostsError, error: postsError } =
    useQuery({
      queryKey: ["posts", searchQuery, selectedTag, sortBy, currentPage],
      queryFn: async () => {
        let url = `/posts?page=${currentPage}&limit=${postsPerPage}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
        if (selectedTag) url += `&tag=${encodeURIComponent(selectedTag)}`;
        if (sortBy === "popularity") url += `&sort=popularity`;
        const res = await axiosPublic.get(url);
        return res.data;
      },
      keepPreviousData: true,
    });

  const posts = postsData?.posts || [];
  const totalPostsCount = postsData?.totalCount || 0;
  const totalPages = Math.ceil(totalPostsCount / postsPerPage);

  const { data: announcementsForLayout = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: allAvailableTagsForLayout = [] } = useQuery({
    queryKey: ["allTags"],
    queryFn: async () => {
      const res = await axiosPublic.get("/tags");
      return res.data.map((tag) => tag.name);
    },
    staleTime: Infinity,
  });

  const handleSearchSubmit = (query) => {
    setSearchQuery(query || "");
    setSelectedTag(null);
    setCurrentPage(1);
    if (query && query.trim()) recordSearchMutation.mutate(query);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (arePostsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (isPostsError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-200">
        <p className="mb-4 text-xl font-semibold text-red-600">
          Failed to load posts: {postsError?.message || "An unknown error occurred."}
        </p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Retry
        </button>
      </div>
    );

  return (
    <div className="container px-4 mx-auto my-12 md:px-6">
      {/* Banner Section */}
      <Banner handleSearchSubmit={handleSearchSubmit} handleTagClick={handleTagClick} />

      {/* Main Grid: Left = Announcements + Tags, Right = Posts */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
        {/* Left Column */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-24">
          {announcementsForLayout.length > 0 && (
            <div className="p-4 shadow-md bg-base-100/50 rounded-xl">
              <h2 className="mb-3 text-xl font-bold text-primary">Announcements</h2>
              <Announcements />
            </div>
          )}
          {allAvailableTagsForLayout.length > 0 && (
            <div className="p-4 shadow-md bg-base-100/50 rounded-xl">
              <h2 className="mb-3 text-xl font-bold text-primary">Tags</h2>
              <Tags handleTagClick={handleTagClick} selectedTag={selectedTag} />
            </div>
          )}
        </div>

        {/* Right Column: Posts */}
        <div>
          <section className="p-6 shadow-inner bg-base-200/50 rounded-xl">
            {/* Header: All Posts + Sort */}
            <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
              <SplitText
                text="All Posts"
                className="text-4xl font-extrabold text-center text-primary"
              />

              {/* Sort Dropdown */}
              <div className="relative w-full max-w-xs sm:w-auto">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full placeholder-transparent transition-all duration-200 ease-in-out appearance-none cursor-pointer sm:w-auto peer select select-bordered bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="" disabled hidden>
                    Sort By
                  </option>
                  <option value="latest">Latest</option>
                  <option value="popularity">Popularity</option>
                </select>
                <label
                  htmlFor="sort-by"
                  className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-[&:not([value=''])]:-top-2.5 peer-[&:not([value=''])]:text-sm peer-[&:not([value=''])]:text-primary peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400"
                >
                  Sort By
                </label>
              </div>
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
              <Fade triggerOnce>
                <p className="py-10 text-xl text-center text-base-content/70">
                  No posts found matching your criteria.
                </p>
              </Fade>
            ) : (
              <div className="flex flex-col gap-8">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="shadow-md join">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-md btn-outline btn-primary"
                  >
                    «
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`join-item btn btn-md ${
                        currentPage === index + 1
                          ? "btn-primary"
                          : "btn-outline btn-primary"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item btn btn-md btn-outline btn-primary"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
