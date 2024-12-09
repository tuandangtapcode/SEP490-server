import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response } from 'express'
import Confirm from '../../src/models/confirm'
import TimeTable from '../../src/models/timetable'
import ConfirmService from '../../src/services/confirm.service'
import * as sendEmail from '../../src/utils/send-mail'
import Course from '../../src/models/course'
import mongoose, { Types } from 'mongoose'

describe('fncCreateConfirm', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should send an email and create a confirmation successfully', async () => {
        const req = {
            body: {
                TeacherName: 'John Doe',
                StudentName: 'Jane Smith',
                SubjectName: 'Mathematics',
                TeacherEmail: 'johndoe@example.com',
                Times: ['Monday 10:00 AM', 'Wednesday 2:00 PM'],
                extraField: 'value',
            },
        } as Partial<Request>
        const sendEmailStub = sandbox.stub(sendEmail, 'default').resolves(true)  // Ensure 'default' is used correctly
        const mockConfirmation = { id: '12345', ...req.body }
        const createStub = sandbox.stub(Confirm, 'create').resolves(mockConfirmation)

        const response = await ConfirmService.fncCreateConfirm(req as Request)

        expect(response.isError).to.be.false
        expect(response.msg).to.equal('Yêu cầu booking của bạn đã được gửi. Hãy chờ giáo viên xác nhận.')
        expect(response.statusCode).to.equal(201)
        expect(response.data).to.deep.equal(mockConfirmation)
    })

    it('should handle email sending failure', async () => {
        const req = {
            body: {
                TeacherName: 'John Doe',
                StudentName: 'Jane Smith',
                SubjectName: 'Mathematics',
                TeacherEmail: 'johndoe@example.com',
                Times: ['Monday 10:00 AM', 'Wednesday 2:00 PM'],
                extraField: 'value',
            },
        } as Partial<Request>
        sandbox.stub(sendEmail, 'default').resolves(false)
        const response = await ConfirmService.fncCreateConfirm(req as Request)
        expect(response.isError).to.be.true
        expect(response.msg).to.equal('Có lỗi xảy ra trong quá trình gửi mail')
        expect(response.statusCode).to.equal(200)
        expect(response.data).to.deep.equal({})
    })

    it('should handle unexpected errors', async () => {
        const req = {
            body: {
                TeacherName: 'John Doe',
                StudentName: 'Jane Smith',
                SubjectName: 'Mathematics',
                TeacherEmail: 'johndoe@example.com',
                Times: ['Monday 10:00 AM', 'Wednesday 2:00 PM'],
                extraField: 'value',
            },
        } as Partial<Request>
        sandbox.stub(sendEmail, 'default').rejects(new Error('Unexpected error'))
        const response = await ConfirmService.fncCreateConfirm(req as Request)
        expect(response.isError).to.be.true
        expect(response.msg).to.equal('Error: Unexpected error')
        expect(response.statusCode).to.equal(500)
        expect(response.data).to.deep.equal({})
    })
})

