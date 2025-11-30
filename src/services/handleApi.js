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
  const response = await client.graphql({
    query: getUserById,
    variables: {
      id,
    },
    authMode: "usexrPool",
  });
  return response?.data?.getUserById;
};

export const generateIdeasForPostAPI = async (industry) => {
  const response = await client.graphql({
    query: generateIdeasForPost,
    variables: {
      industry,
    },
    authMode: "userPool",
  });
  return response?.data?.generateIdeasForPost;
};

export const generatePostsAPI = async (ideas) => {
  const response = await client.graphql({
    query: generatePosts,
    variables: {
      input: ideas,
    },
    authMode: "userPool",
  });
  return response?.data?.generatePosts;
};

export const createSavedPostAPI = async (input) => {
  const response = await client.graphql({
    query: createSavedPost,
    variables: {
      input,
    },
    authMode: "userPool",
  });
  return response?.data?.createSavedPost;
};

export const getSavedPostByUserIdAPI = async (userId) => {
  const response = await client.graphql({
    query: getSavedPostByUserId,
    variables: {
      userId,
    },
    authMode: "userPool",
  });
  return response?.data?.getSavedPostByUserId?.items;
};
