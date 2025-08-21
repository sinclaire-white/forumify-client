import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Fade } from "react-awesome-reveal";
import Swal from "sweetalert2";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const axiosPublic = useAxios();

  const mutation = useMutation({
    mutationFn: async (newEmail) => {
      const res = await axiosPublic.post("/newsletter-subscribe", { email: newEmail });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Subscribed!",
        text: "You have successfully subscribed to our newsletter!",
        showConfirmButton: false,
        timer: 2000,
      });
      setEmail("");
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#EF4444",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <section className="mt-12">
      <Fade triggerOnce>
        <div className="p-8 text-center shadow-lg rounded-xl bg-primary text-primary-content">
          <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Stay Updated!</h2>
          <p className="mb-6 opacity-80">
            Subscribe to our newsletter and never miss an announcement.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-sm input input-lg text-base-content"
              required
            />
            <button
              type="submit"
              className="btn btn-lg btn-secondary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        </div>
      </Fade>
    </section>
  );
};

export default NewsletterSubscription;