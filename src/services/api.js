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
