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
          className="my-2 flex w-full cursor-pointer gap-2 rounded-lg p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="relative w-28 overflow-hidden rounded-lg shadow-lg transition-shadow duration-300">
            <img src={video.thumbnail} alt={video.title} className="w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <PlayCircle className="h-16 w-16 text-white/80" />
            </div>
            <span className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              {video.duration}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-bold text-gray-800 dark:text-gray-100">{video.title}</h3>
        </div>
      ))}
    </>
  );
};
