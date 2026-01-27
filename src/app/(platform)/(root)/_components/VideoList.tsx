import { PlayCircle } from "lucide-react";

export const VideoList = () => {
  const videoItems = [
    {
      title: "Match Highlights: IND vs AUS",
      duration: "5:42",
      thumbnail: "https://placehold.co/600x400/34D399/FFFFFF?text=Highlights",
    },
    {
      title: "Classic Catches Compilation",
      duration: "8:15",
      thumbnail: "https://placehold.co/600x400/FBBF24/FFFFFF?text=Catches",
    },
    {
      title: "Behind the Scenes: Training Day",
      duration: "12:30",
      thumbnail: "https://placehold.co/600x400/60A5FA/FFFFFF?text=BTS",
    },
  ];

  return (
    <>
      {videoItems.map((video, i) => (
        <div
          key={i}
          className="hover-card mb-2 flex cursor-pointer space-x-4 rounded-lg bg-gray-50 p-4 duration-300"
        >
          <div className="relative w-28 overflow-hidden rounded-lg shadow-lg transition-shadow duration-300">
            <img src={video.thumbnail} alt={video.title} className="w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <PlayCircle className="z-[999] h-6 w-6 text-white/80" />
            </div>
            <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1 py-0.5 font-[poppins] text-[10px] font-medium text-white">
              {video.duration}
            </span>
          </div>
          <h3 className="mt-3 text-base font-medium text-gray-800 lg:text-lg dark:text-gray-100">
            {video.title}
          </h3>
        </div>
      ))}
    </>
  );
};
