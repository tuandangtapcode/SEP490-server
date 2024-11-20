import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Pinecone client
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Replace "INDEX_NAME" and "INDEX_HOST" with your actual index name and host
const index = pinecone.index(process.env.PINECONE_INDEX_NAME!, process.env.PINECONE_INDEX_HOST!);

export const upsertVector = async (
  id: string,
  values: number[],
  metadata: Record<string, any> = {}
): Promise<void> => {
  try {
    // Prepare the vector data
    const vectors = [
      {
        id, // Unique identifier for the vector
        values, // Embedding values
        metadata, // Optional metadata
      },
    ];
    // Upsert the vector into the Pinecone index
    await index.upsert(vectors);

    console.log(`Successfully upserted vector with id: ${id}`);
  } catch (error) {
    console.error("Error upserting vector:", error);
    throw error;
  }
};

export const searchPinecone = async (queryEmbedding: number[]) => {
  const result = await index.query({
    vector: queryEmbedding,
    topK: 5, // Retrieve the top 5 most similar items
    includeMetadata: true, // Include metadata for recommendation
  });

  return result.matches; // Array of the closest matches
};
