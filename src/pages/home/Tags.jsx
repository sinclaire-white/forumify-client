import { useState } from "react";

const tags = ["Education", "Health", "Environment", "Technology", "Volunteer"];

const Tags = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Explore Tags</h3>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, i) => (
          <button
            key={i}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-1 rounded-full border text-sm font-medium ${
              selectedTag === tag
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-blue-50"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
      {selectedTag && (
        <p className="mt-4 text-sm text-gray-600">
          Searching for posts tagged with: <strong>{selectedTag}</strong>
        </p>
      )}
    </div>
  );
};

export default Tags;
