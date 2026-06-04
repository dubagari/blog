import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPost,
  deletePost,
  toggleLike,
  clearError,
} from "../redux/slices/postsSlice";
import { fetchComments } from "../redux/slices/commentsSlice";
import CommentSection from "../components/CommentSection";
import { formatDate } from "../utils/helpers";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentPost: post,
    loading,
    error,
  } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPost(id));
    dispatch(fetchComments(id));
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    dispatch(deletePost(id)).then(() => navigate("/"));
  };

  const handleLike = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(toggleLike(id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <p className="text-2xl text-red-600 mb-4">
          {error || "Post not found"}
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor =
    user?._id &&
    post.author?._id &&
    user._id.toString() === post.author._id.toString();

  const isLiked =
    user?._id &&
    post.likes?.some((like) => like?.toString() === user._id.toString());

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Posts
        </Link>

        {/* Post Container */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.image && (
            <div className="h-96 overflow-hidden bg-gray-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>

            {/* Post Meta */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    {post.author?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              {/* Author Actions */}
              {isAuthor && (
                <div className="flex space-x-2">
                  <Link
                    to={`/edit/${post._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Post Body */}
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Like Button */}
            <div className="flex items-center space-x-4 py-6 border-t border-b border-gray-200">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center space-x-2 px-6 py-2 rounded transition ${
                  isLiked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                } disabled:opacity-50`}
              >
                <span className="text-2xl">❤️</span>
                <span className="font-semibold">{post.likes?.length || 0}</span>
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <CommentSection postId={id} comments={comments} />
      </div>
    </div>
  );
};

export default PostDetail;
