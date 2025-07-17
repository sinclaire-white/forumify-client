import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Use axiosSecure for protected routes, axios for public
import PostCard from "./PostCard";
import Banner from "./Banner";
import Tags from "./Tags";
import Announcements from "./Announcements";
import { Fade, Slide } from "react-awesome-reveal"; // For animations
import Swal from "sweetalert2";
import { Navigate } from "react-router";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // Posts after search/tag filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedTag, setSelectedTag] = useState(null); // State for selected tag
  const axiosSecure = useAxiosSecure(); // Assuming /posts endpoint might be protected, adjust if public

  // --- Fetch Posts from Backend ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Construct query parameters for search and tag
        let url = '/posts'; // Your primary endpoint for all posts
        const params = new URLSearchParams();

        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (selectedTag) {
          params.append('tag', selectedTag);
        }

        if (params.toString()) {
          url = `${url}?${params.toString()}`;
        }

        const response = await axiosSecure.get(url); // Use axiosSecure if JWT is required
        setPosts(response.data); // Store all fetched posts
        setFilteredPosts(response.data); // Initially, filtered posts are all posts
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again later.");
        Swal.fire('Error', 'Failed to load posts.', 'error');
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [axiosSecure, searchQuery, selectedTag]); // Re-fetch when search query or selected tag changes

  // --- Handlers passed to children ---
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSelectedTag(null); // Clear tag filter when searching
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag); // Toggle tag selection
    setSearchQuery(""); // Clear search query when a tag is clicked
  };

  // --- Render Logic ---
  return (
    <div className="min-h-screen bg-base-200">
      <Banner handleSearchSubmit={handleSearchSubmit} /> {/* Pass handler to Banner */}
      <div className="container p-4 py-8 mx-auto">
        <Tags handleTagClick={handleTagClick} selectedTag={selectedTag} /> {/* Pass handler and selected tag to Tags */}

        <Announcements /> {/* You can keep Announcements here or move it */}

        <Slide direction="down" triggerOnce className="mt-12">
          <h1 className="mb-10 text-4xl font-extrabold text-center md:text-5xl text-primary drop-shadow-lg">
            Forum Discussions
          </h1>
        </Slide>

        {loading ? (
          <div className="flex items-center justify-center h-60">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="mt-10 text-xl font-semibold text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Fade triggerOnce>
            <div className="mt-20 text-2xl font-medium text-center text-gray-600">
              No posts found for your criteria.
              <br />
              <button
                onClick={() => { Navigate("/add-post"); setSearchQuery(""); setSelectedTag(null); }}
                className="mt-6 text-lg btn btn-primary"
              >
                Add Your First Post
              </button>
            </div>
          </Fade>
        ) : (
          <div className="grid grid-cols-1 gap-8 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;