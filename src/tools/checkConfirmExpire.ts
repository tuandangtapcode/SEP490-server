import moment from "moment"
import Confirm from "../models/confirm"

const checkConfirmExpire = async () => {
  try {
    const confirms = await Confirm
      .find({
        $or: [
          { ConfirmStatus: 1 },
          {
            ConfirmStatus: 2,
            IsPaid: false
          }
        ],
        createdAt: {
          $lt: moment().subtract(48, 'hours').toDate()
        }
      })
      .lean()
    const promiseUpdate = confirms.map((i: any) =>
      Confirm.updateOne(
        { _id: i._id },
        { ConfirmStatus: 3 }
      )
    )
    await Promise.all(promiseUpdate)
  } catch (error: any) {
    console.log("error", error.toString())
  }
}

export default checkConfirmExpire
