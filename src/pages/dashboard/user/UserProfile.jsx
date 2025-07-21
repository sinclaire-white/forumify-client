
import { useEffect, useState } from "react";


import { Fade } from "react-awesome-reveal";import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UserProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [recentPosts, setRecentPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (!user?.email) {
        setProfileLoading(false);
        return;
      }
      try {
        setProfileLoading(true);
        setError(null);

       
        const postsRes = await axiosSecure.get(`/my-posts?email=${user.email}&limit=3&sort=newest`); 
        setRecentPosts(postsRes.data);

        setProfileLoading(false);
      } catch (err) {
        console.error("Failed to fetch user profile data or recent posts:", err);
        setError("Failed to load profile data. Please try again.");
        setProfileLoading(false);
      }
    };

    if (!authLoading) { 
      fetchUserProfileData();
    }
  }, [user?.email, authLoading, axiosSecure]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-xl font-semibold text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  // Fallback for user data if not available
  const userName = user?.displayName || "N/A";
  const userEmail = user?.email || "N/A";
  const userPhoto = user?.photoURL || "https://i.ibb.co/VtWn6v0/user-placeholder.png"; 
  const userBadge = user?.badge || "bronze"; 

  return (
    <div className="space-y-6">
      <Fade direction="down" triggerOnce>
        <div className="p-6 border border-gray-200 rounded-lg shadow-xl card bg-base-100 sm:p-8">
          <h2 className="mb-6 text-3xl font-bold text-center text-primary-focus">My Profile</h2>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="avatar">
              <div className="w-24 h-24 overflow-hidden rounded-full sm:w-32 sm:h-32 ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={userPhoto}
                  alt={userName}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-2xl font-bold text-neutral-content">{userName}</h3>
              <p className="mb-2 text-base text-gray-500">{userEmail}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {userBadge === "bronze" && (
                  <div className="p-3 text-sm badge badge-warning">
                    <span className="mr-1 text-xl">🥉</span> Bronze Member
                  </div>
                )}
                {userBadge === "gold" && (
                  <div className="p-3 text-sm badge badge-success">
                    <span className="mr-1 text-xl">🥇</span> Gold Member
                  </div>
                )}
                {/* You can add a default badge if no badge is assigned or other conditions */}
                {!userBadge && (
                    <div className="p-3 text-sm badge badge-neutral">
                        No Badge Yet
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Fade>

      <Fade direction="up" delay={200} triggerOnce>
        <div className="p-6 border border-gray-200 rounded-lg shadow-xl card bg-base-100 sm:p-8">
          <h3 className="mb-4 text-2xl font-bold text-center text-secondary-focus">My 3 Recent Posts</h3>
          {recentPosts.length === 0 ? (
            <p className="text-lg text-center text-gray-600">You haven't made any posts yet.</p>
          ) : (
            <ul className="space-y-4">
              {recentPosts.map((post) => (
                <li key={post._id} className="p-4 bg-base-200 rounded-lg shadow-sm border border-gray-100 transform transition-transform duration-200 hover:scale-[1.01] hover:shadow-md">
                  <h4 className="mb-1 text-lg font-bold text-neutral-content">{post.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{post.tag && <span className="mr-2 badge badge-outline badge-sm">{post.tag}</span>}</span>
                    <span>Votes: {post.upVote - post.downVote}</span> {/* Display net votes */}
                    <span>Comments: {post.commentCount || 0}</span> {/* Add commentCount */}
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Fade>
    </div>
  );
};

export default UserProfile;