import CryptoJS from "crypto-js"
import * as dotenv from "dotenv"
dotenv.config()

export const encodeData = (object: any) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(object),
    process.env.HASH_KEY || "default_hash_key",
  ).toString()
}

export const decodeData = (data_hashed: any) => {
  const decryptedBytes = CryptoJS.AES.decrypt(
    data_hashed,
    process.env.HASH_KEY || "default_hash_key",
  )
  return JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8))
}
