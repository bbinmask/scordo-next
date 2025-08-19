"use client";
import { ChevronRight, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";

interface ArticleProp {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  url: string;
}

export default function NewsList() {
  const [articles, setArticles] = useState<ArticleProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockNews = [
          {
            id: "1",
            title: "Scientists Discover New Exoplanet with Potential for Life",
            description:
              "Astronomers have announced the discovery of a new exoplanet, Kepler-186f, which orbits within the habitable zone of its star, raising hopes for extraterrestrial life.",
            imageUrl: "https://placehold.co/600x400/A78BFA/FFFFFF?text=Exoplanet",
            source: "SpaceToday",
            publishedAt: "2025-06-03T10:30:00Z",
            url: "#",
          },
          {
            id: "2",
            title: "Global Markets React to Unexpected Interest Rate Hike",
            description:
              "Stock markets worldwide experienced significant volatility today after central banks announced an unscheduled increase in interest rates, impacting various sectors.",
            imageUrl: "https://placehold.co/600x400/60A5FA/FFFFFF?text=Markets",
            source: "FinancialTimes",
            publishedAt: "2025-06-03T09:15:00Z",
            url: "#",
          },
          {
            id: "3",
            title: "Breakthrough in AI Leads to Advanced Medical Diagnostics",
            description:
              "A new artificial intelligence model has shown unprecedented accuracy in diagnosing early-stage diseases, promising a revolution in healthcare.",
            imageUrl: "https://placehold.co/600x400/4ADE80/FFFFFF?text=AI+Health",
            source: "TechInnovate",
            publishedAt: "2025-06-02T18:00:00Z",
            url: "#",
          },
          {
            id: "4",
            title: "New Study Links Climate Change to Extreme Weather Events",
            description:
              "A comprehensive report released by the UN confirms a strong correlation between rising global temperatures and the increasing frequency and intensity of extreme weather phenomena.",
            imageUrl: "https://placehold.co/600x400/FCD34D/FFFFFF?text=Climate",
            source: "EcoWatch",
            publishedAt: "2025-06-02T14:45:00Z",
            url: "#",
          },
          {
            id: "5",
            title: "Cultural Festival Draws Record Crowds in Downtown City",
            description:
              "The annual cultural festival concluded yesterday, attracting over a million visitors and showcasing diverse arts, music, and culinary traditions from around the globe.",
            imageUrl: "https://placehold.co/600x400/FB923C/FFFFFF?text=Festival",
            source: "CityHerald",
            publishedAt: "2025-06-01T20:00:00Z",
            url: "#",
          },
        ];
        setArticles(mockNews);
      } catch (err) {
        // Set error state if data fetching fails.
        setError("Failed to load news. Please try again later.");
        console.error("Error fetching news:", err);
      } finally {
        // Set loading to false once data is fetched or an error occurs.
        setLoading(false);
      }
    };

    fetchNews();
  }, []); // Empty dependency array means this effect runs once on component mount.

  // Display loading indicator while data is being fetched.
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-4 text-lg text-gray-700">Loading news...</p>
      </div>
    );
  }

  // Display error message if data fetching failed.
  if (error) {
    return (
      <div className="p-8 text-center text-lg font-semibold text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  // Render the list of news cards if data is available.
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {articles.map((article: ArticleProp) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function NewsCard({ article }: { article: ArticleProp }) {
  // Destructure properties from the article object.
  const { title, description, imageUrl, source, publishedAt, url } = article;

  // Format the published date for better readability.
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none"
    >
      {/* Article Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
          <span className="text-sm font-semibold">{source}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-5">
        <h3 className="mb-2 text-xl leading-tight font-semibold text-gray-800">{title}</h3>
        <p className="mb-4 line-clamp-3 text-sm text-gray-600">{description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formattedDate}</span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800">
            Read More
            <svg
              className="ml-1 h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

export const NewList = () => {
  const newsItems = [
    {
      title: "Historic Win: Team Alpha clinches the championship",
      category: "Tournaments",
      time: "4h ago",
    },
    {
      title: "Player Spotlight: Jane Doe's rise to stardom",
      category: "Interviews",
      time: "1d ago",
    },
    { title: "Upcoming Rule Changes for the Next Season", category: "Updates", time: "2d ago" },
  ];
  return (
    <div className="space-y-4">
      {newsItems.map((item, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800"
        >
          <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
            <Newspaper className="h-6 w-6 text-gray-500 dark:text-gray-300" />
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
            <div className="mt-1 flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{item.category}</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{item.time}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
      ))}
    </div>
  );
};
