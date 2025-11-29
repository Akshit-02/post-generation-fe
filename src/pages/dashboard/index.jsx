import { useState } from "react";
import {
  generateIdeasForPostAPI,
  generatePostsAPI,
} from "../../services/handleApi";
import { getMediaUrl } from "../../utils/helper";

const DashboardPage = () => {
  const [industry, setIndustry] = useState("Healthcare");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [posts, setPosts] = useState([]);

  const handleStartAutomation = async () => {
    if (!industry.trim()) {
      setError("Please enter an industry");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateIdeasForPostAPI(industry);

      if (response.success) {
        setIdeas(response.ideas);
        setSelectedIdeas([]);
        setStep(2);
      } else {
        setError(response.message || "Failed to generate ideas");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while generating ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = (index) => {
    setSelectedIdeas((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIdeas.length === ideas.length) {
      setSelectedIdeas([]);
    } else {
      setSelectedIdeas(ideas.map((_, idx) => idx));
    }
  };

  const handleGeneratePosts = async () => {
    if (selectedIdeas.length === 0) {
      setError("Please select at least one idea");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedIdeasData = selectedIdeas.map((idx) => ideas[idx]);
      const response = await generatePostsAPI(selectedIdeasData);

      if (response.success) {
        setPosts(response.posts);
        setStep(3);
      } else {
        setError(response.message || "Failed to generate posts");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while generating posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Content Automation System
          </h1>
          <p className="text-gray-600">
            Scrape news → Generate ideas → Create Instagram posts
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <>
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                </div>
                {s < 4 && (
                  <div
                    className={`w-48 h-1 mx-2 ${
                      step > s ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Scrape News</span>
            <span>Generate Ideas</span>
            <span>Create Posts</span>
            <span>Download</span>
          </div>
        </div>

        {/* Step 1: Industry Selection */}
        {step === 1 && (
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
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleStartAutomation()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="e.g., Healthcare, AI, Finance, Technology"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleStartAutomation}
              disabled={loading || !industry}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <>Generating Ideas...</> : <>Start Automation</>}
            </button>
          </div>
        )}

        {/* Step 2: Ideas Review with Selection */}
        {step === 2 && ideas.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Step 2: Select Ideas ({selectedIdeas.length}/{ideas.length}{" "}
                selected)
              </h2>
              <button
                onClick={handleSelectAll}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                {selectedIdeas.length === ideas.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 mb-6 max-h-96 overflow-y-auto">
              {ideas.map((idea, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectIdea(idx)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedIdeas.includes(idx)
                      ? "border-purple-600 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIdeas.includes(idx)}
                      onChange={() => handleSelectIdea(idx)}
                      className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {idea.idea}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{idea.hook}</p>
                      <p className="text-sm text-gray-600 mb-2">{idea.story}</p>
                      <p className="text-xs text-gray-500">
                        Visual: {idea.visualText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleGeneratePosts}
              disabled={loading || selectedIdeas.length === 0}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>Creating Instagram posts...</>
              ) : (
                <>Generate Instagram Posts ({selectedIdeas.length} selected)</>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Posts Display */}
        {step === 3 && posts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Step 3: {posts.length} Instagram Posts Ready
                </h2>
              </div>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center">
                Download All
              </button>
            </div>

            <div className="grid gap-6">
              {posts.map((post, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Post {idx + 1}: {post.idea}
                    </h3>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center text-sm">
                      Download
                    </button>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Caption:
                    </h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                      {post.caption}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Image Prompt:
                    </h4>
                    <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {post.imagePrompt}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Use this prompt with DALL-E, Midjourney, or other AI image
                      generators
                    </p>
                  </div>

                  {post.imageUrl && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Generated Image:
                      </h4>
                      <img
                        src={getMediaUrl(post.imageUrl)}
                        alt={`Post ${idx + 1}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setStep(1);
                setIdeas([]);
                setSelectedIdeas([]);
                setPosts([]);
                setError(null);
              }}
              className="w-full mt-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Start New Automation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
