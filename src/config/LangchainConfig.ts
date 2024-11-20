import * as dotenv from "dotenv"
dotenv.config()
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    openAIApiKey: process.env.OPENAI_API_KEY, // Lấy API key từ .env
    temperature: 0.7,  // Điều chỉnh mức độ sáng tạo của mô hình
});

export default llm