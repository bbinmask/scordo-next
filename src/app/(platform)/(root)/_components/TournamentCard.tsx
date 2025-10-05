import { ArrowRight, Calendar, MapPin } from "lucide-react";

const TournamentCard = ({ tournament }: any) => (
  <div className="group transform overflow-hidden rounded-xl border border-white/20 bg-white/30 shadow-lg backdrop-blur-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-white/10">
    <div className="relative">
      <img
        src={tournament.banner}
        alt={tournament.title}
        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <h3 className="absolute bottom-3 left-4 text-xl font-extrabold tracking-tight text-white">
        {tournament.title}
      </h3>
    </div>
    <div className="p-4">
      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
        <MapPin className="mr-2 h-4 w-4 text-yellow-500" />
        <span>{tournament.location}</span>
      </div>
      <div className="mt-1 flex items-center text-sm text-gray-700 dark:text-gray-300">
        <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
        <span>{tournament.dates}</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
          Entry: {tournament.entryFee}
        </span>
        <button className="flex items-center text-sm font-bold text-gray-800 transition-colors hover:text-green-500 dark:text-white dark:hover:text-green-400">
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

export default TournamentCard;
