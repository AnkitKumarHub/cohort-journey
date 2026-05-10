import { useState, useEffect } from "react";
import "./App.css";

function formatViews(n) {
  const num = Number(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
  return num.toString();
}

function SkeletonCard() {
  return (
    <div className="card skeleton">
      <div className="sk-thumb" />
      <div className="info">
        <div className="sk-line long" />
        <div className="sk-line medium" />
        <div className="sk-line short" />
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const { id, snippet, statistics } = video.items;
  return (
    <a
      className="card"
      href={`https://youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="thumb-wrap">
        <img src={snippet.thumbnails.medium.url} alt={snippet.title} />
      </div>
      <div className="info">
        <p className="title">{snippet.title}</p>
        <p className="channel">{snippet.channelTitle}</p>
        <p className="meta">{formatViews(statistics.viewCount)} views</p>
      </div>
    </a>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    setLoading(true);
    try {
      async function fetchVideos() {
        const response = await fetch(
          `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=12&sortBy=${sortBy}`,
        );
        const data = await response.json();
        setVideos(data.data.data);
        setTotalPages(data.data.totalPages);
        setLoading(false);
      }
      fetchVideos();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [page, sortBy]);

  const filteredVideos = videos.filter((video) => {
    if (!searchQuery.trim()) return true;
    const title = video.items.snippet.title.toLowerCase();
    const channel = video.items.snippet.channelTitle.toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || channel.includes(query);
  });

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <img src="\icons8-youtube-100.png" alt="" />
          <span className="logo">LOCO</span>{" "}
        </div>
        <div className="search-stack">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search videos or channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button aria-label="Search">
              <img src="/icons8-search-128.png" alt="" />
            </button>
          </div>
        </div>
        <div className="nav-right">
          <label className="sort-label" htmlFor="sortBy">
            Sort
          </label>
          <select
            id="sortBy"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="mostLiked">Most liked</option>
            <option value="mostViewed">Most viewed</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <div className="avatar">P</div>
        </div>
      </nav>

      <div className="app">
        <div className="grid">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
        </div>

        <div className="pagination">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1 || loading}
          >
            ← 
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages || loading}
          >
             →
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
