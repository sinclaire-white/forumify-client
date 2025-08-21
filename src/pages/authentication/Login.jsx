import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios"; 
import useAxiosSecure from "../../hooks/useAxiosSecure"; 
import Swal from "sweetalert2";
import { FaHome } from "react-icons/fa"; // <-- Home icon

const Login = () => {
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios(); 
  const axiosSecure = useAxiosSecure(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data.email, data.password);
      const idToken = await result.user.getIdToken();
      const jwtRes = await axios.post("/jwt", { token: idToken });
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
      let errorMessage = "Login failed! Please check your credentials.";
      if (err.code === 'auth/invalid-credential') {
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
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      const jwtRes = await axios.post("/jwt", { token: idToken });
      localStorage.setItem("access-token", jwtRes.data.token);
      const name = result.user.displayName || "Google User";
      const photoURL = result.user.photoURL || "https://via.placeholder.com/150";
      const userData = { name, email: result.user.email, photo: photoURL, role: "user", badge: "bronze" };
      const checkUserResponse = await axios.get(`/users/check-email?email=${result.user.email}`);
      if (checkUserResponse.data.exists) {
        await axiosSecure.patch(`/users/${checkUserResponse.data.user._id}`, { 
          name, photo: photoURL, badge: checkUserResponse.data.user.badge || "bronze"
        });
      } else {
        await axios.post("/users", userData);
      }
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
      let errorMessage = err.message || "Google login failed!";
      Swal.fire({ icon: "error", title: "Login Failed", text: errorMessage });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-base-200">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute text-white top-4 left-4 btn btn-circle btn-sm bg-primary hover:bg-primary-focus"
        title="Go Home"
      >
        <FaHome className="w-5 h-5" />
      </button>

      <div className="w-full max-w-md shadow-xl card bg-base-100">
        <div className="card-body">
          <h2 className="mb-4 text-2xl font-bold text-center">Login to Forumify</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
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
                className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
              >
                Email
              </label>
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}

            {/* Password Field */}
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
                className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500 transition-all z-10 bg-base-100
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
              >
                Password
              </label>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}

            <button type="submit" className="w-full mt-6 btn btn-primary">Login</button>
          </form>

          <div className="divider">OR</div>
          <button onClick={handleGoogleLogin} className="w-full btn btn-outline">Continue with Google</button>

          <p className="mt-2 text-sm text-center">
            New here? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
