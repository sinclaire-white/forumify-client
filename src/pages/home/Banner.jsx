import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Banner = () => {
  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-10 lg:max-w-7xl lg:mx-auto">
      
      
      <Swiper
        modules={[Autoplay, ]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        // pagination={{ clickable: true }}
        loop={true}
        className="rounded-lg shadow-lg h-[300px] sm:h-[350px] md:h-[400px] "
      >

        {/* Slide 1 */}
        <SwiperSlide>
          <div className="w-full h-full flex flex-col md:flex-row bg-gray-50">
            <div className="w-full p-6 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Welcome to Forumify
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-6">
                Connect. Share. Grow with meaningful conversations.
              </p>
              <button
                onClick={() => window.location.href = "/discussions"}
                className="self-start px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Browse Discussions
              </button>
            </div>
            <div className="w-full md:w-1/2 h-[200px] md:h-full p-4">
              <img
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Welcome to Forumify"
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="w-full h-full flex flex-col md:flex-row bg-gray-50">
            <div className="w-full p-6 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Be a Contributor
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-6">
                Post your thoughts and inspire others to engage.
              </p>
              <button
                onClick={() => window.location.href = "/create-post"}
                className="self-start px-6 py-2 rounded-lg font-medium bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
              >
                Create First Post
              </button>
            </div>
            <div className="w-full md:w-1/2 h-[200px] md:h-full p-4">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Be a Contributor"
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="w-full h-full flex flex-col md:flex-row bg-gray-50">
            <div className="w-full p-6 md:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Join the Movement
              </h2>
              <p className="text-sm sm:text-base md:text-lg mb-6">
                Unlock exclusive features by becoming a member.
              </p>
              <button
                onClick={() => window.location.href = "/membership"}
                className="self-start px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Upgrade Now
              </button>
            </div>
            <div className="w-full md:w-1/2 h-[200px] md:h-full p-4">
              <img
                src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Join the Movement"
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </SwiperSlide>

      </Swiper>
      
    </div>
  );
};

export default Banner;
