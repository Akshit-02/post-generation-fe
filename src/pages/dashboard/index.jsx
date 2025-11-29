import { useState } from "react";
import {
  createSavedPostAPI,
  generateIdeasForPostAPI,
  generatePostsAPI,
} from "../../services/handleApi";
import { getMediaUrl } from "../../utils/helper";
import { getCurrentUser } from "aws-amplify/auth";

const DashboardPage = () => {
  const [industry, setIndustry] = useState("Healthcare");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);

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
        setSelectedPosts([]);
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

  const handleSelectPost = (index) => {
    setSelectedPosts((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAllPosts = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((_, idx) => idx));
    }
  };

  const handleSaveAll = async () => {
    if (selectedPosts.length === 0) {
      alert("Please select at least one post to save");
      return;
    }

    setLoading(true);
    try {
      const userId = await getCurrentUser();

      const savePromises = selectedPosts.map(async (idx) => {
        const post = posts[idx];
        return await createSavedPostAPI({
          userId: userId.username,
          idea: post.idea,
          hook: post.hook,
          story: post.story,
          visualText: post.visualText,
          imagePrompt: post.imagePrompt,
          caption: post.caption,
          imageUrl: post.imageUrl,
        });
      });

      await Promise.all(savePromises);
      alert(`Successfully saved ${selectedPosts.length} post(s)!`);

      setSelectedPosts([]);
    } catch (error) {
      console.error("Error saving posts:", error);
      alert("Failed to save some posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (selectedPosts.length === 0) {
      alert("Please select at least one post to download");
      return;
    }

    for (const idx of selectedPosts) {
      await handleDownloadPost(idx);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  const handleSavePost = async (index) => {
    const post = posts[index];

    setLoading(true);
    try {
      const userId = await getCurrentUser();

      await createSavedPostAPI({
        userId: userId.username,
        idea: post.idea,
        hook: post.hook,
        story: post.story,
        visualText: post.visualText,
        imagePrompt: post.imagePrompt,
        caption: post.caption,
        imageUrl: post.imageUrl,
      });

      alert(`Post ${index + 1} saved successfully!`);
    } catch (error) {
      console.error("Error saving post:", error);
      alert(`Failed to save post ${index + 1}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPost = async (index) => {
    const post = posts[index];

    if (!post.imageUrl) {
      alert(`Post ${index + 1} has no image to download`);
      return;
    }

    try {
      const imageUrl = getMediaUrl(post.imageUrl);

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `instagram-post-${index + 1}.jpg`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert(`Failed to download post ${index + 1}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
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
                {s < 3 && (
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
          </div>
        </div>

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
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                disabled={loading}
              >
                <option value="">Select an industry...</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Marketing">Marketing</option>
                <option value="E-commerce">E-commerce</option>
              </select>
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

        {step === 2 && ideas.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Step 2: Select Ideas
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-medium bg-purple-100 px-4 py-2 rounded-full">
                  {selectedIdeas.length} of {ideas.length} selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
                >
                  {selectedIdeas.length === ideas.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <div>
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-6 max-h-[600px] overflow-y-auto p-2">
              {ideas.map((idea, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectIdea(idx)}
                  className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                    selectedIdeas.includes(idx)
                      ? "border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg transform scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  <div className="absolute top-3 right-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedIdeas.includes(idx)
                          ? "bg-purple-600 border-purple-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selectedIdeas.includes(idx) && (
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

                  <div className="inline-block bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Idea #{idx + 1}
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-3 pr-8 leading-snug">
                    {idea.idea}
                  </h3>

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
              ))}
            </div>

            <button
              onClick={handleGeneratePosts}
              disabled={loading || selectedIdeas.length === 0}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-lg shadow-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Instagram Posts...
                </>
              ) : (
                <>
                  Generate {selectedIdeas.length} Instagram Post
                  {selectedIdeas.length !== 1 ? "s" : ""}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {step === 3 && posts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  🎉 {posts.length} Instagram Post
                  {posts.length !== 1 ? "s" : ""} Ready!
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedPosts.length} of {posts.length} selected
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAllPosts}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors"
                >
                  {selectedPosts.length === posts.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            {selectedPosts.length > 0 && (
              <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-purple-900">
                    {selectedPosts.length} post
                    {selectedPosts.length !== 1 ? "s" : ""} selected
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveAll}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center shadow-md"
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
                        <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                      </svg>
                      Save All
                    </button>

                    <button
                      onClick={handleDownloadAll}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors flex items-center shadow-md"
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
                      Download All
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white border-2 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                    selectedPosts.includes(idx)
                      ? "border-purple-500 ring-2 ring-purple-300 transform scale-[1.02]"
                      : "border-gray-200 hover:shadow-2xl hover:-translate-y-1"
                  }`}
                >
                  <div className="absolute top-3 right-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPost(idx);
                      }}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
                        selectedPosts.includes(idx)
                          ? "bg-purple-600 border-purple-600"
                          : "bg-white border-gray-300 hover:border-purple-400"
                      }`}
                    >
                      {selectedPosts.includes(idx) && (
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

                  <div className="flex items-center px-4 py-3 border-b border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      N2I
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        News2Insta
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="5" r="1.5"></circle>
                        <circle cx="12" cy="12" r="1.5"></circle>
                        <circle cx="12" cy="19" r="1.5"></circle>
                      </svg>
                    </button>
                  </div>

                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                    {post.imageUrl ? (
                      <img
                        src={getMediaUrl(post.imageUrl)}
                        alt={`Post ${idx + 1}`}
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
                          <p className="text-xs text-gray-500 font-medium">
                            Image generating...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
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
                          <p className="text-sm font-semibold text-gray-900">
                            1,234
                          </p>
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
                          <p className="text-sm font-semibold text-gray-900">
                            1,234
                          </p>
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
                          <p className="text-sm font-semibold text-gray-900">
                            1,234
                          </p>
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

                  <div className="px-4 py-3 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold mr-2">News2Insta</span>
                      <span className="text-gray-800 whitespace-pre-line">
                        {post.caption}
                      </span>
                    </p>
                  </div>

                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSavePost(idx)}
                        className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 font-medium text-xs transition-all flex items-center justify-center shadow-sm"
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
                        onClick={() => handleDownloadPost(idx)}
                        className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 font-medium text-xs transition-all flex items-center justify-center shadow-sm"
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
              ))}
            </div>

            <button
              onClick={() => {
                setStep(1);
                setIdeas([]);
                setSelectedIdeas([]);
                setPosts([]);
                setSelectedPosts([]);
                setError(null);
              }}
              className="w-full mt-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              ← Start New Automation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
