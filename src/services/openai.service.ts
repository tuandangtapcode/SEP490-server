import { OpenAI } from "openai"
import dotenv from "dotenv"
dotenv.config()
import response from "../utils/response"
import { Request } from "express"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const generateEmbedding = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large", // The model name you want to use
    input: text,
    encoding_format: "float", // Ensure compatibility with Pinecone
  })

  // Assuming response.data contains the embeddings
  return response.data[0].embedding
}

const generateText = async (req: Request) => {
  try {
    const { prompt, history } = req.body; // 'history' is an array of previous messages

    // Construct the conversation messages
    const messages = [
      { role: "system", content: "You are a helpful assistant who answers questions about learning or anything related to learning and talent subject" },
      ...(history || []), // Include previous conversation history
      { role: "user", content: prompt }, // Add the current user message
    ];

    // Call OpenAI's API
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300, // Adjust as needed
      temperature: 0.7, // Adjust creativity level
    });

    // Get the assistant's response
    const message = chat.choices[0]?.message?.content?.trim();

    // Return the response and updated history
    const updatedHistory = [
      ...(history || []),
      { role: "user", content: prompt },
      { role: "assistant", content: message },
    ];

    return response({ message, updatedHistory }, false, "Tạo câu trả lời thành công", 200);
  } catch (error: any) {
    return response({}, true, error.toString(), 500);
  }
}; 

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

const analyzeIntent = async (query: string) => {
  const prompt = `
    Phân tích truy vấn sau và trích xuất các tiêu chí liên quan:
    "${query}"
    Chỉ trả về một đoạn văn bản với các tiêu chí sau:
    - Subject: Tên môn học nếu có, nếu không thì trả về 'Không xác định'
    - SubjectIntroduction: Thông tin sơ bộ về môn học, tính cách của người dùng, yêu cầu như nào có thể học được môn học này nếu có, nếu không thì trả về 'Không xác định'
    - Teacher: Tên giáo viên nếu có, nếu không thì trả về 'Không xác định'
    - TeacherInformation: Mô tả chi tiết về giáo viên nếu có, cách thức dạy học của giáo viên, nếu không thì trả về 'Không xác định'
    - Address: Địa chỉ nếu có, nếu không thì trả về 'Không xác định'
    - Gender: Nam hoặc Nữ, nếu không được đề cập thì trả về 'Không xác định'
    - TeacherIntroduction: Tóm tắt giới thiệu giáo viên nếu có, giới thiệu về khóa học, nếu không thì trả về 'Không xác định'
    - Experiences: Mô tả kinh nghiệm giảng dạy nếu có, nếu không thì trả về 'Không xác định'
    - Educations: Thông tin về học vấn nếu có, nếu không thì trả về 'Không xác định'
    - Price: Khoảng giá hoặc mức giá mong muốn, nếu không thì trả về 'Không xác định'
    - Learn Types: Trực tiếp hoặc Online, nếu không thì trả về 'Không xác định'
    - Query: ${query}
    Đảm bảo trả về kết quả dưới dạng một đoạn văn bản hoàn chỉnh, không phải JSON.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an assistant extracting detailed criteria for matching teachers based on user queries." },
      { role: "user", content: prompt },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });

  try {
    // Lấy và trả về nội dung trả về dưới dạng một chuỗi văn bản
    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    return "";
  }
};

const OpenaiService = {
  generateEmbedding,
  getRecommendation,
  analyzeIntent,
  generateText
}

export default OpenaiService
