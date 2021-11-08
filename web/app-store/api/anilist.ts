import { AnilistInfo } from "../interface";

export const getAnilistInfo = async (title: string): Promise<AnilistInfo> => {
  var query = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
      Page (page: $page, perPage: $perPage) {
        media (id: $id, search: $search, type: ANIME) {
          id
          title {
            userPreferred
          }
          bannerImage
          description
          genres
          status
          duration
          averageScore
          episodes
          format
          type
          trailer {
            id
          }
        }
      }
    }
  `;

  // Define our query variables and values that will be used in the query request
  var variables = {
    perPage: 1,
    search: title,
  };

  // Define the config we'll need for our Api request
  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
