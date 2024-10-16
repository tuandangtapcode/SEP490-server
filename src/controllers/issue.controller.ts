import { Request, Response } from "express"
import IssueService from "../services/issue.service"

const createIssue = async (req: Request, res: Response) => {
  try {
    const response = await IssueService.fncCreateIssue(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListIssue = async (req: Request, res: Response) => {
  try {
    const response = await IssueService.fncGetListIssue(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getListIssueTimeTable = async (req: Request, res: Response) => {
  // try {
  //   const response = await IssueService.fncGetListIssueTimeTable(req)
  //   return res.status(response.statusCode).json(response)
  // } catch (error: any) {
  //   return res.status(500).json(error.toString())
  // }
}

const deletedIssue = async (req: Request, res: Response) => {
  try {
    const response = await IssueService.fncDeleteIssue(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const handleIssue = async (req: Request, res: Response) => {
  try {
    const response = await IssueService.fcnHandleIssue(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500).json(error.toString())
  }
}

const getIssueDetail = async (req: Request, res: Response) => {
  try {
    const response = await IssueService.fncGetIssueDetail(req)
    return res.status(response.statusCode).json(response)
  } catch (error: any) {
    return res.status(500). json(error.toString())
  }
}

const IssueController = {
  createIssue,
  getListIssue,
  deletedIssue,
  getListIssueTimeTable,
  handleIssue,
  getIssueDetail
}

export default IssueController
