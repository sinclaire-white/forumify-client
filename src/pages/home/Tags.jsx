import { Fade, Slide } from "react-awesome-reveal"; // For animations

const allTags = ["Education", "Technology", "Health", "Science", "Finance", "Travel", "Art", "Sports", "News"]; // More comprehensive tags

const Tags = ({ handleTagClick, selectedTag }) => { // Accept props
  return (
    <section className="px-4 py-12 mt-8 rounded-lg shadow-xl md:px-10 bg-base-100">
      <Slide direction="left" triggerOnce>
        <h3 className="mb-6 text-3xl font-bold text-center text-secondary">
          Explore by Tags
        </h3>
      </Slide>
      <div className="flex flex-wrap justify-center gap-3">
        {allTags.map((tag, i) => (
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
        ))}
      </div>
      {selectedTag && (
        <Fade delay={200} triggerOnce>
          <p className="mt-8 text-lg font-medium text-center text-gray-700">
            Currently filtering by: <span className="font-bold capitalize text-primary">{selectedTag}</span>
            <button
              onClick={() => handleTagClick(null)} // Clear filter button
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