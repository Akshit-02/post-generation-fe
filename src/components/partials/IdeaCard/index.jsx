const IdeaCard = ({ idea, index, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg transform scale-[1.02]"
          : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
      }`}
    >
      {/* Selection Badge */}
      <div className="absolute top-3 right-3">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "bg-purple-600 border-purple-600"
              : "bg-white border-gray-300"
          }`}
        >
          {isSelected && (
            <svg
              className="w-4 h-4 text-white"
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
        </div>
      </div>

      {/* Idea Number */}
      <div className="inline-block bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
        Idea #{index + 1}
      </div>

      {/* Main Idea */}
      <h3 className="font-bold text-gray-900 text-lg mb-3 pr-8 leading-snug">
        {idea.idea}
      </h3>

      {/* Hook Section */}
      <div className="mb-3 bg-white bg-opacity-60 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide mt-0.5">
            Hook:
          </span>
          <p className="text-sm text-gray-700 flex-1 leading-relaxed">
            {idea.hook}
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-3 bg-white bg-opacity-60 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide mt-0.5">
            Story:
          </span>
          <p className="text-sm text-gray-700 flex-1 leading-relaxed">
            {idea.story}
          </p>
        </div>
      </div>

      {/* Visual Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide mt-0.5">
            Visual:
          </span>
          <p className="text-xs text-gray-600 flex-1 leading-relaxed">
            {idea.visualText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
