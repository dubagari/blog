import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, clearError } from "../redux/slices/postsSlice";
import PostCard from "../components/PostCard";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to BlogHub</h1>
          <p className="text-xl mb-6">
            Discover stories, insights, and ideas from writers around the world
          </p>
          {user && (
            <Link
              to="/create"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              ✍️ Start Writing
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <div className="space-x-2">
              <button
                onClick={() => dispatch(fetchPosts())}
                className="underline hover:no-underline"
              >
                Retry
              </button>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow animate-pulse h-96"
              ></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600 mb-4">No posts yet</p>
            {user && (
              <Link
                to="/create"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
              >
                Be the first to write
              </Link>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6 text-lg">
              <span className="font-semibold text-gray-800">
                {posts.length}
              </span>{" "}
              amazing posts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
