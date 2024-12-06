import express from "express"
import GenerateController from "../controllers/generate.controller"

const GenerateRouter = express.Router()

GenerateRouter.post('/generateText', GenerateController.generateText)

export default GenerateRouter
