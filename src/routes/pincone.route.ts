import express from "express"
import pineconeController from "../controllers/pinecone.controller"
const PineconeRoute = express.Router()


PineconeRoute.get("/processAllSubjectSetting",
    pineconeController.processAllSubjectSetting
)

PineconeRoute.post("/teacherRecommend",
    pineconeController.teacherRecommendation
)

export default PineconeRoute
