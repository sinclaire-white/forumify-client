import { useState } from "react";

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // to be filled from backend later

  const handleSearch = () => {
    // For now, we'll mock the result
    const mockResults = [
      { id: 1, title: "How to improve mental health", tags: ["health", "wellbeing"] },
      { id: 2, title: "Youth in social development", tags: ["youth", "social"] },
    ];
    const filtered = mockResults.filter(post =>
      post.tags.includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <section className="bg-blue-100 py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-900">Welcome to Forumify</h1>
        <p className="text-lg md:text-xl text-blue-800">
          Connect, Share, and Grow with meaningful conversations.
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-4">
          <input
            type="text"
            placeholder="Search by tag (e.g. health, youth)..."
            className="w-full md:w-96 px-4 py-2 rounded-md border border-blue-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Search Results:</h2>
          <ul className="space-y-4">
            {searchResults.map((post) => (
              <li
                key={post.id}
                className="p-4 border border-gray-200 rounded-lg shadow-md bg-white"
              >
                <h3 className="text-lg font-bold text-blue-800">{post.title}</h3>
                <p className="text-sm text-gray-600">Tags: {post.tags.join(", ")}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Banner;
