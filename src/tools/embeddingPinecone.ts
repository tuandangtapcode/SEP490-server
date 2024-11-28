import SubjectSetting from "../models/subjectsetting"
import { Request } from "express"
import mongoose from "mongoose"
import response from "../utils/response"
import PineconeService from "../services/pinecone.service"
import OpenaiService from "../services/openai.service"
import User from "../models/user"
import Subject from "../models/subject"

const processSubjectSetting = async (subjectSettingId: string) => {
  try {
    const subjectSetting = await SubjectSetting.findById(subjectSettingId)
      .populate("Subject", ["_id", "SubjectName"])
      .populate("Teacher", ["_id", "FullName"]) as any
    if (subjectSetting.RegisterStatus === 3) {
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
        Active: ${subjectSetting.RegisterStatus === 3 ? "Yes" : "No"}
      `.trim()

      // Step 3: Generate embeddingy
      const embedding = await OpenaiService.generateEmbedding(text as string)

      // Step 4: Upsert into Pinecone
      await PineconeService.upsertVector(subjectSetting._id.toString(), embedding, {
        subject: subjectSetting.Subject?.SubjectName || "",
        teacher: subjectSetting.Teacher?.FullName || "",
        isActive: subjectSetting.RegisterStatus,
      })
      console.log("Successfully processed and stored SubjectSetting in Pinecone.")
    }
  } catch (error) {
    console.error("Error processing SubjectSetting:", error)
  }
}

const processLogBehavior = async (userId: string,) => {

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
    const metadata = match.metadata;
    return `ID ${match.id}:
    - Subject: ${metadata.subject}
    - Teacher: ${metadata.teacher}
    - Active: ${metadata.isActive ? "Yes" : "No"}
    `;
  }).join("\n");

  return `
    A user is looking for: "${userQuery}"
    Here are some matching options:
    ${matchedItemsDescription}

    Based on the above, provide a recommendation to the user. Explain why it is a good fit answer only show me ID of users only like this [id1,id2,id3,...]
  `.trim();
};

const constructRecommendationByBehaviorPrompt = (matches: any[], userQuery: string) => {
  const matchedItemsDescription = matches.map((match, index) => {
    const metadata = match.metadata;
    return `ID ${match.id}:
    - Subject: ${metadata.subject}
    - Teacher: ${metadata.teacher}
    - Active: ${metadata.isActive ? "Yes" : "No"}
    `;
  }).join("\n");

  return `
    Here is the logging behavior of A user: "${userQuery}"
    Here are some matching options:
    ${matchedItemsDescription}

    Based on the above, provide a recommendation to the user. Explain why it is a good fit answer only show me ID of users only like this [id1,id2,id3,...]
  `.trim();
};
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
    const prompt = JSON.stringify(req.body)
    const queryEmbedding = await getQueryEmbedding(prompt)
    const matches = await PineconeService.searchPinecone(queryEmbedding)
    let find;
    if (req.body.prompt) {
      find = constructRecommendationPrompt(matches, prompt)
      console.log("đã chạy tới đây")
    } else {
      find = constructRecommendationByBehaviorPrompt(matches, prompt)
      console.log("đã chạy tới đây2")
    }
    const recommendation = await OpenaiService.getRecommendation(find)
    if (recommendation?.startsWith("[")) {
      const array = (recommendation || "").replace(/[\[\]]/g, "").split(",")
      let query = {} as any
      query = {
        _id: {
          $in: array.map((i: any) => new mongoose.Types.ObjectId(`${i}`))
        }
      }
      console.log('array', array)
      const subjectsetting = await SubjectSetting.aggregate([
        {
          $match: query
        },
        {
          $addFields: {
            TotalVotes: { $sum: "$Votes" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "Teacher",
            foreignField: "_id",
            as: "Teacher",
            pipeline: [
              {
                $lookup: {
                  from: "accounts",
                  localField: "_id",
                  foreignField: "UserID",
                  as: "Account"
                }
              },
              { $unwind: '$Account' },
              {
                $addFields: {
                  IsActive: "$Account.IsActive",
                }
              },
              {
                $project: {
                  FullName: 1,
                  AvatarPath: 1,
                  RegisterStatus: 1,
                  IsActive: 1,
                }
              }
            ]
          }
        },
        { $unwind: "$Teacher" },
        {
          $match: {
            "Teacher.RegisterStatus": 3,
            "Teacher.IsActive": true,
          }
        },
        {
          $lookup: {
            from: "subjects",
            localField: "Subject",
            foreignField: "_id",
            as: "Subject",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  SubjectName: 1
                }
              }
            ]
          }
        },
        { $unwind: "$Subject" },
        {
          $project: {
            _id: 1,
            Subject: 1,
            Levels: 1,
            Price: 1,
            LearnTypes: 1,
            Teacher: 1,
            TotalVotes: 1,
            Votes: 1
          }
        },
        {
          $sort: {
            TotalVotes: -1
          }
        }
      ])
      return response(subjectsetting, false, "tạo câu trả lời thành công", 200)
    }
    else {
      return response(recommendation, true, "câu trả lời", 200)
    }
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}



const EmbeddingPinecone = {
  processAllSubjectSettings,
  teacherRecommendation,
  processSubjectSetting,
}

export default EmbeddingPinecone
