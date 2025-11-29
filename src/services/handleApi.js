import { generateClient } from "aws-amplify/api";
import {
  createSavedPost,
  generateIdeasForPost,
  generatePosts,
  getSavedPostByUserId,
  getUserById,
} from "./api";

const client = generateClient();

export const getUserByIdAPI = async (id) => {
  try {
    const response = await client.graphql({
      query: getUserById,
      variables: {
        id,
      },
      authMode: "userPool",
    });
    return response?.data?.getUserById;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const generateIdeasForPostAPI = async (industry) => {
  try {
    const response = await client.graphql({
      query: generateIdeasForPost,
      variables: {
        industry,
      },
      authMode: "apiKey",
    });
    return response?.data?.generateIdeasForPost;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const generatePostsAPI = async (ideas) => {
  try {
    const response = await client.graphql({
      query: generatePosts,
      variables: {
        input: ideas,
      },
      authMode: "apiKey",
    });
    return response?.data?.generatePosts;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const createSavedPostAPI = async (input) => {
  try {
    const response = await client.graphql({
      query: createSavedPost,
      variables: {
        input,
      },
      authMode: "apiKey",
    });
    return response?.data?.createSavedPost;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getSavedPostByUserIdAPI = async (userId) => {
  try {
    const response = await client.graphql({
      query: getSavedPostByUserId,
      variables: {
        userId,
      },
      authMode: "apiKey",
    });
    return response?.data?.getSavedPostByUserId;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
