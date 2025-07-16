import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import useAxios from "../../hooks/useAxios";

const Register = () => {
  const { createUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { 
      name: '',
      email: '',
      password: '',
      photoURL: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const { email, password, photoURL, name } = data;

      // 1. Create Firebase user
      const res = await createUser(email, password);

      // 2. Update Firebase profile
      await updateProfile(res.user, {
        displayName: name,
        photoURL,
      });

      // 3. Save user to database - CHECK PUBLIC ENDPOINT
      const newUser = {
        name: name,
        email: res.user.email,
        photo: photoURL,
        role: "user",
        badge: "bronze",
      };

      const checkUserResponse = await axios.get(`/users/check-email?email=${res.user.email}`);

      if (checkUserResponse.data.exists) {
        // User exists, update their profile (e.g., photo, name, badge)
        
        await axios.patch(`/users/${checkUserResponse.data.user._id}`, {
          name: name,
          photo: photoURL,
          badge: "bronze" // Ensure badge is bronze
        });
      } else {
        // User does not exist, create new
        await axios.post("/users", newUser);
      }

      // 4. Get Firebase ID token
      const idToken = await res.user.getIdToken();

      // 5. Send token to backend to get JWT
      const jwtRes = await axios.post("/jwt", { token: idToken }); // Corrected to 'token'

      // 6. Save JWT in localStorage
      localStorage.setItem("access-token", jwtRes.data.token);

      Swal.fire("Success!", "Registered Successfully!", "success");
      reset();
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err);
      let errorMessage = "Registration failed!";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();

      const name = result.user.displayName || "Google User";
      const photoURL = result.user.photoURL || "https://via.placeholder.com/150";

      const newUser = {
        name: name,
        email: result.user.email,
        photo: photoURL,
        role: "user",
        badge: "bronze",
      };

      // Check if user already exists in your DB using the public endpoint
      const checkUserResponse = await axios.get(`/users/check-email?email=${result.user.email}`);
      if (checkUserResponse.data.exists) {
        // If user exists, update their details
        await axios.patch(`/users/${checkUserResponse.data.user._id}`, {
          name: name,
          photo: photoURL,
          badge: "bronze"
        });
      } else {
        // If user doesn't exist, create a new one
        await axios.post("/users", newUser);
      }

      const idToken = await result.user.getIdToken();
      const jwtRes = await axios.post("/jwt", { token: idToken }); // Corrected to 'token'

      localStorage.setItem("access-token", jwtRes.data.token);

      Swal.fire("Success!", "Logged in with Google!", "success");
      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
      let errorMessage = "Google login failed!";
      if (err.message) {
        errorMessage = err.message;
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md shadow-xl card bg-base-100">
        <div className="card-body">
          <h2 className="mb-4 text-2xl font-bold text-center">
            Register to Forumify
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <div className="relative w-full">
              <input
                type="text"
                id="name"
                placeholder=" "
                {...register("name", { required: "Name is required" })}
                className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <label
                htmlFor="name"
                className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500
                transition-all z-10 bg-base-100
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
              >
                Full Name
              </label>
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}

            {/* Email Field */}
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                {...register("email", { required: "Email is required" })}
              />
              <label
                htmlFor="email"
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

            {/* Password Field */}
            <div className="relative w-full">
              <input
                type="password"
                id="password"
                placeholder=" "
                className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long"
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{6,}$/,
                    message: "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special character.",
                  },
                })}
              />
              <label
                htmlFor="password"
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

            {/* Photo URL Field */}
            <div className="relative w-full">
              <input
                type="text"
                id="photoURL"
                placeholder=" "
                className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                {...register("photoURL", {
                    pattern: {
                        value: /^(ftp|http|https):\/\/[^ "]+$/,
                        message: "Please enter a valid URL."
                    }
                })}
              />
              <label
                htmlFor="photoURL"
                className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500
                transition-all z-10 bg-base-100
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
              >
                Photo URL (Optional)
              </label>
            </div>
            {errors.photoURL && (
              <p className="mt-1 text-sm text-red-500">{errors.photoURL.message}</p>
            )}

            <button type="submit" className="w-full mt-6 btn btn-primary">
              Register
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
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;