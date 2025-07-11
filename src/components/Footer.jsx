import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-base-100 text-base-content border-t border-base-300">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branding */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-primary"
          >
            <img
              src="https://i.ibb.co/MjGnyfp/Forumify-logo.png"
              alt="Forumify Logo"
              className="w-10 h-10 rounded-full"
            />
            Forumify
          </Link>
          <p className="mt-2 text-sm text-base-content/70">
            The modern forum for vibrant conversations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:text-primary">
                Membership
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-primary">
                Join Us
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">Email: support@forumify.com</p>
          <p className="text-sm">Phone: +880 1234-567890</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a href="#" className="hover:text-primary">
              Facebook
            </a>
            <a href="#" className="hover:text-primary">
              Twitter
            </a>
            <a href="#" className="hover:text-primary">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-base-300 py-4 text-center text-sm text-base-content/70">
        © {new Date().getFullYear()} Forumify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
