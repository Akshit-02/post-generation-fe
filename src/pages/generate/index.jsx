// pages/GeneratePage.jsx
import { useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import {
  createSavedPostAPI,
  generateIdeasForPostAPI,
  generatePostsAPI,
} from "../../services/handleApi";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ProgressBar from "../../components/common/ProgressBar";
import IndustrySelector from "../../components/partials/IndustrySelector";
import ErrorAlert from "../../components/common/ErrorAlert";
import IdeaCard from "../../components/partials/IdeaCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import InstagramPostCard from "../../components/partials/InstagramPostCard";
import { getMediaUrl } from "../../utils/helper";

const GeneratePostPage = () => {
  const [industry, setIndustry] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);

  const steps = ["Scrape News", "Generate Ideas", "Create Posts"];

  // ============================================
  // Step 1: Industry Selection
  // ============================================
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

  // ============================================
  // Step 2: Idea Selection
  // ============================================
  const handleSelectIdea = (index) => {
    setSelectedIdeas((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    setSelectedIdeas(
      selectedIdeas.length === ideas.length ? [] : ideas.map((_, idx) => idx)
    );
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

  // ============================================
  // Step 3: Post Management
  // ============================================
  const handleSelectPost = (index) => {
    setSelectedPosts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAllPosts = () => {
    setSelectedPosts(
      selectedPosts.length === posts.length ? [] : posts.map((_, idx) => idx)
    );
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

  const handleReset = () => {
    setStep(1);
    setIdeas([]);
    setSelectedIdeas([]);
    setPosts([]);
    setSelectedPosts([]);
    setError(null);
    setIndustry("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <ProgressBar currentStep={step} steps={steps} />

        {/* Step 1: Industry Selection */}
        {step === 1 && (
          <IndustrySelector
            industry={industry}
            setIndustry={setIndustry}
            onStart={handleStartAutomation}
            loading={loading}
            error={error}
          />
        )}

        {/* Step 2: Ideas Selection */}
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

            <ErrorAlert message={error} />

            <div className="grid md:grid-cols-2 gap-4 mb-6 max-h-[600px] overflow-y-auto p-2">
              {ideas.map((idea, idx) => (
                <IdeaCard
                  key={idx}
                  idea={idea}
                  index={idx}
                  isSelected={selectedIdeas.includes(idx)}
                  onSelect={() => handleSelectIdea(idx)}
                />
              ))}
            </div>

            <button
              onClick={handleGeneratePosts}
              disabled={loading || selectedIdeas.length === 0}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-lg shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-3">Creating Instagram Posts...</span>
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

        {/* Step 3: Posts Display */}
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

            {/* Global Action Bar */}
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
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm transition-colors flex items-center shadow-md"
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

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, idx) => (
                <InstagramPostCard
                  key={idx}
                  post={post}
                  index={idx}
                  isSelected={selectedPosts.includes(idx)}
                  onSelect={() => handleSelectPost(idx)}
                  onSave={() => handleSavePost(idx)}
                  onDownload={() => handleDownloadPost(idx)}
                />
              ))}
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-8 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              ← Start New Automation
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GeneratePostPage;
