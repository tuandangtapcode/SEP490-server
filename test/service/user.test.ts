import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import User from '../../src/models/user';
import mongoose from 'mongoose';
import { Query } from "mongoose";
import Account from '../../src/models/account';
import UserSerivce from '../../src/services/user.service';
import * as queryFunction from '../../src/utils/queryFunction';
import response from '../../src/utils/response'
import SubjectSetting from '../../src/models/subjectsetting';
import { Socket } from 'net';

describe('fncGetDetailProfile', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should successfully retrieve user profile details', async () => {
        const validUserId = new mongoose.Types.ObjectId() // Generate a valid ObjectId
        const req = {
            user: { ID: validUserId.toString() },
        } as Partial<Request>

        const mockUserData = [
            {
                _id: validUserId,
                FullName: 'John Doe',
                Address: '123 Main St',
                Phone: '1234567890',
                DateOfBirth: new Date('1990-01-01'),
                AvatarPath: 'https://example.com/avatar.jpg',
                RoleID: 1,
                Gender: 1,
                Subjects: [
                    { _id: new mongoose.Types.ObjectId(), SubjectName: 'Math' },
                    { _id: new mongoose.Types.ObjectId(), SubjectName: 'Science' },
                ],
                Email: 'john.doe@example.com',
            },
        ]

        const aggregateStub = sandbox.stub(User, 'aggregate').resolves(mockUserData)

        const response = await UserSerivce.fncGetDetailProfile(req as Request)

        // Assertions
        expect(aggregateStub.calledOnce).to.be.true
        expect(response.isError).to.be.false
        expect(response.msg).to.equal('Lấy ra thành công')
        expect(response.statusCode).to.equal(200)
        expect(response.data).to.deep.equal(mockUserData[0])
    })

    it('should return an error if no user is found', async () => {
        const validUserId = new mongoose.Types.ObjectId()
        const req = {
            user: { ID: validUserId.toString() },
        } as Partial<Request>

        // Mock the getDetailProfile function to return a response with error
        const getDetailProfileStub = sandbox.stub(UserSerivce, 'fncGetDetailProfile').resolves({
            data: {},
            isError: true,
            msg: 'Có lỗi xảy ra', // Simulate error message when no user found
            statusCode: 200,
        })

        // Call the service method
        const response = await UserSerivce.fncGetDetailProfile(req as Request)
        console.log('response', response)

        // Assertions
        expect(getDetailProfileStub.calledOnce).to.be.true; // Verify that getDetailProfile was called
        expect(response.isError).to.be.true; // Expect isError to be true as no user is found
        expect(response.msg).to.equal('Có lỗi xảy ra'); // Message from your base function
        expect(response.statusCode).to.equal(200); // Status code 200 as per your base function logic
        expect(response.data).to.deep.equal({}); // Data should be empty if no user is found
    });
});

describe('fncGetDetailTeacher', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return an error if SubjectID is invalid', async () => {
        const req = {
            body: {
                TeacherID: new mongoose.Types.ObjectId().toString(),
                SubjectID: 'invalid-id',
            },
        } as Partial<Request>;

        const response = await UserSerivce.fncGetDetailTeacher(req as Request);

        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('ID môn học không tồn tại');
        expect(response.statusCode).to.equal(200);
    });

    it('should return an error if TeacherID is invalid', async () => {
        const req = {
            body: {
                TeacherID: 'invalid-id',
                SubjectID: new mongoose.Types.ObjectId().toString(),
            },
        } as Partial<Request>;

        const response = await UserSerivce.fncGetDetailTeacher(req as Request);

        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('ID giáo viên không tồn tại');
        expect(response.statusCode).to.equal(200);
    });

    it('should return an error if the teacher does not exist', async () => {
        const req = {
            body: {
                TeacherID: new mongoose.Types.ObjectId().toString(),
                SubjectID: new mongoose.Types.ObjectId().toString(),
            },
            headers: { 'x-forwarded-for': '127.0.0.1' },
            connection: { remoteAddress: '127.0.0.1' } as unknown, // Cast to `unknown`
        } as Partial<Request>; // Convert to Partial<Request>

        const aggregateStub = sandbox.stub(SubjectSetting, 'aggregate').resolves([]); // Mock no teacher found

        // Mock the behavior of `find().populate().select()`
        const mockSelect = sandbox.stub().resolves([]); // `select` resolves an empty array
        const mockPopulate = sandbox.stub().returns({ select: mockSelect } as any); // Chain `populate` to `select`
        const findStub = sandbox.stub(SubjectSetting, 'find').returns({ populate: mockPopulate } as any); // Mock `find` to return a query-like object

        const response = await UserSerivce.fncGetDetailTeacher(req as Request);

        // Assertions
        expect(aggregateStub.calledOnce).to.be.true;
        expect(findStub.calledOnce).to.be.true;
        expect(mockPopulate.calledOnce).to.be.true; // Ensure `populate` was called
        expect(mockSelect.calledOnce).to.be.true; // Ensure `select` was called
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Giáo viên không tồn tại');
        expect(response.statusCode).to.equal(200);
    });

});
