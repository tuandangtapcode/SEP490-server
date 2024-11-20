import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import Confirm from '../../src/models/confirm';
import TimeTable from '../../src/models/timetable';
import ConfirmService from '../../src/services/confirm.service';
import * as sendEmail from '../../src/utils/send-mail';

describe('fncCreateConfirm', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

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
        } as Partial<Request>;
        const sendEmailStub = sandbox.stub(sendEmail, 'default').resolves(true);  // Ensure 'default' is used correctly
        const mockConfirmation = { id: '12345', ...req.body };
        const createStub = sandbox.stub(Confirm, 'create').resolves(mockConfirmation);

        const response = await ConfirmService.fncCreateConfirm(req as Request);
        expect(sendEmailStub.calledOnceWith(
            'johndoe@example.com',
            'THÔNG BÁO HỌC SINH ĐĂNG KÝ HỌC',
            sinon.match.string 
        )).to.be.true;
        expect(createStub.calledOnceWith({ extraField: 'value' })).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Yêu cầu booking của bạn đã được gửi. Hãy chờ giáo viên xác nhận.');
        expect(response.statusCode).to.equal(201);
        expect(response.data).to.deep.equal(mockConfirmation);
    });

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
        } as Partial<Request>;
        sandbox.stub(sendEmail, 'default').resolves(false);
        const response = await ConfirmService.fncCreateConfirm(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Có lỗi xảy ra trong quá trình gửi mail');
        expect(response.statusCode).to.equal(200);
        expect(response.data).to.deep.equal({});
    });

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
        } as Partial<Request>;
        sandbox.stub(sendEmail, 'default').rejects(new Error('Unexpected error'));
        const response = await ConfirmService.fncCreateConfirm(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Error: Unexpected error');
        expect(response.statusCode).to.equal(500);
        expect(response.data).to.deep.equal({});
    });
});

describe('fncChangeConfirmStatus', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should handle successful confirm status change and send an email', async () => {
        const req = {
            body: {
                ConfirmID: '12345',
                ConfirmStatus: 2,
                Recevier: 'teacherId',
                RecevierName: 'Teacher Name',
                SenderName: 'Student Name',
                SenderEmail: 'student@example.com',
            },
        } as Partial<Request>;
        sandbox.stub(Confirm, 'findOne').returns({
            lean: sandbox.stub().resolves({
                _id: '12345',
                Schedules: [{ StartTime: new Date() }],
            }),
        } as any);
        sandbox.stub(TimeTable, 'findOne').resolves(null);
        const sendEmailStub = sandbox.stub(require('../../src/utils/send-mail'), 'default').resolves(true);
        const updateStub = sandbox.stub(Confirm, 'updateOne').resolves();
        const response = await ConfirmService.fncChangeConfirmStatus(req as Request);
        expect(sendEmailStub.calledOnceWith(
            sinon.match('student@example.com'),
            sinon.match('THÔNG BÁO TRẠNG THÁI ĐĂNG KÝ HỌC'),
            sinon.match.string
        )).to.be.true;
        expect(updateStub.calledOnceWith(
            { _id: '12345' },
            { ConfirmStatus: 2 }
        )).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Xác nhận thành công');
        expect(response.statusCode).to.equal(200);
    });

    it('should return an error if no confirm found', async () => {
        const req = {
            body: {
                ConfirmID: 'nonexistentId',
                ConfirmStatus: 2,
                Recevier: 'teacherId',
                RecevierName: 'Teacher Name',
                SenderName: 'Student Name',
                SenderEmail: 'student@example.com',
            },
        } as Partial<Request>;
        sandbox.stub(Confirm, 'findOne').returns({
            lean: sandbox.stub().resolves(null),
        } as any);
        const response = await ConfirmService.fncChangeConfirmStatus(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Có lỗi xảy ra');
        expect(response.statusCode).to.equal(200);
    });

    it('should return an error if timetable conflict is found', async () => {
        const req = {
            body: {
                ConfirmID: '12345',
                ConfirmStatus: 2,
                Recevier: 'teacherId',
                RecevierName: 'Teacher Name',
                SenderName: 'Student Name',
                SenderEmail: 'student@example.com',
            },
        } as Partial<Request>;
        const mockConfirmation = {
            _id: '12345',
            Schedules: [{ StartTime: new Date() }],
        };
        sandbox.stub(Confirm, 'findOne').returns({
            lean: sandbox.stub().resolves(mockConfirmation),
        } as any);
        const mockTimeTable = { StartTime: new Date() };
        sandbox.stub(TimeTable, 'findOne').resolves(mockTimeTable);
        const response = await ConfirmService.fncChangeConfirmStatus(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.include('Bạn đã có lịch dạy vào ngày');
        expect(response.statusCode).to.equal(200);
    });

    it('should handle email sending failure', async () => {
        const req = {
            body: {
                ConfirmID: '12345',
                ConfirmStatus: 2,
                Recevier: 'teacherId',
                RecevierName: 'Teacher Name',
                SenderName: 'Student Name',
                SenderEmail: 'student@example.com',
            },
        } as Partial<Request>;
        const mockConfirmation = {
            _id: '12345',
            Schedules: [{ StartTime: new Date() }],
        };
        sandbox.stub(Confirm, 'findOne').returns({
            lean: sandbox.stub().resolves(mockConfirmation),
        } as any);
        sandbox.stub(TimeTable, 'findOne').resolves(null);
        const sendEmailStub = sandbox.stub(sendEmail, 'default').resolves(false);
        const response = await ConfirmService.fncChangeConfirmStatus(req as Request);
        expect(sendEmailStub.calledOnce).to.be.true;
        expect(sendEmailStub.calledOnceWith(
            'student@example.com',
            sinon.match('THÔNG BÁO TRẠNG THÁI ĐĂNG KÝ HỌC'),
            sinon.match.string
        )).to.be.true;
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Có lỗi xảy ra trong quá trình gửi mail');
        expect(response.statusCode).to.equal(200);
    });
});