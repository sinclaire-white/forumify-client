import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
const Login = () => {
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      Swal.fire({
        icon: "success",
        title: "Logged in!",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: "success",
        title: "Logged in!",
        text: "Welcome back with Google!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err) {
      console.error(err.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login to Forumify</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>

          <div className="divider">OR</div>
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full"
          >
            Continue with Google
          </button>

          <p className="text-sm mt-2 text-center">
            New here?{" "}
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
