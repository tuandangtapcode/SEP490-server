import express from "express"
import PineconeController from "../controllers/pinecone.controller"

const PineconeRoute = express.Router()

PineconeRoute.get("/processAllSubjectSetting",
  PineconeController.processAllSubjectSetting
)
PineconeRoute.post("/teacherRecommend",
  PineconeController.teacherRecommendation
)

export default PineconeRoute
