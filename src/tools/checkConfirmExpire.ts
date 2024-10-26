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
          $lte: moment().subtract(48, 'hours').toDate()
        }
      })
      .lean()
    console.log("confirms", confirms);
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
