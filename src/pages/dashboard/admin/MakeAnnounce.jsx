import React, { useState } from "react";

const MakeAnnounce = () => {
  const [formData, setFormData] = useState({
    authorImage: "",
    authorName: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to backend API
    console.log("Announcement data:", formData);
    alert("Announcement submitted (mock)");
    setFormData({
      authorImage: "",
      authorName: "",
      title: "",
      description: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-200 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Make Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="authorImage"
          placeholder="Author Image URL"
          value={formData.authorImage}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          name="authorName"
          placeholder="Author Name"
          value={formData.authorName}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Announcement Title"
          value={formData.title}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          placeholder="Announcement Description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          rows={5}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Submit Announcement
        </button>
      </form>
    </div>
  );
};

export default MakeAnnounce;
