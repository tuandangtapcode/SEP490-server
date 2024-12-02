import { Pinecone } from "@pinecone-database/pinecone"

// Initialize Pinecone client
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })

// Replace "INDEX_NAME" and "INDEX_HOST" with your actual index name and host
const index = pinecone.index(process.env.PINECONE_INDEX_NAME!, process.env.PINECONE_INDEX_HOST!)

const upsertVector = async (
  id: string,
  namespace: string,
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
    ]
    // Upsert the vector into the Pinecone index
    await index.namespace(namespace).upsert(vectors)

  } catch (error) {
    throw error
  }
}


const updateVector = async (
  id: string,
  namespace: string,
  values: number[],
): Promise<void> => {
  try {
    await index.namespace(namespace).update(
      {
        id: id,
        values: values
      }
    )
  } catch (error) {
    throw error
  }
}


const deleteVector = async (
  id: string,
  namespace: string
): Promise<void> => {
  try {
    await index.namespace(namespace).deleteOne(id)
  } catch (error) {
    throw error
  }
}

const searchPineconeByQuery = async (queryEmbedding: number[]) => {
  const result = await index.namespace('teacher').query({
    vector: queryEmbedding,
    topK: 15,
  })

  return result.matches// Array of the closest matches
}

const PineconeService = {
  upsertVector,
  searchPineconeByQuery,
  updateVector,
  deleteVector
}

export default PineconeService
