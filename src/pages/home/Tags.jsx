
import { Fade, Slide } from "react-awesome-reveal";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios"; // Use your public axios hook

const Tags = ({ handleTagClick, selectedTag }) => {
    const axiosPublic = useAxios(); // Initialize your public axios instance

    // --- TanStack Query for All Tags ---
    const { data: allAvailableTags = [], isLoading: areTagsLoading, isError: isTagsError } = useQuery({
        queryKey: ['allTags'], // Unique key for this query
        queryFn: async () => {
            const res = await axiosPublic.get('/tags'); // Fetch tags from your backend
            // Assuming your /tags endpoint returns an array like [{ _id: "...", name: "tag_name" }]
            return res.data.map(tag => tag.name); // Extract just the `name` property for rendering
        },
        staleTime: Infinity, // Tags don't change often, so cache indefinitely
        cacheTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
        onError: (error) => {
            console.error("Error fetching tags:", error);
            // Optionally, show a toast or message about failed tag load
        }
    });

    if (areTagsLoading) {
        return (
            <section className="flex items-center justify-center px-4 py-12 mt-8 rounded-lg shadow-xl md:px-10 bg-base-100">
                <span className="loading loading-dots loading-md text-primary"></span>
            </section>
        );
    }

    // You might want to handle `isTagsError` by showing a message or retrying.
    // For now, if there's an error, `allAvailableTags` will just be an empty array.

    return (
        <section className="px-4 py-12 mt-8 rounded-lg shadow-xl md:px-10 bg-base-100">
            <Slide direction="left" triggerOnce>
                <h3 className="mb-6 text-3xl font-bold text-center text-secondary">
                    Explore by Tags
                </h3>
            </Slide>
            <div className="flex flex-wrap justify-center gap-3">
                {allAvailableTags.length === 0 ? (
                    <Fade triggerOnce>
                        <p className="text-lg text-gray-600">No tags available.</p>
                    </Fade>
                ) : (
                    allAvailableTags.map((tag, i) => (
                        <Fade key={i} delay={i * 50} triggerOnce> {/* Staggered fade for tags */}
                            <button
                                onClick={() => handleTagClick(tag.toLowerCase())} // Convert to lowercase for consistency
                                className={`badge badge-lg border-2 font-semibold text-lg py-3 px-5 transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                                    ${selectedTag === tag.toLowerCase()
                                        ? "badge-primary text-primary-content border-primary"
                                        : "badge-outline badge-neutral text-gray-700 border-gray-300 hover:bg-neutral hover:text-white"
                                    }`}
                            >
                                #{tag}
                            </button>
                        </Fade>
                    ))
                )}
            </div>
            {selectedTag && ( // Only show clear filter if a tag is selected
                <Fade delay={200} triggerOnce>
                    <p className="mt-8 text-lg font-medium text-center text-gray-700">
                        Currently filtering by: <span className="font-bold capitalize text-primary">{selectedTag}</span>
                        <button
                            onClick={() => handleTagClick(null)} // Clear filter button by passing null
                            className="ml-3 text-red-500 btn btn-xs btn-ghost hover:text-red-700"
                        >
                            (Clear Filter)
                        </button>
                    </p>
                </Fade>
            )}
        </section>
    );
};

export default Tags;