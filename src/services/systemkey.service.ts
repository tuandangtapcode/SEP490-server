import SystemKey from "../models/systemkey"
import { response } from "../utils/lib"
import CacheService from "./cache.service"


const fncGetListSystemKey = async () => {
  try {
    let systemKeys
    const dataCache = CacheService.getCache("systemkey")
    if (!!dataCache) {
      systemKeys = dataCache
    } else {
      systemKeys = await SystemKey.find()
      CacheService.setCache("systemkey", systemKeys, 28800)
    }
    return response(systemKeys, false, "Lấy ra thành công", 200)
  } catch (error: any) {
    return response({}, true, error.toString(), 500)
  }
}

const SystemKeyService = {
  fncGetListSystemKey
}

export default SystemKeyService
