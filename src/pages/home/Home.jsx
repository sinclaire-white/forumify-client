// src/pages/home/Home.jsx
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
    const axiosPublic = useAxios();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // --- State for Filters, Search, Sort, and Pagination ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [sortBy, setSortBy] = useState("latest");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    // --- TanStack Query for Posts ---
    const {
        data: postsData,
        isLoading: arePostsLoading,
        isError: isPostsError,
        error: postsError,
        refetch: refetchPosts
    } = useQuery({
        queryKey: ['posts', searchQuery, selectedTag, sortBy, currentPage],
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
            const res = await axiosPublic.get(url);
            return res.data;
        },
        keepPreviousData: true,
    });

    const posts = postsData?.posts || [];
    const totalPostsCount = postsData?.totalCount || 0;
    const totalPages = Math.ceil(totalPostsCount / postsPerPage);

    // --- TanStack Query for Announcements (to determine layout presence) ---
    const {
        data: announcementsForLayout = [],
        isLoading: areAnnouncementsLoadingForLayout,
        isError: isAnnouncementsErrorForLayout
    } = useQuery({
        queryKey: ['announcements'], // Uses the same key as the Announcements component itself
        queryFn: async () => {
            const res = await axiosSecure.get("/announcements");
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
        cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    });

    // --- TanStack Query for All Tags (to determine layout presence) ---
    const {
        data: allAvailableTagsForLayout = [],
        isLoading: areTagsLoadingForLayout,
        isError: isTagsErrorForLayout
    } = useQuery({
        queryKey: ['allTags'], // Uses the same key as the Tags component itself
        queryFn: async () => {
            const res = await axiosPublic.get('/tags');
            return res.data.map(tag => tag.name);
        },
        staleTime: Infinity, // Tags don't change often
        cacheTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    });

    // --- Determine if side columns should be shown for layout calculation ---
    const shouldShowTagsColumn = !areTagsLoadingForLayout && !isTagsErrorForLayout && allAvailableTagsForLayout.length > 0;
    const shouldShowAnnouncementsColumn = !areAnnouncementsLoadingForLayout && !isAnnouncementsErrorForLayout && announcementsForLayout.length > 0;

    // --- Dynamically build grid classes based on column presence ---
    let mainGridClasses = "mt-12 grid grid-cols-1 gap-8"; // Default for small screens (stack vertically)
    if (shouldShowTagsColumn && shouldShowAnnouncementsColumn) {
        // Both sidebars present: Tags | Posts (wide) | Announcements
        mainGridClasses += " lg:grid-cols-[280px_1fr_280px]"; // Example: 280px fixed width sidebars, 1fr for main content
    } else if (shouldShowTagsColumn) {
        // Only Tags sidebar present: Tags | Posts (wider)
        mainGridClasses += " lg:grid-cols-[280px_1fr]";
    } else if (shouldShowAnnouncementsColumn) {
        // Only Announcements sidebar present: Posts (wider) | Announcements
        mainGridClasses += " lg:grid-cols-[1fr_280px]";
    } else {
        // Neither sidebar present: Posts takes full width
        mainGridClasses += " lg:grid-cols-1"; // Posts will take the full single column
    }

    // --- Handlers for Filters/Search/Sort/Pagination ---
    const handleSearchSubmit = (query) => {
        setSearchQuery(query);
        setSelectedTag(null); // Clear tag filter when searching
        setCurrentPage(1);
        recordSearchMutation.mutate(query);
    };

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        setSearchQuery(""); // Clear search query when filtering by tag
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {/* Banner Section - Full Width */}
            <Banner handleSearchSubmit={handleSearchSubmit} />

            {/* Main Content Grid: Dynamic based on sidebars */}
            <div className={mainGridClasses}>
                {/* Left Column: Tags */}
                {shouldShowTagsColumn && (
                    <div>
                        <Tags handleTagClick={handleTagClick} selectedTag={selectedTag} />
                    </div>
                )}

                {/* Middle Column: Posts (Always present, takes dynamic width) */}
                <div>
                    <section className="p-6 shadow-inner bg-base-200/50 rounded-box">
                        <div className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row">
                            <Slide direction="left" triggerOnce>
                                <h2 className="text-4xl font-extrabold text-primary">
                                    All Posts
                                </h2>
                            </Slide>
                            {/* Sort Dropdown */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="font-semibold text-base-content label-text">Sort By:</span>
                                </label>
                                <select
                                    className="select select-bordered text-base-content bg-base-100 border-accent focus:border-primary focus:ring-primary"
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
                                <p className="py-10 text-xl text-center text-base-content/70">No posts found matching your criteria.</p>
                            </Fade>
                        ) : (
                            <div className="flex flex-col gap-8"> {/* Single column for posts */}
                                {posts.map(post => (
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

                {/* Right Column: Announcements */}
                {shouldShowAnnouncementsColumn && (
                    <div>
                        <Announcements />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;