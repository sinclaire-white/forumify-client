import { FaUsers, FaGlobe, FaTrophy } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen py-16 bg-base-200">
      <div className="container px-4 mx-auto md:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl text-primary">Our Story: A Community Built on Connection</h1>
          
          <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-600">
            Forumify began with a simple idea: to create a dedicated space where people can connect, share knowledge, and explore passions without distraction. We built Forumify to be a modern forum where genuine conversations thrive.
          </p>
        </div>

        {/* Why Forumify Section */}
        <div className="grid grid-cols-1 gap-8 mt-12 text-center md:grid-cols-3">
          {/* Card 1 */}
          <div className="p-8 transition-shadow duration-300 bg-white shadow-lg card rounded-xl hover:shadow-2xl">
            <div className="flex justify-center mb-4 text-primary">
              <FaGlobe className="text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-primary">Tailored for You</h2>
            
            <p className="mt-2 text-gray-600">
              Our platform is designed for effortless navigation. Find what you're looking for with our smart search, powered by custom tags.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 transition-shadow duration-300 bg-white shadow-lg card rounded-xl hover:shadow-2xl">
            <div className="flex justify-center mb-4 text-secondary">
              <FaUsers className="text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-primary">Empowering Community</h2>
            
            <p className="mt-2 text-gray-600">
              We empower you with features that encourage interaction, like upvoting and downvoting, detailed post pages, and a clear, organized space for comments.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 transition-shadow duration-300 bg-white shadow-lg card rounded-xl hover:shadow-2xl">
            <div className="flex justify-center mb-4 text-accent">
              <FaTrophy className="text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-primary">Rewarding Engagement</h2>
            
            <p className="mt-2 text-gray-600">
              Earn <strong className="font-bold text-primary">Bronze</strong> and <strong className="font-bold text-primary">Gold</strong> badges for your contributions, showcasing your dedication and expertise. We're here to celebrate your growth with you.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          {/* Fix: Changed text-neutral-content to a more visible color */}
          <p className="text-lg text-gray-600">
            Join us in building a community where every voice is heard and every contribution matters.
          </p>
          {/* Example button for a "Join" or "Explore" call to action */}
          <a href="/register" className="mt-4 btn btn-primary btn-lg">Get Started Now</a>
        </div>
      </div>
    </div>
  );
};

export default About;