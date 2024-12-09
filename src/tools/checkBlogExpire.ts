import Blog from "../models/blog"

const checkBlogExpire = async () => {
  try {
    console.log("cron job checkBlogExpire")
    await Blog.updateMany(
      {
        $or: [
          { StartDate: new Date() },
          {
            "TeacherReceive.ReceiveStatus": 3,
            IsPaid: false
          }
        ]
      },
      {
        IsDeleted: true
      }
    )
  } catch (error: any) {
    console.log("error cron job getListPaymentInCurrentWeek", error.toString())
  }
}

export default checkBlogExpire
