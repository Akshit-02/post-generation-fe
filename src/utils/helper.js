export const getMediaUrl = (key) => {
  return `https://post-generation-dev-media-assets.s3.ap-south-1.amazonaws.com/${key}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
