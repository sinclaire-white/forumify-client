import { useState } from 'react'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios'; 
import useAxiosSecure from '../../hooks/useAxiosSecure'; 
import PostCard from './PostCard';
import Banner from './Banner';
import Tags from './Tags';
import Announcements from './Announcements';
import { Fade, Slide } from 'react-awesome-reveal'; 
import { Link } from 'react-router';
import Swal from 'sweetalert2'; 

const Home = () => {
    const axiosPublic = useAxios(); // Using your useAxios for public routes
    const axiosSecure = useAxiosSecure(); // Using your useAxiosSecure for protected routes
    const queryClient = useQueryClient();

    // --- State for Filters, Search, Sort, and Pagination ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState(null); // null means no tag filter
    const [sortBy, setSortBy] = useState("latest"); // 'latest' or 'popularity'
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5; // Matches your backend limit default for /posts

    // --- TanStack Query for Posts ---
    const {
        data: postsData,
        isLoading: arePostsLoading,
        isError: isPostsError,
        error: postsError,
        refetch: refetchPosts // Add refetch function if needed for manual triggers later
    } = useQuery({
        queryKey: ['posts', searchQuery, selectedTag, sortBy, currentPage], // Key changes on filter/search/sort/page
        queryFn: async () => {
            let url = `/posts?page=${currentPage}&limit=${postsPerPage}`;
            if (searchQuery) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }
            if (selectedTag) {
                url += `&tag=${encodeURIComponent(selectedTag)}`;
            }
            if (sortBy === 'popularity') {
                url += `&sort=popularity`;
            }
            const res = await axiosPublic.get(url); // Use axiosPublic for /posts
            return res.data; // This will contain { posts: [], totalCount: N }
        },
        keepPreviousData: true, // Keep data while fetching new for better UX
    });

    const posts = postsData?.posts || [];
    const totalPostsCount = postsData?.totalCount || 0;
    const totalPages = Math.ceil(totalPostsCount / postsPerPage);

    // --- TanStack Query for Popular Searches ---
    const {
        data: popularSearches = [],
        isLoading: arePopularSearchesLoading
    } = useQuery({
        queryKey: ['popularSearches'],
        queryFn: async () => {
            const res = await axiosPublic.get('/popular-searches'); // Use axiosPublic for /popular-searches
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
        cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    });

    // --- Mutation for Recording Searches ---
    // Your backend's /searches endpoint has `verifyJWT`, so we use axiosSecure here.
    const recordSearchMutation = useMutation({
        mutationFn: async (term) => {
            if (term.trim()) { // Only record if the search term is not empty
                await axiosSecure.post('/searches', { term });
            }
        },
        onSuccess: () => {
            // Invalidate the popular searches cache to refetch and update UI
            queryClient.invalidateQueries({ queryKey: ['popularSearches'] });
        },
        onError: (error) => {
            console.error("Failed to record search term:", error);
            // Optionally, show a subtle notification to the user or log silently
            // Swal.fire('Error', 'Failed to record search term.', 'error');
        }
    });

    // --- Handlers for Filters/Search/Sort/Pagination ---
    const handleSearchSubmit = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Always reset to the first page on a new search
        recordSearchMutation.mutate(query); // Call the mutation to record the search
    };

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        setCurrentPage(1); // Always reset to the first page on a new tag filter
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // Always reset to the first page on a new sort
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    };

    // --- Loading & Error States for Posts (main content) ---
    if (arePostsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (isPostsError) {
        console.error("Posts fetch error:", postsError);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-base-200">
                <p className="mb-4 text-xl font-semibold text-red-600">Failed to load posts: {postsError?.message || "An unknown error occurred."}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container px-4 mx-auto my-12 md:px-6">
            <Banner handleSearchSubmit={handleSearchSubmit} />

            <Announcements /> {/* This component already fetches its own data */}

            {/* Tags Section */}
            {/* The Tags component will now fetch its own tags using useAxios */}
            <Tags handleTagClick={handleTagClick} selectedTag={selectedTag} />

            {/* Popular Searches */}
            <section className="px-4 py-8 mt-8 rounded-lg shadow-md md:px-10 bg-base-100">
                <Slide direction="right" triggerOnce>
                    <h3 className="mb-6 text-3xl font-bold text-center text-secondary">
                        🔥 Trending Searches
                    </h3>
                </Slide>
                {arePopularSearchesLoading ? (
                    <div className="flex justify-center py-4">
                        <span className="loading loading-dots loading-md text-primary"></span>
                    </div>
                ) : popularSearches.length === 0 ? (
                    <p className="text-lg text-center text-gray-600">No popular searches yet.</p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        {popularSearches.map((item, i) => (
                            <Fade key={i} delay={i * 50} triggerOnce>
                                <button
                                    onClick={() => handleSearchSubmit(item._id)} // Clicking a popular search term triggers a new search
                                    className="px-5 py-3 text-lg font-semibold text-blue-700 transition-all duration-300 transform border-2 border-blue-300 badge badge-lg hover:scale-105 hover:shadow-lg badge-outline badge-info hover:bg-info hover:text-white"
                                >
                                    #{item._id} ({item.count})
                                </button>
                            </Fade>
                        ))}
                    </div>
                )}
            </section>

            {/* Posts Section */}
            <section className="mt-12">
                <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
                    <Slide direction="left" triggerOnce>
                        <h2 className="text-4xl font-extrabold text-primary">
                            All Posts
                        </h2>
                    </Slide>
                    {/* Sort Dropdown */}
                    <div className="form-control">
                        <label className="label">
                            <span className="font-semibold text-gray-700 label-text">Sort By:</span>
                        </label>
                        <select
                            className="text-gray-800 select select-bordered"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <option value="latest">Latest</option>
                            <option value="popularity">Popularity</option>
                        </select>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <Fade triggerOnce>
                        <p className="py-10 text-xl text-center text-gray-600">No posts found matching your criteria.</p>
                    </Fade>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => (
                            // Ensure PostCard is able to receive the 'commentCount' prop
                            // from the 'posts' data, which your backend now includes.
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && ( // Only show pagination if there's more than 1 page
                    <div className="flex justify-center mt-12">
                        <div className="join">
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
                                    className={`join-item btn btn-md ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline btn-primary'}`}
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
    );
};

export default Home;