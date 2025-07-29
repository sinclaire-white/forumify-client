import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import {
  IconArrowUp,
  IconArrowDown,
  IconMessageCircle,
} from "@tabler/icons-react";

const PostCard = ({ post }) => {
  const {
    _id,
    authorName,
    authorPhoto,
    title,
    description,
    tag,
    upVote = 0,
    downVote = 0,
    createdAt,
    commentCount = 0,
  } = post;

  const navigate = useNavigate();

  const postDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const handleReadMore = () => {
    navigate(`/post/${_id}`);
  };

  return (
    <Fade direction="up" triggerOnce>
      <motion.div
        className="card bg-base-100 shadow-xl border border-base-300 rounded-lg overflow-hidden h-full flex flex-col transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex flex-col justify-between p-4 sm:p-6 card-body">
          {/* Top section: Author info, Title, Description, Tag */}
          <div>
            <div className="flex items-center mb-4">
              <div className="mr-3 avatar">
                <div className="overflow-hidden rounded-full w-14 h-14 ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={authorPhoto || "https://picsum.photos/100/100?random=user"}
                    alt={authorName || "Anonymous"}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold leading-snug text-base-content">{authorName || "Anonymous"}</p>
                <p className="text-sm text-gray-500 mt-0.5">{postDate}</p>
              </div>
            </div>

            {/* Post Title */}
            <h2 className="mb-3 text-2xl font-bold leading-tight card-title text-base-content">
              {title}
            </h2>

            {/* Post Description Snippet */}
            <p className="mb-4 leading-relaxed text-base-content/80 line-clamp-3">
              {description}
            </p>

            {/* Post Tag */}
            {tag && (
              <div className="mb-4">
                <span className="px-3 py-2 text-sm font-medium badge badge-outline badge-primary">
                  #{tag}
                </span>
              </div>
            )}
          </div>

          {/* Bottom section: Engagement and Read More button */}
          <div className="flex flex-row flex-wrap items-center gap-2 pt-4 mt-auto border-t border-base-200">
            <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium text-base-content/70">
              {/* Upvotes */}
              <div className="flex items-center gap-0.5">
                <IconArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                <span>{upVote} Upvotes</span>
              </div>
              {/* Downvotes */}
              <div className="flex items-center gap-0.5">
                <IconArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-error" />
                <span>{downVote} Downvotes</span>
              </div>
              {/* Comments Count */}
              <div className="flex items-center gap-0.5">
                <IconMessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                <span>{commentCount} Comments</span>
              </div>
            </div>

            {/* Read More Button */}
            <button
              onClick={handleReadMore}
              className="flex-shrink-0 px-4 py-1 text-sm font-medium transition-transform duration-200 ease-in-out transform btn btn-primary btn-sm hover:scale-105 active:scale-95"
            >
              Read More
            </button>
          </div>
        </div>
      </motion.div>
    </Fade>
  );
};

export default PostCard;