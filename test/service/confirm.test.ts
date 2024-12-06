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
        expect(sendEmailStub.calledOnceWith(
            'johndoe@example.com',
            'THÔNG BÁO HỌC SINH ĐĂNG KÝ HỌC',
            sinon.match.string
        )).to.be.true
        expect(createStub.calledOnceWith({ extraField: 'value' })).to.be.true
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

// describe('fncChangeConfirmStatus', () => {
//     let sandbox: sinon.SinonSandbox

//     beforeEach(() => {
//         sandbox = sinon.createSandbox()
//     })

//     afterEach(() => {
//         sandbox.restore()
//     })

//     it('should handle successful confirm status change, send an email, and update course if applicable', async () => {
//         // Setup mock data
//         const req = {
//           body: {
//             ConfirmID: '60b8b1d6f8a1c8001c8b4567', 
//             ConfirmStatus: 2, // Success case
//             Recevier: 'teacherId',
//             RecevierName: 'Teacher Name',
//             SenderName: 'Student Name',
//             SenderEmail: 'student@example.com',
//             Reason: '',
//           },
//         }
    
//         // Mock the confirmation document with a valid ObjectId
//         const mockConfirmation = {
//           _id: new Types.ObjectId('60b8b1d6f8a1c8001c8b4567'), // Valid 24-character hex string
//           Schedules: [{ StartTime: new Date() }],
//           CourseID: 'courseId', // Example course ID
//         }
    
//         // Mock the course
//         const mockCourse = {
//           _id: 'courseId',
//           QuantityLearner: 10,
//           findOneAndUpdate: sinon.stub().resolves(true),
//         }
    
//         // Create a valid UpdateResult mock response
//         const mockUpdateResult = {
//           acknowledged: true,
//           matchedCount: 1,
//           modifiedCount: 1,
//           upsertedCount: 0,
//           upsertedId: null,
//         }
    
//         // Stub methods
//         const findOneStub = sinon.stub(Confirm, 'findOne').resolves(mockConfirmation)
//         const sendEmailStub = sinon.stub(sendEmail, 'default').resolves(true)
//         const updateOneStub = sinon.stub(Confirm, 'updateOne').resolves(mockUpdateResult)
//         const findOneAndUpdateStub = sinon.stub(Course, 'findOneAndUpdate').resolves(mockCourse)
    
//         // Call the service method
//         const responseResult = await ConfirmService.fncChangeConfirmStatus(req as any)
//         console.log('respondResult', responseResult)
//         // Assertions
//         expect(responseResult.isError).to.be.false
//         expect(responseResult.msg).to.equal('Xác nhận thành công')
//         expect(responseResult.statusCode).to.equal(200)
    
//         // Verify email was sent
//         expect(sendEmailStub.calledOnceWith(
//           'student@example.com',
//           'THÔNG BÁO TRẠNG THÁI ĐĂNG KÝ HỌC',
//           sinon.match.string
//         )).to.be.true
    
//         // Verify the confirmation status was updated
//         expect(updateOneStub.calledOnceWith(
//           { _id: new Types.ObjectId('60b8b1d6f8a1c8001c8b4567') }, // Use valid ObjectId format
//           { ConfirmStatus: 2 }
//         )).to.be.true
    
//         // Verify course update if applicable
//         expect(findOneAndUpdateStub.calledOnceWith(
//           { _id: 'courseId' },
//           {
//             $inc: {
//               QuantityLearner: 1,
//             },
//           }
//         )).to.be.true
//       })

//     it('should handle the case where email sending fails', async () => {
//         // Setup mock data
//         const req = {
//             body: {
//                 ConfirmID: '12345',
//                 ConfirmStatus: 2,
//                 Recevier: 'teacherId',
//                 RecevierName: 'Teacher Name',
//                 SenderName: 'Student Name',
//                 SenderEmail: 'student@example.com',
//                 Reason: '',
//             },
//         } as Partial<Request>

//         const mockConfirmation = {
//             _id: '12345',
//             Schedules: [{ StartTime: new Date() }],
//             CourseID: 'courseId',
//             lean: sandbox.stub().returnsThis(),
//         }

//         // Stub methods
//         sandbox.stub(Confirm, 'findOne').resolves(mockConfirmation as any)
//         sandbox.stub(sendEmail, 'default').resolves(false) // Simulate email failure

//         // Mock UpdateResult to include required properties
//         const mockUpdateResult = {
//             acknowledged: true,
//             matchedCount: 1,
//             modifiedCount: 1,
//             upsertedCount: 0,  // Add the missing properties
//             upsertedId: null,  // Set to null if not relevant
//         }

//         sandbox.stub(Confirm, 'updateOne').resolves(mockUpdateResult) // Mock updateOne with a valid result

//         // Call the service method
//         const responseResult = await ConfirmService.fncChangeConfirmStatus(req as Request)

//         // Assertions
//         expect(responseResult.isError).to.be.true
//         expect(responseResult.msg).to.equal('Có lỗi xảy ra trong quá trình gửi mail')
//         expect(responseResult.statusCode).to.equal(200)

//         // Ensure email sending was attempted
//         const sendEmailStub = sendEmail.default as sinon.SinonStub // Type assertion for sinon stub
//         expect(sendEmailStub.calledOnce).to.be.true

//         // Verify the confirmation status was still updated even though the email failed
//         const updateOneStub = Confirm.updateOne as sinon.SinonStub // Type assertion for sinon stub
//         expect(updateOneStub.calledOnceWith(
//             { _id: '12345' },
//             { ConfirmStatus: 2 }
//         )).to.be.true
//     })

//     it('should handle errors and return appropriate error message', async () => {
//         // Setup mock data
//         const req = {
//             body: {
//                 ConfirmID: 'invalid_id', // This will simulate the failure case
//                 ConfirmStatus: 2,
//                 Recevier: 'teacherId',
//                 RecevierName: 'Teacher Name',
//                 SenderName: 'Student Name',
//                 SenderEmail: 'student@example.com',
//                 Reason: '',
//             },
//         } as Partial<Request>

//         // Stub the methods
//         sandbox.stub(Confirm, 'findOne').resolves(null) // Simulate not finding the confirm
//         const sendEmailStub = sandbox.stub(sendEmail, 'default').resolves(true) // Stub email function
//         const updateOneStub = sandbox.stub(Confirm, 'updateOne') // Stub the updateOne method

//         // Call the service method
//         const responseResult = await ConfirmService.fncChangeConfirmStatus(req as Request)

//         // Assertions
//         expect(responseResult.isError).to.be.true
//         expect(responseResult.msg).to.equal('Có lỗi xảy ra')
//         expect(responseResult.statusCode).to.equal(200)

//         // Ensure no email or status update was performed
//         expect(sendEmailStub.notCalled).to.be.true // Check that the email was not sent
//         expect(updateOneStub.notCalled).to.be.true // Check that the updateOne method was not called
//     })
// })