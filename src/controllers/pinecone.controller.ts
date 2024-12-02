import { Request, Response } from "express"
import EmbeddingPinecone from "../tools/embeddingPinecone"

const processAllSubjectSetting = async (req: Request, res: Response) => {
  try {
    const response = await EmbeddingPinecone.processAllSubjectSettings()
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const teacherRecommendation = async (req: Request, res: Response) => {
  try {
    const response = await EmbeddingPinecone.teacherRecommendation(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const teacherRecommendationByLearnHistory = async (req: Request, res: Response) => {
  try {
    const response = await EmbeddingPinecone.teacherRecommendationByLearnHistory(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}
const PineconeController = {
  processAllSubjectSetting,
  teacherRecommendation,
  teacherRecommendationByLearnHistory
}

export default PineconeController
