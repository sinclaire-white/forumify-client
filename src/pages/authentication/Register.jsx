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
  } = useForm();

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

      // 3. Save user to database
      const newUser = {
        name: name,
        email: res.user.email,
        photo: photoURL,
        role: "user", // Assign bronze badge on registration
        badge: "bronze",
      };

      // Check if user already exists in your DB before saving
      // This is important for social logins where a user might sign in multiple times
      // For email/password, Firebase won't create a duplicate, but the DB check is good for robustness.
      const existingUser = await axios.get(`/users?email=${res.user.email}`);
      if (existingUser.data.length === 0) {
        await axios.post("/users", newUser);
      } else {
        // Optionally update existing user's Firebase details in your DB if needed
        
        await axios.patch(`/users/${existingUser.data[0]._id}`, { 
            name: name,
            photo: photoURL,
            badge: "bronze" // Ensure badge is bronze on re-login/re-register
        });
      }


      // 4. Get Firebase ID token
      const idToken = await res.user.getIdToken();

      // 5. Send token to backend to get JWT
       const jwtRes = await axios.post("/jwt", { token: idToken }); 

      // 6. Save JWT in localStorage
      localStorage.setItem("access-token", jwtRes.data.token);

      Swal.fire("Success!", "Registered Successfully!", "success");
      reset();
      navigate("/");
    } catch (err) {
      console.error("Registration Error:", err); // Log the full error for debugging
      // Firebase specific error handling
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

      const name = result.user.displayName || "Google User"; // fallback if name is missing
      const photoURL = result.user.photoURL || "https://via.placeholder.com/150"; // Fallback photo URL

      const newUser = {
        name: name,
        email: result.user.email,
        photo: photoURL,
        role: "user",
        badge: "bronze",
      };

      // Check if user already exists in your DB to avoid duplicates on social login
      const existingUser = await axios.get(`/users?email=${result.user.email}`);
      if (existingUser.data.length === 0) {
        await axios.post("/users", newUser);
      } else {
        // If user exists, just update their info if needed, ensure badge
        await axios.patch(`/users/${existingUser.data[0]._id}`, {
            name: name,
            photo: photoURL,
            badge: "bronze"
        });
      }


      const idToken = await result.user.getIdToken();
       const jwtRes = await axios.post("/jwt", { token: idToken });

      localStorage.setItem("access-token", jwtRes.data.token);

      Swal.fire("Success!", "Logged in with Google!", "success"); // Success message for social login
      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err); // Log the full error for debugging
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
          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> {/* Increased space-y for better separation */}
            {/* Full Name Field (already correct) */}
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
                id="email" // Must have a unique ID for htmlFor
                placeholder=" "
                className="w-full placeholder-transparent transition-all duration-200 ease-in-out peer input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                {...register("email", { required: "Email is required" })}
              />
              <label
                htmlFor="email" // Link to input's ID
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
                id="password" // Must have a unique ID for htmlFor
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
                htmlFor="password" // Link to input's ID
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
                id="photoURL" // Must have a unique ID for htmlFor
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
                htmlFor="photoURL" // Link to input's ID
                className="absolute left-3 -top-2.5 px-1 text-sm text-gray-500
                transition-all z-10 bg-base-100
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary"
              >
                Photo URL
              </label>
            </div>
            {errors.photoURL && (
              <p className="mt-1 text-sm text-red-500">{errors.photoURL.message}</p>
            )}

            <button type="submit" className="w-full mt-3 btn btn-primary"> {/* Adjusted margin-top for button */}
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
            <Link to="/login" className="text-primary hover:underline"> {/* Added hover underline */}
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;