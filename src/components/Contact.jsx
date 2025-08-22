import React from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for your message. We will get back to you soon.',
    });

    reset();
  };

  return (
    <div className="min-h-screen py-16 bg-base-200">
      <div className="container px-4 mx-auto md:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl text-primary">Contact Us</h1>
         
          <p className="max-w-3xl mx-auto mt-4 text-base-content">
            We'd love to hear from you. Your feedback is what helps us make Forumify a better place for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 p-8 shadow-lg bg-base-300 lg:grid-cols-2 md:p-12 rounded-xl">
          {/* Contact Information Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Get in touch</h2>
            
            <p className="text-gray-600">
              Fill out the form below or reach out to us through our contact channels.
            </p>
            {/* Fix: Changed text-primary-content to a more visile color */}
            <div className="space-y-4 text-gray-600">
              <p><strong>General Inquiries:</strong> <a href="mailto:support@forumify.com" className="link link-hover">support@forumify.com</a></p>
              <p><strong>Partnerships:</strong> <a href="mailto:partnerships@forumify.com" className="link link-hover">partnerships@forumify.com</a></p>
              <p><strong>Report an Issue:</strong> <a href="mailto:report@forumify.com" className="link link-hover">report@forumify.com</a></p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-primary">Connect With Us</h3>
              <div className="flex mt-4 space-x-4 text-3xl">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 transition-colors duration-300 hover:text-blue-800">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 transition-colors duration-300 hover:text-blue-600">
                  <FaTwitter />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 transition-colors duration-300 hover:text-blue-900">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="block w-full mt-1 input input-bordered"
                />
                {errors.name && <span className="mt-1 text-sm text-error">{errors.name.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="block w-full mt-1 input input-bordered"
                />
                {errors.email && <span className="mt-1 text-sm text-error">{errors.email.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  {...register("subject", { required: "Subject is required" })}
                  className="block w-full mt-1 input input-bordered"
                />
                {errors.subject && <span className="mt-1 text-sm text-error">{errors.subject.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows="4"
                  className="block w-full mt-1 textarea textarea-bordered"
                ></textarea>
                {errors.message && <span className="mt-1 text-sm text-error">{errors.message.message}</span>}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;