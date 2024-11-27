import { Request } from "express"
import ProfitPercent from "../models/profitpercent"
import SystemKey from "../models/systemkey"
import response from "../utils/response"
import CacheService from "./redis.service"
import { getOneDocument } from "../utils/queryFunction"
import { Roles } from "../utils/constant"

const getTabs = (RoleID: number, IsByGoogle: boolean) => {
  let tabs = [] as any[]
  if (RoleID === Roles.ROLE_ADMIN) {
    tabs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  } else if (RoleID === Roles.ROLE_STAFF) {
    tabs = [3, 4, 5, 6, 7, 10, 11, 12]
  } else if (RoleID === Roles.ROLE_TEACHER) {
    tabs = !!IsByGoogle
      ? [1, 3, 4, 5, 6, 7, 9, 10, 11]
      : [1, 2, 3, 4, 5, 6, 7, 9, 10, 11]
  } else {
    tabs = !!IsByGoogle
      ? [1, 3, 4, 5, 7, 8, 9, 10, 11]
      : [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]
  }
  return tabs
}

const ProfitPercentID = "66f92e193657dfff3345aa0f"

const fncGetListSystemKey = async () => {
  try {
    let systemKeys
    const dataCacheRaw = await CacheService.getCache("systemkey") as string
    const dataCache = JSON.parse(dataCacheRaw)
    if (!!dataCache?.length) {
      systemKeys = dataCache
    } else {
      systemKeys = await SystemKey.find()
      CacheService.setCache("systemkey", JSON.stringify(systemKeys), 28800)
    }
    return response(systemKeys, false, "Lấy ra thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncCreateSystemKey = async (req: Request) => {
  try {
    await SystemKey.create(req.body)
    const systemKeys = await SystemKey.find()
    CacheService.setCache("systemkey", JSON.stringify(systemKeys), 28800)
    return response({}, false, "Thêm systemkey thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetProfitPercent = async () => {
  try {
    const percent = await getOneDocument(ProfitPercent, "_id", ProfitPercentID)
    return response(percent, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncChangeProfitPercent = async (req: Request) => {
  try {
    const { Percent } = req.body as { Percent: number }
    const updatePercent = await ProfitPercent.findOneAndUpdate(
      {
        _id: ProfitPercentID
      },
      {
        Percent: Percent
      },
      { new: true }
    )
    return response(updatePercent, false, "Cập nhật phần trăm lợi nhuận thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncInsertParentKey = async (req: Request) => {
  try {
    const { KeyName, ParentName } = req.body as { KeyName: string, ParentName: string }
    const systemKey = await getOneDocument(SystemKey, "KeyName", KeyName)
    if (!systemKey) return response({}, true, "Key name không tồn tại", 200)
    const lastParent = systemKey.Parents[systemKey?.Parents.length - 1]
    const newData = {
      ParentID: lastParent.ParentID + 1,
      ParentName: ParentName
    }
    await SystemKey.updateOne(
      { KeyName },
      {
        $push: {
          Parents: newData
        }
      },
      { new: true }
    )
    const systemKeys = await SystemKey.find()
    CacheService.setCache("systemkey", JSON.stringify(systemKeys), 28800)
    return response({}, false, "Thêm ParentKey thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetListTabs = async (req: Request) => {
  try {
    const { RoleID } = req.user
    const { IsByGoogle } = req.body
    const tabs = getTabs(RoleID, IsByGoogle)
    return response(tabs, false, "Lấy data thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const CommonService = {
  fncGetListSystemKey,
  fncCreateSystemKey,
  fncGetProfitPercent,
  fncChangeProfitPercent,
  fncInsertParentKey,
  fncGetListTabs
}

export default CommonService
