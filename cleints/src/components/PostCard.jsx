import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../redux/slices/postsSlice";
import { formatDate } from "../utils/helpers";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthor = user && post.author && user._id === post.author._id;
  const truncateContent = (content, length = 150) => {
    return content.length > length
      ? content.substring(0, length) + "..."
      : content;
  };

  const likeCount = Array.isArray(post.likes)
    ? post.likes.length
    : Number(post.likes) || 0;

  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!window.confirm("Delete this post?")) {
      return;
    }

    dispatch(deletePost(post._id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer h-full relative">
      {isAuthor && (
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
          <Link
            to={`/edit/${post._id}`}
            className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
      <Link to={`/post/${post._id}`}>
        {post.image && (
          <div className="h-48 overflow-hidden bg-gray-200">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
      </Link>
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          {truncateContent(post.content)}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-700">{post.author?.name}</p>
            <p>{formatDate(post.createdAt)}</p>
          </div>
          <div className="flex items-center space-x-1 bg-red-100 px-3 py-1 rounded-full">
            <span>❤️</span>
            <span className="text-red-600 font-semibold">{likeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
