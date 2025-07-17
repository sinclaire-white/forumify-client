import { Bounce } from "react-awesome-reveal"; // For animation

const announcements = [
  "Platform maintenance on Sunday, July 20th at 2 PM (GMT+6). Expected downtime: 1 hour.",
  "Exciting new 'Pro Member' badge and features launched! Check your dashboard.",
  "Community Meetup: August 15th! Details coming soon.",
];

const Announcements = () => {
  if (announcements.length === 0) return null;

  return (
    <section className="px-4 py-12 mt-8 md:px-10">
      <div className="max-w-3xl p-6 mx-auto border-l-8 shadow-xl bg-info-content text-info-content rounded-xl border-info">
        <Bounce triggerOnce> {/* Bounce animation for the whole section */}
          <h3 className="mb-4 text-3xl font-bold text-center">
            📢 Latest Announcements
          </h3>
          <ul className="space-y-2 text-lg list-disc list-inside">
            {announcements.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </Bounce>
      </div>
    </section>
  );
};

export default Announcements;