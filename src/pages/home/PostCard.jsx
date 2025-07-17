import { Fade } from "react-awesome-reveal"; // Import Fade

const PostCard = ({ post }) => {
  const { _id, authorName, authorPhoto, title, description, tag, upVote, downVote, createdAt } = post; // Added _id

  const postDate = createdAt ? new Date(createdAt).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'N/A';

  return (
    <Fade direction="up" triggerOnce> {/* Individual card fade-up animation */}
      <div className="card bg-base-100 shadow-xl border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <div className="flex flex-col justify-between p-6 card-body">
          <div>
            <div className="flex items-center mb-4">
              <div className="avatar">
                <div className="w-16 h-16 overflow-hidden rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={authorPhoto || "https://via.placeholder.com/150"}
                    alt={authorName}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-neutral-content">{authorName}</h3>
                <p className="text-sm text-gray-500">{postDate}</p>
              </div>
            </div>

            <h2 className="mb-3 text-2xl font-bold break-words card-title text-secondary-focus">{title}</h2>
            <p className="mb-4 text-base text-gray-700 line-clamp-3">{description}</p> {/* Use line-clamp for description */}

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="font-medium text-white badge badge-accent badge-lg">{tag}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 text-base text-gray-600 border-t border-gray-200 border-dashed">
            <div className="flex items-center space-x-4">
              <div className="flex items-center font-medium text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M7 11V13C7 14.11 7.27 15.17 7.78 16.14L6.15 17.77C5.56 16.89 5 15.93 5 14.93V11H7M15 4V10L12 7L9 10V4C9 3.45 9.45 3 10 3H14C14.55 3 15 3.45 15 4M21 12V10L18 7L15 10V12H21Z" /></svg>
                {upVote} Upvotes
              </div>
              <div className="flex items-center font-medium text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M7 13V11C7 9.89 7.27 8.83 7.78 7.86L6.15 6.23C5.56 7.11 5 8.07 5 9.07V13H7M15 20V14L12 17L9 14V20C9 20.55 9.45 21 10 21H14C14.55 21 15 20.55 15 20M21 12V14L18 17L15 14V12H21Z" /></svg>
                {downVote} Downvotes
              </div>
            </div>
            <div className="justify-end card-actions">
              <button className="transition-all duration-300 btn btn-sm btn-primary hover:btn-secondary">Read More</button>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default PostCard;