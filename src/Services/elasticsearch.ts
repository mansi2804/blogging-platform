export async function indexPost(postId: string, postData: any) {
  try {
    console.log("Indexing post to Elasticsearch:", postId, postData);
    const response = await fetch(`http://localhost:9200/posts/_doc/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`Error indexing post: ${response.statusText} - ${JSON.stringify(responseData)}`);
    }
    console.log(`Post ${postId} indexed successfully`, responseData);
  } catch (error) {
    console.error("Error indexing post in Elasticsearch:", error);
  }
}

export async function searchPosts(query: string) {
  try {
    const response = await fetch(`http://localhost:9200/posts/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: {
          multi_match: {
            query: query,
            fields: ["title", "description", "category"],
          },
        },
      }),
    });
    const data = await response.json();
    const hits = data.hits.hits;
    return hits.map((hit: any) => hit._source);
  } catch (error) {
    console.error("Error searching posts in Elasticsearch:", error);
    return [];
  }
}