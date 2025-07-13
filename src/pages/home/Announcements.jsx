const announcements = [
  "Platform maintenance on Sunday at 2 PM.",
  "New badge system launched!",
];

const Announcements = () => {
  if (announcements.length === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-yellow-800">
        📢 Announcements
      </h3>
      <ul className="list-disc list-inside text-yellow-900">
        {announcements.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
