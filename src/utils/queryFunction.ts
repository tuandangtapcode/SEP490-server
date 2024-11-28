import mongoose from "mongoose"
import User from "../models/user"
import { Roles } from "./constant"
import { defaultSelectField, selectFieldForStudent, selectFieldForTeacher } from "../services/user.service"

export const getOneDocument = async (model: any, filed: any, value: any) => {
  const data = await model.findOne({ [filed]: value }).lean()
  return data
}

export const getDetailProfile = async (ID: string, RoleID: number) => {
  try {
    const selectField = RoleID === Roles.ROLE_TEACHER
      ? {
        ...selectFieldForTeacher.forAggregate,
        SubjectSettings: 1,
      }
      : selectFieldForStudent.forAggregate
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(`${ID}`)
        }
      },
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
          Email: "$Account.Email"
        }
      },
      {
        $lookup: RoleID === Roles.ROLE_STUDENT
          ? {
            from: "subjects",
            localField: "Subjects",
            foreignField: "_id",
            as: "Subjects",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  SubjectName: 1
                }
              }
            ]
          }
          : {
            from: "subjectsettings",
            localField: "_id",
            foreignField: "Teacher",
            as: "SubjectSettings",
            pipeline: [
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
                  Subject: 1
                }
              }
            ]
          }
      },
      {
        $project: {
          ...defaultSelectField.forAggregate,
          ...selectField,
          IsByGoogle: 1,
          Email: 1,
        }
      }
    ])
    return user[0]
  } catch (error: any) {
    return error.toString()
  }
}
