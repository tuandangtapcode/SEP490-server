import { Request } from "express"
import ProfitPercent from "../models/profitpercent"
import SystemKey from "../models/systemkey"
import response from "../utils/response"
import checkPayment from "../tools/checkPayment"
import CacheService from "./redis.service"

const ProfitPercentID = "66f92e193657dfff3345aa0f"

const fncGetListSystemKey = async () => {
  try {
    let systemKeys
    const dataCache = await CacheService.getCache("systemkey")
    if (!!dataCache) {
      systemKeys = JSON.parse(dataCache)
    } else {
      systemKeys = await SystemKey.find()
      CacheService.setCache("systemkey", JSON.stringify(systemKeys), 28800)
    }
    return response(systemKeys, false, "Lấy ra thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const fncGetProfitPercent = async () => {
  try {
    const percent = await ProfitPercent.findOne({
      _id: ProfitPercentID
    })
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

const CommonService = {
  fncGetListSystemKey,
  fncGetProfitPercent,
  fncChangeProfitPercent
}

export default CommonService
