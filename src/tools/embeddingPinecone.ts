import SubjectSetting from "../models/subjectsetting"
import { Request } from "express"
import response from "../utils/response"
import PineconeService from "../services/pinecone.service"
import OpenaiService from "../services/openai.service"

const processSubjectSetting = async (subjectSettingId: string) => {
  try {
    const subjectSetting = await SubjectSetting.findById(subjectSettingId)
      .populate("Subject", ["_id", "SubjectName"])
      .populate("Teacher", ["_id", "FullName"]) as any
    const text = `
        Subject: ${subjectSetting.Subject?.SubjectName || ""}
        Teacher: ${subjectSetting.Teacher?.FullName || ""}
        Quote: ${subjectSetting.Quote.Title || ""} ${subjectSetting.Quote.Content || ""}
        Certificates: ${subjectSetting.Certificates.join(", ")}
        Intro Videos: ${subjectSetting.IntroVideos.join(", ")}
        Levels: ${subjectSetting.Levels.join(", ")}
        Experiences: ${subjectSetting.Experiences}
        Educations: ${subjectSetting.Educations}
        Price: ${subjectSetting.Price || "N/A"}
        Learn Types: ${subjectSetting.LearnTypes.join(", ")}
        Active: ${subjectSetting.IsActive ? "Yes" : "No"}
      `.trim()
    console.log(text)
    // Step 3: Generate embeddingy
    const embedding = await OpenaiService.generateEmbedding(text)

    // Step 4: Upsert into Pinecone
    await PineconeService.upsertVector(subjectSetting._id.toString(), embedding, {
      subject: subjectSetting.Subject?.SubjectName || "",
      teacher: subjectSetting.Teacher?.FullName || "",
      isActive: subjectSetting.IsActive,
    })

    console.log("Successfully processed and stored SubjectSetting in Pinecone.")
  } catch (error) {
    console.error("Error processing SubjectSetting:", error)
  }
}

const processAllSubjectSettings = async () => {
  const subjectSettings = await SubjectSetting.find()
  for (const subjectSetting of subjectSettings) {
    await processSubjectSetting(subjectSetting._id.toString())
  }
  // processSubjectSetting("66f83320bea43f926006d683")
}

const getQueryEmbedding = async (query: string): Promise<number[]> => {
  return await OpenaiService.generateEmbedding(query)
}

const constructRecommendationPrompt = (matches: any[], userQuery: string) => {
  const matchedItemsDescription = matches.map((match, index) => {
    const metadata = match.metadata
    return `Option ${index + 1}:
    - Subject: ${metadata.subject}
    - Teacher: ${metadata.teacher}
    - Active: ${metadata.isActive ? "Yes" : "No"}
    `
  }).join("\n")

  return `
    A user is looking for: "${userQuery}"
    Here are some matching options:
    ${matchedItemsDescription}

    Based on the above, provide a recommendation to the user. Explain why it is a good fit.
  `.trim()
}

// const recommendSubjects = async (userQuery: string) => {
//   try {
//     // Step 1: Generate query embedding
//     const queryEmbedding = await getQueryEmbedding(userQuery)

//     // Step 2: Search Pinecone
//     const matches = await searchPinecone(queryEmbedding)

//     if (!matches || matches.length === 0) {
//       return "No relevant subjects or teachers found for your query."
//     }
//     console.log(matches)
//     // Step 3: Construct prompt
//     const prompt = constructRecommendationPrompt(matches, userQuery)

//     // Step 4: Get recommendation from OpenAI
//     const recommendation = await getRecommendation(prompt)

//     return recommendation
//   } catch (error) {
//     console.error("Error generating recommendation:", error)
//     return "An error occurred while generating a recommendation. Please try again later."
//   }
// }

const teacherRecommendation = async (req: Request) => {
  try {
    const { prompt } = req.body
    const queryEmbedding = await getQueryEmbedding(prompt)
    const matches = await PineconeService.searchPinecone(queryEmbedding)
    console.log(matches)
    const query = constructRecommendationPrompt(matches, prompt)
    const recommendation = await OpenaiService.getRecommendation(query)
    return response(recommendation, false, "tạo câu trả lời thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const EmbeddingPinecone = {
  processAllSubjectSettings,
  teacherRecommendation
}

export default EmbeddingPinecone