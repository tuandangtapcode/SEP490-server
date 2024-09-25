import SystemKey from "../models/systemkey"
import response from "../utils/response"
// import CacheService from "./redis.service"


const fncGetListSystemKey = async () => {
  try {
    let systemKeys
    // const dataCache = await CacheService.getCache("systemkey")
    // if (!!dataCache) {
    //   systemKeys = JSON.parse(dataCache)
    // } else {
    systemKeys = await SystemKey.find()
    //   CacheService.setCache("systemkey", JSON.stringify(systemKeys), 28800)
    // }
    return response(systemKeys, false, "Lấy ra thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

// const

const CommonService = {
  fncGetListSystemKey
}

export default CommonService
