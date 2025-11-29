import ErrorAlert from "../../common/ErrorAlert";

const IndustrySelector = ({
  industry,
  setIndustry,
  onStart,
  loading,
  error,
}) => {
  const industries = [
    "Healthcare",
    "Technology",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Hospitality",
    "Real Estate",
    "Marketing",
    "E-commerce",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Step 1: Choose Industry
        </h2>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Select or enter industry:
        </label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
          disabled={loading}
        >
          <option value="">Select an industry...</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      <ErrorAlert message={error} />

      <button
        onClick={onStart}
        disabled={loading || !industry}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? "Generating Ideas..." : "Start Automation"}
      </button>
    </div>
  );
};

export default IndustrySelector;
