export const getUserById = /* GraphQL */ `
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      id
      email
      igAccountId
      username
      name
      instagramRefreshToken
      instagramRefreshTokenUpdatedAt
      createdAt
      updatedAt
    }
  }
`;

export const generateIdeasForPost = /* GraphQL */ `
  query generateIdeasForPost($industry: String!) {
    generateIdeasForPost(industry: $industry) {
      success
      message
      ideas {
        idea
        hook
        story
        visualText
        imagePrompt
      }
    }
  }
`;

export const generatePosts = /* GraphQL */ `
  query generatePosts($input: [GeneratePostsInput]!) {
    generatePosts(input: $input) {
      success
      message
      posts {
        idea
        hook
        story
        visualText
        imagePrompt
        caption
        imageUrl
      }
    }
  }
`;

export const createSavedPost = /* GraphQL */ `
  mutation createSavedPost($input: CreateSavedPostInput!) {
    createSavedPost(input: $input) {
      id
      userId
      idea
      hook
      story
      visualText
      imagePrompt
      caption
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

export const getSavedPostByUserId = /* GraphQL */ `
  query getSavedPostByUserId($userId: String!) {
    getSavedPostByUserId(userId: $userId) {
      items {
        id
        userId
        idea
        hook
        story
        visualText
        imagePrompt
        caption
        imageUrl
        createdAt
        updatedAt
      }
    }
  }
`;
