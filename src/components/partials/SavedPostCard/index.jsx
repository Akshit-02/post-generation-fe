import { formatDate, getMediaUrl } from "../../../utils/helper";

const SavedPostCard = ({ post, index, onDownload }) => {
  return (
    <div className="relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          N2I
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-gray-900">News2Insta</p>
          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
        {post.imageUrl ? (
          <img
            src={getMediaUrl(post.imageUrl)}
            alt={`Saved post ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-6">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="text-xs text-gray-500 font-medium">No image</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <button className="hover:text-gray-600 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
                <p className="text-sm font-semibold text-gray-900">1,234</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="hover:text-gray-600 transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </button>
                <p className="text-sm font-semibold text-gray-900">1,234</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="hover:text-gray-600 transition-colors rotate-[60deg]">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
                <p className="text-sm font-semibold text-gray-900">1,234</p>
              </div>
            </div>
            <button className="hover:text-gray-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 py-3 max-h-32 overflow-y-auto">
        <p className="text-sm text-gray-900">
          <span className="font-semibold mr-2">News2Insta</span>
          <span className="text-gray-800 whitespace-pre-line">
            {post.caption}
          </span>
        </p>
      </div>

      {/* Post Details */}
      {post.idea && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-purple-700">Idea:</span>{" "}
            {post.idea}
          </p>
        </div>
      )}

      {/* Download Button */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onDownload}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium text-sm transition-all flex items-center justify-center shadow-md"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download Post
        </button>
      </div>
    </div>
  );
};

export default SavedPostCard;
