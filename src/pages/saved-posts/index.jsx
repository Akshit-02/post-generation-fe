import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SavedPostCard from "../../components/partials/SavedPostCard";
import { getSavedPostByUserIdAPI } from "../../services/handleApi";
import { getMediaUrl } from "../../utils/helper";

const SavedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    setLoading(true);

    try {
      const user = await getCurrentUser();
      const response = await getSavedPostByUserIdAPI(user.username);

      setPosts(response || []);
    } catch (err) {
      console.error("Error fetching saved posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPost = async (post, index) => {
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
      link.download = `saved-post-${index + 1}.jpg`;
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
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-gray-600 mt-4">Loading saved posts...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Saved Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No posts match your search criteria"
                : "Start generating and saving posts to see them here"}
            </p>
            {!searchTerm && (
              <a
                href="/generate"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
              >
                Generate Posts
              </a>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {posts.map((post, idx) => (
              <SavedPostCard
                key={post.id || idx}
                post={post}
                index={idx}
                onDownload={() => handleDownloadPost(post, idx)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedPostsPage;
