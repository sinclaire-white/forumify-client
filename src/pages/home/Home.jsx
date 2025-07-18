import { useEffect, useState, useCallback } from "react"; // Added useCallback
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PostCard from "./PostCard";
import Banner from "./Banner";
import Tags from "./Tags";
import Announcements from "./Announcements";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router"; 

const ITEMS_PER_PAGE = 5; // Define posts per page

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'popularity'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0); // For pagination count
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation(); // To read current page from URL

  // Effect to read page from URL on initial load or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    } else {
      setCurrentPage(1); // Default to page 1 if no param
    }
  }, [location.search]);


  // Memoized fetch function for better dependency management
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/posts';
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (selectedTag) {
        params.append('tag', selectedTag);
      }
      params.append('page', currentPage); // Add pagination parameters
      params.append('limit', ITEMS_PER_PAGE);
      params.append('sort', sortOrder); // Add sort order parameter

      if (params.toString()) {
        url = `${url}?${params.toString()}`;
      }

      const response = await axiosSecure.get(url);
      setPosts(response.data);
      setError(null);

      // Fetch total count only once or when filters change (not on page change if count is static)
      if (currentPage === 1 && !searchQuery && !selectedTag) { // Only fetch total count if not filtered
        const totalCountResponse = await axiosSecure.get('/posts-total-count');
        setTotalPosts(totalCountResponse.data.count);
      }

    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load posts. Please try again later.");
      Swal.fire('Error', 'Failed to load posts.', 'error');
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, searchQuery, selectedTag, currentPage, sortOrder]); // Dependencies for useCallback

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Call fetchPosts when its dependencies change

  // Update URL on page change for better UX and direct linking
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('page', currentPage.toString());
    navigate(`?${params.toString()}`, { replace: true });
  }, [currentPage, navigate, location.search]);


  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSelectedTag(null);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page on new tag filter
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(totalPosts / ITEMS_PER_PAGE)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    }
  };

  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);
  const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

  return (
    <div className="min-h-screen bg-base-200">
      <Banner handleSearchSubmit={handleSearchSubmit} />
      <div className="container p-4 py-8 mx-auto">
        <Tags handleTagClick={handleTagClick} selectedTag={selectedTag} />

        <Announcements />

        <Slide direction="down" triggerOnce className="mt-12">
          <h1 className="mb-10 text-4xl font-extrabold text-center md:text-5xl text-primary drop-shadow-lg">
            Forum Discussions
          </h1>
        </Slide>

        {/* Sort Button */}
        <div className="flex justify-center px-4 mb-8 md:justify-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="m-1 btn btn-neutral">
              Sort By: {sortOrder === 'newest' ? 'Newest' : 'Popularity'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a onClick={() => setSortOrder('newest')}>Newest</a></li>
              <li><a onClick={() => setSortOrder('popularity')}>Popularity</a></li>
            </ul>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-60">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="mt-10 text-xl font-semibold text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <Fade triggerOnce>
            <div className="mt-20 text-2xl font-medium text-center text-gray-600">
              No posts found for your criteria.
              <br />
              <button
                onClick={() => { navigate("/add-post"); setSearchQuery(""); setSelectedTag(null); setSortOrder("newest"); setCurrentPage(1); }}
                className="mt-6 text-lg btn btn-primary"
              >
                Add Your First Post
              </button>
            </div>
          </Fade>
        ) : (
          <>
            <div className="grid max-w-2xl grid-cols-1 gap-8 mx-auto mt-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-8">
                <div className="join">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-md btn-outline btn-primary"
                  >
                    « Prev
                  </button>
                  {pageNumbers.map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`join-item btn btn-md ${currentPage === page ? 'btn-primary text-primary-content' : 'btn-outline btn-neutral'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item btn btn-md btn-outline btn-primary"
                  >
                    Next »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;