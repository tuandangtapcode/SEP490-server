import SubjectSetting from "../models/subjectsetting"
import { Request } from "express"
import mongoose from "mongoose"
import response from "../utils/response"
import PineconeService from "../services/pinecone.service"
import OpenaiService from "../services/openai.service"
import User from "../models/user"
import Subject from "../models/subject"
import LearnHistory from "../models/learnhistory"

const processSubjectSetting = async (subjectSettingId: string) => {
  try {
    const subjectSetting = await SubjectSetting.findById(subjectSettingId)
      .populate("Subject", ["_id", "SubjectName", "Description"])
      .populate("Teacher", ["_id", "FullName", "Address", "Description", "Gender"]) as any
    if (subjectSetting.RegisterStatus === 3) {
      const text = `
        Subject: ${subjectSetting.Subject?.SubjectName || ""}
        SubjectIntroduction: ${subjectSetting.Subject?.Description || ""}
        Teacher: ${subjectSetting.Teacher?.FullName || ""}
        TeacherInformation: ${subjectSetting.Teacher?.Description || ""}
        Address: ${subjectSetting.Teacher?.Address || ""}
        Gender: ${subjectSetting.Teacher?.Gender === 1 ? "Nam" : "Nữ"}
        TeacherIntroduction: ${subjectSetting.Quote.Content || ""}
        Levels: ${subjectSetting.Levels.join(", ")}
        Experiences: ${subjectSetting.Experiences.Content}
        Educations: ${subjectSetting.Educations.Content}
        Price: ${subjectSetting.Price || "N/A"}
        Learn Types: ${subjectSetting.LearnTypes === 1 ? "Trực tiếp" : "Online"}
        Active: ${subjectSetting.RegisterStatus === 3 ? "Yes" : "No"}
      `.trim()
      // Step 3: Generate embeddingy
      const embedding = await OpenaiService.generateEmbedding(text as string)

      // Step 4: Upsert into Pinecone
      await PineconeService.upsertVector(subjectSetting._id.toString(), "teacher", embedding, {
        subject: subjectSetting.Subject?.SubjectName || "",
        teacher: subjectSetting.Teacher?.FullName || "",
        gender: subjectSetting.Teacher?.Gender === 1 ? "Nam" : "Nữ",
        isActive: subjectSetting.RegisterStatus,
      })
    }
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const updateSubjectSetting = async (subjectSettingId: string) => {
  try {
    const subjectSetting = await SubjectSetting.findById(subjectSettingId)
      .populate("Subject", ["_id", "SubjectName", "Description"])
      .populate("Teacher", ["_id", "FullName", "Address", "Description", "Gender"]) as any
    if (subjectSetting.RegisterStatus === 3) {
      const text = `
        Subject: ${subjectSetting.Subject?.SubjectName || ""}
        SubjectIntroduction: ${subjectSetting.Subject?.Description || ""}
        Teacher: ${subjectSetting.Teacher?.FullName || ""}
        TeacherInformation: ${subjectSetting.Teacher?.Description || ""}
        Address: ${subjectSetting.Teacher?.Address || ""}
        Gender: ${subjectSetting.Teacher?.Gender === 1 ? "Nam" : "Nữ"}
        TeacherIntroduction: ${subjectSetting.Quote.Content || ""}
        Experiences: ${subjectSetting.Experiences.Content}
        Educations: ${subjectSetting.Educations.Content}
        Price: ${subjectSetting.Price || "N/A"}
        Learn Types: ${subjectSetting.LearnTypes === 1 ? "Trực tiếp" : "Online"}
      `.trim()
      const embedding = await OpenaiService.generateEmbedding(text as string)
      const updateData = await PineconeService.updateVector(subjectSettingId, "teacher", embedding)
      return response(updateData, false, "cập nhật data thành công", 200)
    }
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const processLearnHistory = async (userID: string) => {
  try {
    const learnHistory = await LearnHistory.find({ Student: userID })
      .populate("Subject", ["_id", "SubjectName", "Description"])
      .populate("Teacher", ["_id", "FullName", "Address", "Description", "Gender"])
      .populate("Student", ["_id", "FullName", "Address", "Gender"]) as any
    const text = `
      Subject: ${learnHistory.Subject?.SubjectName || ""}
      SubjectIntroduction: ${learnHistory.Subject?.Description || ""}
      Teacher: ${learnHistory.Teacher?.FullName || ""}
      TeacherInformation: ${learnHistory.Teacher?.Description || ""}
      `.trim()
    const embedding = await OpenaiService.generateEmbedding(text as string)
    if (learnHistory.length === 1) {
      await PineconeService.upsertVector(userID, "learnhistory", embedding, {
        student: learnHistory.Student?.FullName || "",
        gender: learnHistory.Student?.Gender === 1 ? "Nam" : "Nữ",
        address: learnHistory.Student?.Address || "",
      })
    } else if (learnHistory.length > 1) {
      await PineconeService.updateVector(userID, "learnhistory", embedding)
    }
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const processAllSubjectSettings = async () => {
  const subjectSettings = await SubjectSetting.find()
  for (const subjectSetting of subjectSettings) {
    await processSubjectSetting(subjectSetting._id.toString())
  }

}

const getQueryEmbedding = async (query: string): Promise<number[]> => {
  return await OpenaiService.generateEmbedding(query)
}

const teacherRecommendationByLearnHistory = async (req: Request) => {
  try {
    const userID = req.user.ID
    const learnHistory = await PineconeService.searchPineconeByID(userID)
    const queryEmbedding = learnHistory[0].values
    const matches = await PineconeService.searchPineconeByQuery(queryEmbedding)
    let query = {} as any
    query = {
      _id: {
        $in: matches.map((i: any) => new mongoose.Types.ObjectId(`${i.id}`))
      }
    }
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
      },
      { $limit: 8 },
    ])
    return response(subjectsetting, false, "tạo câu trả lời thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const teacherRecommendation = async (req: Request) => {
  try {
    const {prompt} = req.body
    // const intentPrompt = await OpenaiService.analyzeIntent(prompt)
    // console.log(intentPrompt)
    const queryEmbedding = await getQueryEmbedding(prompt)
    const matches = await PineconeService.searchPineconeByQuery(queryEmbedding)
    let query = {} as any
    query = {
      _id: {
        $in: matches.map((i: any) => new mongoose.Types.ObjectId(`${i.id}`))
      }
    }
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
      },
      { $limit: 8 },
    ])
    return response(subjectsetting, false, "tạo câu trả lời thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const EmbeddingPinecone = {
  processAllSubjectSettings,
  processLearnHistory,
  processSubjectSetting,
  updateSubjectSetting,
  teacherRecommendation,
  teacherRecommendationByLearnHistory,
}

export default EmbeddingPinecone
