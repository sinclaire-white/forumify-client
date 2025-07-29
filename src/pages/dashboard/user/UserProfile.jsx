
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UserProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [recentPosts, setRecentPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (!user?.email) {
        setError("No user email available.");
        setProfileLoading(false);
        return;
      }
      try {
        setProfileLoading(true);
        setError(null);

        const [userRes, postsRes] = await Promise.all([
          axiosSecure.get("/users/check-email", { params: { email: user.email } }),
          axiosSecure.get(`/my-posts?email=${user.email}&limit=3&sort=newest`),
        ]);

        setUserData(userRes.data);
        setRecentPosts(postsRes.data);
      } catch (err) {
        console.error("Failed to fetch user profile data or recent posts:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setProfileLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserProfileData();
    }
  }, [user?.email, authLoading, axiosSecure]);

  if (authLoading || profileLoading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </motion.div>
    );
  }

  if (error || !userData?.exists) {
    return (
      <motion.div
        className="mt-8 text-center text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error || "User not found."}
      </motion.div>
    );
  }

  const { name, email, photo, badge = "bronze" } = userData.user;

  return (
    <motion.div
      className="px-6 py-8 space-y-6 shadow-xl bg-gradient-to-br from-base-200 to-base-300 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        My Profile
      </h2>
      <motion.div
        className="p-6 rounded-lg shadow-md bg-base-100/50 backdrop-blur-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-neutral ring-offset-base-200 ring-offset-1">
              <img src={photo || "/default-profile.jpg"} alt={name} className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="mb-2 text-gray-500">{email}</p>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {badge === "bronze" && (
                <div className="gap-1 p-2 badge badge-warning">
                  <span className="text-lg">🥉</span> Bronze Member
                </div>
              )}
              {badge === "gold" && (
                <div className="gap-1 p-2 badge badge-success">
                  <span className="text-lg">🥇</span> Gold Member
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="p-6 rounded-lg shadow-md bg-base-100/50 backdrop-blur-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="mb-4 text-2xl font-semibold text-center">My 3 Recent Posts</h3>
        {recentPosts.length === 0 ? (
          <p className="text-lg text-center text-gray-600">You haven't made any posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {recentPosts.map((post, i) => (
              <motion.li
                key={post._id}
                className="p-4 transition-all duration-300 border rounded-lg border-base-300 bg-base-100/50 backdrop-blur-sm hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  {post.authorPhoto && (
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full ring ring-neutral ring-offset-base-200 ring-offset-1">
                        <img src={post.authorPhoto} alt={post.authorName} className="object-cover w-full h-full" />
                      </div>
                    </div>
                  )}
                  <h4 className="text-lg font-semibold">{post.title}</h4>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{post.tag && <span className="mr-2 badge badge-outline badge-sm">{post.tag}</span>}</span>
                  <span>Votes: {post.upVote - post.downVote}</span>
                  <span>Comments: {post.commentCount || 0}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;