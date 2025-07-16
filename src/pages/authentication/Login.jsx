import { Link, useNavigate } from "react-router"; 
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";

const Login = () => {
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1. Login with Firebase
      const result = await loginUser(data.email, data.password);
      // console.log("Firebase login successful:", result.user.email); // Keep for debugging, remove for production

      // 2. Get Firebase ID token
      const idToken = await result.user.getIdToken();
      // console.log("ID token obtained:", idToken ? "Yes" : "No"); // Keep for debugging

      // 3. Exchange for JWT
      // Make sure your backend expects 'firebaseToken' here if you changed it in Register
      const jwtRes = await axios.post("/jwt", { token: idToken });
      // console.log("JWT response:", jwtRes.data); // Keep for debugging

      // 4. Store JWT in localStorage
      localStorage.setItem("access-token", jwtRes.data.token);

      Swal.fire({
        icon: "success",
        title: "Logged in!",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      // console.error("Error response:", err.response?.data); // Keep for debugging

      let errorMessage = "Login failed! Please check your credentials.";
      if (err.code === 'auth/invalid-credential') { // Common Firebase error for wrong email/password
        errorMessage = "Invalid email or password. Please try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 1. Login with Google
      const result = await signInWithGoogle();

      const name = result.user.displayName || "Google User";
      const photoURL = result.user.photoURL || "https://via.placeholder.com/150";

      const userData = {
        name: name,
        email: result.user.email,
        photo: photoURL,
        role: "user",
        badge: "bronze", // Ensure bronze badge for all new registrations/logins
      };

      // 2. Save/update user in database (robust check for existing user)
      const existingUserResponse = await axios.get(`/users?email=${result.user.email}`);
      if (existingUserResponse.data.length === 0) {
        // If user doesn't exist, create a new one
        await axios.post("/users", userData);
      } else {
        // If user exists, update their profile details (like name/photo/badge) if they changed
        await axios.patch(`/users/${existingUserResponse.data[0]._id}`, {
            name: name,
            photo: photoURL,
            badge: "bronze" // Ensure badge is bronze on subsequent logins too
        });
      }

      // 3. Get Firebase ID token and exchange for JWT
      const idToken = await result.user.getIdToken();
      // Make sure your backend expects 'firebaseToken' here if you changed it
      const jwtRes = await axios.post("/jwt", { token: idToken });

      // 4. Store JWT in localStorage
      localStorage.setItem("access-token", jwtRes.data.token);

      Swal.fire({
        icon: "success",
        title: "Logged in!",
        text: "Welcome back with Google!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
      let errorMessage = "Google login failed!";
      if (err.message) {
        errorMessage = err.message;
      }
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md shadow-xl card bg-base-100">
        <div className="card-body">
          <h2 className="mb-4 text-2xl font-bold text-center">Login to Forumify</h2> {/* Added mb-4 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> {/* Increased space-y */}
            {/* Email Field with Floating Label */}
            <div className="relative w-full">
              <input
                type="email"
                id="login-email" 
                placeholder=" "
                className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                {...register("email", { required: "Email is required" })}
              />
              <label
                htmlFor="login-email"
                className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500
                transition-all z-10 bg-base-100
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
              >
                Email
              </label>
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}

            {/* Password Field with Floating Label */}
            <div className="relative w-full">
              <input
                type="password"
                id="login-password" 
                placeholder=" "
                className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                {...register("password", { required: "Password is required" })}
              />
              <label
                htmlFor="login-password"
                className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500
                transition-all z-10 bg-base-100
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
              >
                Password
              </label>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}

            <button type="submit" className="w-full mt-3 btn btn-primary"> {/* Adjusted margin-top */}
              Login
            </button>
          </form>

          <div className="divider">OR</div>
          <button
            onClick={handleGoogleLogin}
            className="w-full btn btn-outline"
          >
            Continue with Google
          </button>

          <p className="mt-2 text-sm text-center">
            New here?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;