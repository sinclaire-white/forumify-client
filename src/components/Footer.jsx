import { Link } from "react-router"; 
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="border-t bg-base-100 text-base-content border-base-300">
      
      <div className="container grid grid-cols-1 gap-6 px-4 py-10 mx-auto md:grid-cols-4">
        {/* Branding */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-primary"
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
          <h4 className="mb-2 font-semibold">Quick Links</h4>
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
              <Link to="/login" className="hover:text-primary">
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

        {/* New Column: Company Links */}
        <div>
          <h4 className="mb-2 font-semibold">Company</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-2 font-semibold">Contact</h4>
          <p className="text-sm">Email: support@forumify.com</p>
          <p className="text-sm">Phone: +880 1234-567890</p>
          <div className="flex flex-wrap gap-3 mt-3 text-2xl">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaFacebook />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="py-4 text-sm text-center border-t border-base-300 text-base-content/70">
        © {new Date().getFullYear()} Forumify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;