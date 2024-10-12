import AccountRoute from "./account.route"
import MessageRoute from "./message.route"
import TimeTableRoute from "./timetable.route"
import SubjectRoute from "./subject.route"
import SubjectCateRoute from "./subjectcate.route"
import UserRoute from "./user.route"
import BlogRoute from "./blog.route"
import PaymentRoute from "./payment.route"
import BankingInforRoute from "./bankinginfor.route"
import NotificationRoute from "./notification.route"
import LearnHistoryRoute from "./learnhistory.route"
import FeedbackRoute from "./feedback.route"
import IssueRoute from "./issue.route"
import StatisticRoute from "./statistic.route"
import { Application } from "express"
import FileRoute from "./file.route"
import CommonRoute from "./common.route"
import CourseRoute from "./course.route"

const routes = (app: Application) => {
  app.use("/account", AccountRoute)
  app.use("/message", MessageRoute)
  app.use("/timetable", TimeTableRoute)
  app.use("/subject", SubjectRoute)
  app.use("/subjectcate", SubjectCateRoute)
  app.use("/common", CommonRoute)
  app.use("/user", UserRoute)
  app.use("/blog", BlogRoute)
  app.use("/payment", PaymentRoute)
  app.use("/bankinginfor", BankingInforRoute)
  app.use("/notification", NotificationRoute)
  app.use("/learnhistory", LearnHistoryRoute)
  app.use("/feedback", FeedbackRoute)
  app.use("/issue", IssueRoute)
  app.use("/statistic", StatisticRoute)
  app.use("/file", FileRoute)
  app.use("/course", CourseRoute)
}

export default routes
