import { getMediaUrl } from "../../../utils/helper";

const InstagramPostCard = ({
  post,
  index,
  isSelected,
  onSelect,
  onSave,
  onDownload,
}) => {
  return (
    <div
      className={`relative bg-white border-2 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isSelected
          ? "border-purple-500 ring-2 ring-purple-300 transform scale-[1.02]"
          : "border-gray-200 hover:shadow-2xl hover:-translate-y-1"
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 right-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
            isSelected
              ? "bg-purple-600 border-purple-600"
              : "bg-white border-gray-300 hover:border-purple-400"
          }`}
        >
          {isSelected && (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          N2I
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-gray-900">News2Insta</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
        {post.imageUrl ? (
          <img
            src={getMediaUrl(post.imageUrl)}
            alt={`Post ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xs text-gray-500 font-medium">
              Image generating...
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
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
            <span className="text-sm font-semibold">1,234</span>
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

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSave}
            className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 font-medium text-xs transition-all flex items-center justify-center"
          >
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Save
          </button>
          <button
            onClick={onDownload}
            className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 font-medium text-xs transition-all flex items-center justify-center"
          >
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramPostCard;
