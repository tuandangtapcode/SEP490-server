import { Request, Response } from "express"
import embeddingPinecone from "../tools/embeddingPinecone"

const processAllSubjectSetting = async (req: Request, res: Response) => {
    try {
      const response = await embeddingPinecone.processAllSubjectSettings()
    } catch (error: any) {
      return res.status(500).json(error.toString())
    }
}

const teacherRecommendation = async (req: Request, res: Response) => {
  try {
    const response = await embeddingPinecone.teacherRecommendation(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const pineconeController = {
  processAllSubjectSetting,
  teacherRecommendation
}

export default pineconeController