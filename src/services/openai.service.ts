import { OpenAI } from "openai"
import dotenv from "dotenv"
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const generateEmbedding = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // The model name you want to use
    input: text,
    encoding_format: "float", // Ensure compatibility with Pinecone
  })

  // Assuming response.data contains the embeddings
  return response.data[0].embedding
}

const getRecommendation = async (prompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant recommending teacher in system to users." },
      { role: "user", content: prompt },
    ],
    max_tokens: 300, // Adjust as needed
    temperature: 0.7, // Adjust creativity level
  })

  return response.choices[0]?.message?.content?.trim()
}

const OpenaiService = {
  generateEmbedding,
  getRecommendation
}

export default OpenaiService
