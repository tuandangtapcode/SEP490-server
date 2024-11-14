import response from "../utils/response"
import { Request } from "express"
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import * as dotenv from 'dotenv'

// const fetch = require('node-fetch');
// const { Headers } = fetch;
// declare global {
//     var fetch: any;
//     var Headers: any;
//   }
//   global.Headers = Headers;
//   global.fetch = fetch;
  dotenv.config()
const ai_key = process.env.API_KEY as string
const genAI = new GoogleGenerativeAI(ai_key);
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
];
  
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        candidateCount: 1,
        temperature: 1.0,
    },
    safetySettings 
});

const fncGenerateText =  async (req: Request) => {
    try {
        const { prompt } = req.body
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        return response(text, false, "tạo câu trả lời thành công", 200)
    } catch (error: any) {
        return response({}, true, error.toString(), 500)
    }
}

const GenerateService = {
    fncGenerateText
}

export default GenerateService