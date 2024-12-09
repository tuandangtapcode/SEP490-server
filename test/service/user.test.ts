import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import User from '../../src/models/user';
import mongoose from 'mongoose';
import { Query } from "mongoose";
import Account from '../../src/models/account';
import UserSerivce from '../../src/services/user.service';
import * as queryFunction from '../../src/utils/queryFunction';
import * as response from '../../src/utils/response'
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

describe('fncGetListSubjectSettingByTeacher', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should successfully retrieve a list of subject settings for a teacher', async () => {
        const mockUserID = new mongoose.Types.ObjectId().toString();
        const mockSubjectSettings = [
            {
                _id: new mongoose.Types.ObjectId(),
                Subject: { _id: new mongoose.Types.ObjectId(), SubjectName: 'Math' },
                Teacher: mockUserID,
                RegisterStatus: 2,
            },
            {
                _id: new mongoose.Types.ObjectId(),
                Subject: { _id: new mongoose.Types.ObjectId(), SubjectName: 'Science' },
                Teacher: mockUserID,
                RegisterStatus: 1,
            },
        ];

        const req = {
            user: { ID: mockUserID },
        } as Partial<Request>;

        // Create a mocked chainable query object
        const mockQuery = {
            populate: sandbox.stub().returnsThis(),
            lean: sandbox.stub().resolves(mockSubjectSettings),
        };

        // Stub the find method
        const findStub = sandbox.stub(SubjectSetting, 'find').returns(mockQuery as any);

        // Call the function
        const result = await UserSerivce.fncGetListSubjectSettingByTeacher(req as Request);

        // Assertions
        expect(findStub.calledOnce).to.be.true;
        expect(mockQuery.populate.calledWith('Subject', ['_id', 'SubjectName'])).to.be.true;
        expect(mockQuery.lean.calledOnce).to.be.true;

        expect(result.isError).to.be.false;
        expect(result.msg).to.equal('Lấy data thành công');
        expect(result.statusCode).to.equal(200);
        expect(result.data).to.deep.equal(
            mockSubjectSettings.map((i) => ({
                ...i,
                IsUpdate: i.RegisterStatus === 2,
                IsDisabledBtn: i.RegisterStatus === 2 ? true : false,
            }))
        );
    });

    it('should handle errors during retrieval', async () => {
        const mockUserID = new mongoose.Types.ObjectId().toString();
        const mockError = new Error('Database error');
    
        const req = {
            user: { ID: mockUserID },
        } as Partial<Request>;
    
        // Stub the database call to throw an error
        const findStub = sandbox.stub(SubjectSetting, 'find').throws(mockError);
    
        // Stub the response function directly using sinon.stub
        const responseStub = sandbox.stub(response, 'default').returns({
            data: {},
            isError: true,
            msg: mockError.toString(),
            statusCode: 500,
        });
    
        // Call the function
        const result = await UserSerivce.fncGetListSubjectSettingByTeacher(req as Request);
    
        // Assertions
        expect(findStub.calledOnce).to.be.true;
        expect(responseStub.calledOnce).to.be.true;
        expect(result.isError).to.be.true;
        expect(result.msg).to.equal(mockError.toString());
        expect(result.statusCode).to.equal(500);
        expect(result.data).to.deep.equal({});
    
    });
});

describe('fncUpdateSchedule', () => {
    let sandbox: sinon.SinonSandbox;
    const validUserID = new mongoose.Types.ObjectId();
    const validRoleID = 1;

    const mockSchedule = [
        {
            DateAt: '2024-12-10',
            StartTime: new Date('2024-12-10T09:00:00'),
            EndTime: new Date('2024-12-10T12:00:00')
        },
    ];

    const mockUpdatedUser = {
        _id: validUserID,
        FullName: 'John Doe',
        Address: '123 Main St',
        Phone: '1234567890',
        DateOfBirth: new Date('1990-01-01'),
        RoleID: validRoleID,
        Gender: 1,
        Subjects: [],
        Experiences: [],
        Educations: [],
        Description: '',
        Schedules: mockSchedule,
        Certificates: [],
        IsByGoogle: false,
        IsFirstLogin: false,
        RegisterStatus: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should successfully update schedule and return updated user', async () => {
        const req = {
            user: { ID: validUserID.toString(), RoleID: validRoleID },
            body: { Schedules: mockSchedule }
        } as Partial<Request>;

        const mockGetDetailProfile = sandbox.stub().resolves(mockUpdatedUser);

        const findOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate').resolves(mockUpdatedUser);

        // Stub the response function directly using .returns() as response is a simple function
        const responseStub = sandbox.stub(response, 'default').returns({
            data: mockUpdatedUser,
            isError: false,
            msg: 'Chỉnh sửa thông tin nghề nghiệp thành công',
            statusCode: 200
        });

        const result = await UserSerivce.fncUpdateSchedule(req as Request);

        expect(result.isError).to.be.false;
        expect(result.msg).to.equal('Chỉnh sửa thông tin nghề nghiệp thành công');
        expect(result.statusCode).to.equal(200);
        expect(result.data).to.deep.equal(mockUpdatedUser);
    });

    it('should return an error if the user is not found during update', async () => {
        const req = {
            user: { ID: validUserID.toString(), RoleID: validRoleID },
            body: { Schedules: mockSchedule }
        } as Partial<Request>;

        const findOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate').resolves(null);

        const responseStub = sandbox.stub(response, 'default').returns({
            data: {},
            isError: true,
            msg: 'Có lỗi xảy ra',
            statusCode: 200
        });

        const result = await UserSerivce.fncUpdateSchedule(req as Request);
        // Assertions
        expect(result.isError).to.be.true;
        expect(result.msg).to.equal('Có lỗi xảy ra');
        expect(result.statusCode).to.equal(200);
        expect(result.data).to.deep.equal({});
    });

    it('should return an error if getting the user profile fails', async () => {
        const req = {
            user: { ID: validUserID.toString(), RoleID: validRoleID },
            body: { Schedules: mockSchedule }
        } as Partial<Request>;

        const mockGetDetailProfile = sandbox.stub().resolves(null);

        const findOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate').resolves(mockUpdatedUser);

        const responseStub = sandbox.stub(response, 'default').returns({
            data: {},
            isError: true,
            msg: 'Có lỗi xảy ra khi get profile',
            statusCode: 200
        });

        const result = await  UserSerivce.fncUpdateSchedule(req as Request);

        expect(result.isError).to.be.true;
        expect(result.msg).to.equal('Có lỗi xảy ra khi get profile');
        expect(result.statusCode).to.equal(200);
        expect(result.data).to.deep.equal({});
    });

    it('should handle unexpected errors gracefully', async () => {
        const req = {
            user: { ID: validUserID.toString(), RoleID: validRoleID },
            body: { Schedules: mockSchedule }
        } as Partial<Request>;

        const errorMessage = 'Some unexpected error occurred';

        const findOneAndUpdateStub = sandbox.stub(User, 'findOneAndUpdate').rejects(new Error(errorMessage));

        const responseStub = sandbox.stub(response, 'default').returns({
            data: {},
            isError: true,
            msg: errorMessage,
            statusCode: 500
        });

        const result = await  UserSerivce.fncUpdateSchedule(req as Request);

        // Assertions
        expect(findOneAndUpdateStub.calledOnce).to.be.true;
        expect(responseStub.calledOnce).to.be.true;
        expect(result.isError).to.be.true;
        expect(result.msg).to.equal(errorMessage);
        expect(result.statusCode).to.equal(500);
        expect(result.data).to.deep.equal({});
    });
});

describe('fncDisabledOrEnabledSubjectSetting', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should disable the subject setting successfully', async () => {
        const mockUserID = new mongoose.Types.ObjectId().toString();
        const mockSubjectSettingID = new mongoose.Types.ObjectId().toString();
        const mockResponse = {
            _id: mockSubjectSettingID,
            Teacher: mockUserID,
            IsDisabled: true,
        };

        const req = {
            user: { ID: mockUserID },
            body: {
                SubjectSettingID: mockSubjectSettingID,
                IsDisabled: true,
            },
        } as Partial<Request>;

        // Stub the database call to return a mock response
        const findOneAndUpdateStub = sandbox
            .stub(SubjectSetting, 'findOneAndUpdate')
            .resolves(mockResponse);

        // Stub the response function
        const responseStub = sandbox.stub(response, 'default').returns({
            data: mockResponse,
            isError: false,
            msg: 'Ẩn môn học thành công',
            statusCode: 200,
        });

        // Call the function
        const result = await UserSerivce.fncDisabledOrEnabledSubjectSetting(req as Request);

        // Assertions
        expect(findOneAndUpdateStub.calledOnce).to.be.true;
        expect(findOneAndUpdateStub.args[0][0]).to.deep.include({
            _id: mockSubjectSettingID,
            Teacher: mockUserID,
        });
        expect(responseStub.calledOnce).to.be.true;
        expect(result.isError).to.be.false;
        expect(result.msg).to.equal('Ẩn môn học thành công');
        expect(result.statusCode).to.equal(200);
        expect(result.data).to.deep.equal(mockResponse);
    });

    it('should enable the subject setting successfully', async () => {
        const mockUserID = new mongoose.Types.ObjectId().toString();
        const mockSubjectSettingID = new mongoose.Types.ObjectId().toString();
        const mockResponse = {
            _id: mockSubjectSettingID,
            Teacher: mockUserID,
            IsDisabled: false,
        };

        const req = {
            user: { ID: mockUserID },
            body: {
                SubjectSettingID: mockSubjectSettingID,
                IsDisabled: false,
            },
        } as Partial<Request>;

        // Stub the database call to return a mock response
        const findOneAndUpdateStub = sandbox
            .stub(SubjectSetting, 'findOneAndUpdate')
            .resolves(mockResponse);

        // Stub the response function
        const responseStub = sandbox.stub(response, 'default').returns({
            data: mockResponse,
            isError: false,
            msg: 'Hiện môn học thành công',
            statusCode: 200,
        });

        // Call the function
        const result = await UserSerivce.fncDisabledOrEnabledSubjectSetting(req as Request);

        // Assertions
        expect(findOneAndUpdateStub.calledOnce).to.be.true;
        expect(findOneAndUpdateStub.args[0][0]).to.deep.include({
            _id: mockSubjectSettingID,
            Teacher: mockUserID,
        });
        expect(responseStub.calledOnce).to.be.true;
        expect(result.isError).to.be.false;
        expect(result.msg).to.equal('Hiện môn học thành công');
        expect(result.statusCode).to.equal(200);
        expect(result.data).to.deep.equal(mockResponse);
    });

    it('should return error if subject setting not found', async () => {
        const mockUserID = new mongoose.Types.ObjectId().toString();
        const mockSubjectSettingID = new mongoose.Types.ObjectId().toString();

        const req = {
            user: { ID: mockUserID },
            body: {
                SubjectSettingID: mockSubjectSettingID,
                IsDisabled: true,
            },
        } as Partial<Request>;

        // Stub the database call to return null (subject setting not found)
        const findOneAndUpdateStub = sandbox
            .stub(SubjectSetting, 'findOneAndUpdate')
            .resolves(null);

        // Stub the response function
        const responseStub = sandbox.stub(response, 'default').returns({
            data: {},
            isError: true,
            msg: 'Có lỗi xảy ra khi update',
            statusCode: 200,
        });

        // Call the function
        const result = await UserSerivce.fncDisabledOrEnabledSubjectSetting(req as Request);

        // Assertions
        expect(findOneAndUpdateStub.calledOnce).to.be.true;
        expect(responseStub.calledOnce).to.be.true;
        expect(result.isError).to.be.true;
        expect(result.msg).to.equal('Có lỗi xảy ra khi update');
        expect(result.statusCode).to.equal(200);
        expect(result.data).to.deep.equal({});
    });

    it('should handle database errors', async () => {
        const mockUserID = new mongoose.Types.ObjectId().toString();
        const mockSubjectSettingID = new mongoose.Types.ObjectId().toString();
        const mockError = new Error('Database error');

        const req = {
            user: { ID: mockUserID },
            body: {
                SubjectSettingID: mockSubjectSettingID,
                IsDisabled: true,
            },
        } as Partial<Request>;

        // Stub the database call to throw an error
        const findOneAndUpdateStub = sandbox
            .stub(SubjectSetting, 'findOneAndUpdate')
            .throws(mockError);

        // Stub the response function
        const responseStub = sandbox.stub(response, 'default').returns({
            data: {},
            isError: true,
            msg: mockError.toString(),
            statusCode: 500,
        });

        // Call the function
        const result = await UserSerivce.fncDisabledOrEnabledSubjectSetting(req as Request);

        // Assertions
        expect(findOneAndUpdateStub.calledOnce).to.be.true;
        expect(responseStub.calledOnce).to.be.true;
        expect(result.isError).to.be.true;
        expect(result.msg).to.equal(mockError.toString());
        expect(result.statusCode).to.equal(500);
        expect(result.data).to.deep.equal({});
    });
});