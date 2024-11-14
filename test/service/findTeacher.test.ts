import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import UserSerivce from '../../src/services/user.service';
import mongoose from 'mongoose';
import User from '../../src/models/user';
import SubjectSetting from '../../src/models/subjectsetting';

describe('fncGetListTeacher', () => {
    let req: Partial<Request>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {
                TextSearch: '',
                CurrentPage: 1,
                PageSize: 10,
                SubjectID: '64c12345abcd678901234567', // Example ObjectId
                Level: ['Beginner', 'Intermediate'],
                RegisterStatus: 3
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return a list of teachers based on the query', async () => {
        const mockUsers = [
            {
                _id: new mongoose.Types.ObjectId(),
                FullName: 'John Doe',
                RegisterStatus: 3,
                SubjectSettings: [
                    {
                        Subject: { _id: '64c12345abcd678901234567', SubjectName: 'Math' },
                        Levels: ['Beginner', 'Intermediate']
                    }
                ],
                Account: {
                    Email: 'johndoe@example.com',
                    IsActive: true
                }
            }
        ];
        const mockTotal = 1;
        const aggregateStub = sandbox.stub(User, 'aggregate').resolves(mockUsers);
        const countDocumentsStub = sandbox.stub(User, 'countDocuments').resolves(mockTotal);
        const response = await UserSerivce.fncGetListTeacher(req as Request);
        expect(aggregateStub.calledOnce).to.be.true;
        expect(countDocumentsStub.calledOnce).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Lay dat thanh cong');
        expect(response.data).to.deep.equal({
            List: mockUsers,
            Total: mockTotal
        });
    });

    it('should handle errors thrown during database queries', async () => {
        const error = new Error('Database error');
        sandbox.stub(User, 'aggregate').throws(error);
        const response = await UserSerivce.fncGetListTeacher(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal(error.toString());
        expect(response.statusCode).to.equal(500);
    });

    it('should return an empty list and total 0 if no data matches', async () => {
        const aggregateStub = sandbox.stub(User, 'aggregate').resolves([]);
        const countDocumentsStub = sandbox.stub(User, 'countDocuments').resolves(0);
        const response = await UserSerivce.fncGetListTeacher(req as Request);
        expect(aggregateStub.calledOnce).to.be.true;
        expect(countDocumentsStub.calledOnce).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Lay dat thanh cong');
        expect(response.data).to.deep.equal({
            List: [],
            Total: 0
        });
    });
});

describe('fncGetDetailTeacher', () => {
    let req: Partial<Request>;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {
                TeacherID: '64c12345abcd678901234567',
                SubjectID: '64c12345abcd678901234568',
                IsBookingPage: true
            },
            headers: { 'x-forwarded-for': '127.0.0.1' },
            connection: { remoteAddress: '127.0.0.1' } as any
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return an error if the SubjectID is invalid', async () => {
        req.body.SubjectID = 'invalid-id';
        const response = await UserSerivce.fncGetDetailTeacher(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('ID môn học không tồn tại');
        expect(response.statusCode).to.equal(200);
    });

    it('should return an error if the TeacherID is invalid', async () => {
        req.body.TeacherID = 'invalid-id';
        const response = await UserSerivce.fncGetDetailTeacher(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('ID giáo viên không tồn tại');
        expect(response.statusCode).to.equal(200);
    });

    it('should return teacher details and subjects for a valid request', async () => {
        const mockUser = [
            {
                Teacher: {
                    _id: '64c12345abcd678901234567',
                    FullName: 'John Doe',
                    Address: '123 Main St',
                    Schedules: [],
                    TotalVotes: 10,
                    Votes: [],
                    AvatarPath: '/avatar.jpg',
                    Email: 'johndoe@example.com',
                },
                Subject: {
                    _id: '64c12345abcd678901234568',
                    SubjectName: 'Mathematics',
                },
                ipAddress: '127.0.0.1',
            },
        ];
        const mockSubjects = [
            {
                Subject: {
                    _id: '64c12345abcd678901234568',
                    SubjectName: 'Mathematics',
                },
            },
            {
                Subject: {
                    _id: '64c12345abcd678901234569',
                    SubjectName: 'Physics',
                },
            },
        ];
        const aggregateStub = sandbox.stub(SubjectSetting, 'aggregate').resolves(mockUser);
        const mockQuery = {
            populate: sandbox.stub().returnsThis(),
            select: sandbox.stub().resolves(mockSubjects),
        };
        const findStub = sandbox.stub(SubjectSetting, 'find').returns(mockQuery as any);
        const response = await UserSerivce.fncGetDetailTeacher(req as Request);
        expect(aggregateStub.calledOnce).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(mockQuery.populate.calledOnce).to.be.true;
        expect(mockQuery.select.calledOnce).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Lấy data thành công');
        expect(response.data).to.deep.equal({
            Teacher: mockUser[0].Teacher,
            Subject: mockUser[0].Subject,
            ipAddress: '127.0.0.1',
        });
    });

    it('should handle cases where the teacher does not exist', async () => {
        sandbox.stub(SubjectSetting, 'aggregate').resolves([]);
        const mockQuery = {
            populate: sandbox.stub().returnsThis(),
            select: sandbox.stub().resolves([]),
        };
        sandbox.stub(SubjectSetting, 'find').returns(mockQuery as any);
        const response = await UserSerivce.fncGetDetailTeacher(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Giáo viên không tồn tại');
        expect(response.statusCode).to.equal(200);
        expect(mockQuery.populate.calledOnce).to.be.true;
        expect(mockQuery.select.calledOnce).to.be.true;
    });
    it('should handle unexpected errors', async () => {
        sandbox.stub(SubjectSetting, 'aggregate').throws(new Error('Database error'));
        const response = await UserSerivce.fncGetDetailTeacher(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Error: Database error');
        expect(response.statusCode).to.equal(500);
    });
});