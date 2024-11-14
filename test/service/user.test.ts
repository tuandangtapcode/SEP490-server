import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import User from '../../src/models/user';
import mongoose from 'mongoose';
import { Query } from "mongoose";
import Account from '../../src/models/account';
import UserSerivce from '../../src/services/user.service';
import * as queryFunction from '../../src/utils/queryFunction';

describe('fncGetDetailProfile', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should successfully retrieve user profile details', async () => {
        const validUserId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
        const req = {
            user: { ID: validUserId.toString() },
        } as Partial<Request>;

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
        ];

        const aggregateStub = sandbox.stub(User, 'aggregate').resolves(mockUserData);

        const response = await UserSerivce.fncGetDetailProfile(req as Request);

        // Assertions
        expect(aggregateStub.calledOnce).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Lấy ra thành công');
        expect(response.statusCode).to.equal(200);
        expect(response.data).to.deep.equal(mockUserData[0]);
    });

    it('should return an error if no user is found', async () => {
        const validUserId = new mongoose.Types.ObjectId();
        const req = {
            user: { ID: validUserId.toString() },
        } as Partial<Request>;

        // Mock data returned by aggregate (empty array simulates no user found)
        const aggregateStub = sandbox.stub(User, 'aggregate').resolves([]);

        const response = await UserSerivce.fncGetDetailProfile(req as Request);

        // Assertions
        expect(aggregateStub.calledOnce).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Lấy ra thành công');
        expect(response.statusCode).to.equal(200);
        expect(response.data).to.be.undefined; // No user found
    });

    it('should handle errors gracefully', async () => {
        const validUserId = new mongoose.Types.ObjectId();
        const req = {
            user: { ID: validUserId.toString() },
        } as Partial<Request>;

        // Simulate an error in the aggregate query
        const errorMessage = 'Database error';
        sandbox.stub(User, 'aggregate').throws(new Error(errorMessage));

        const response = await UserSerivce.fncGetDetailProfile(req as Request);

        // Assertions
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal(`Error: ${errorMessage}`);
        expect(response.statusCode).to.equal(500);
        expect(response.data).to.deep.equal({});
    });
});
