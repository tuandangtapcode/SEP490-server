import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import BankingInfor from '../../src/models/bankinginfor';
import BankingInforService from '../../src/services/bankinginfor.service';

describe('fncCreateBankingInfor', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox(); // Create a sandbox to reset stubs between tests
    });

    afterEach(() => {
        sandbox.restore(); // Restore the sandbox after each test
    });

    it('should successfully create banking information', async () => {
        const req = {
            user: { ID: 'user123' },
            body: {
                BankID: 12345,
                UserBankName: 'John Doe Bank',
                UserBankAccount: 987654321,
            },
        } as Partial<Request>;

        // Create a mock banking information object that will be returned as a Mongoose document
        const mockBankingInforData = {
            _id: new mongoose.Types.ObjectId(),
            User: new mongoose.Types.ObjectId(),
            BankID: 12345,
            UserBankName: 'John Doe Bank',
            UserBankAccount: 987654321,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Create a Mongoose model for 'BankingInfor'
        const BankingInforModel = mongoose.model('BankingInfor', BankingInfor.schema);

        // Create a mock instance of a Mongoose document using the model
        const mockBankingInforDoc = new BankingInforModel(mockBankingInforData);

        // Stub the 'create' method to return the mock Mongoose document
        const createStub = sandbox.stub(BankingInfor, 'create').resolves([mockBankingInforDoc]);

        // Call the service function
        const response = await BankingInforService.fncCreateBankingInfor(req as Request);

        // Assertions
        expect(createStub.calledOnce).to.be.true; // Ensure create is called once
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Tạo thông tin banking thành công');
        expect(response.statusCode).to.equal(201);
        expect(response.data).to.have.length(1);
        expect(response.data[0]).to.have.property('_id');
        expect(response.data[0].UserBankName).to.equal('John Doe Bank');
    });

    it('should return an error if creation fails', async () => {
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { ID: userId.toString() },  // Simulate the request with user data
            body: {
                BankID: 1,
                UserBankName: 'John Doe Bank',
                UserBankAccount: 1234567890,
            },
        } as Partial<Request>;

        // Mock BankingInfor.create to simulate an error (e.g., validation failure)
        sandbox.stub(BankingInfor, 'create').rejects(new Error('Database error'));

        // Call the service function
        const response = await BankingInforService.fncCreateBankingInfor(req as Request);

        // Assertions
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Error: Database error');
        expect(response.statusCode).to.equal(500);
        expect(response.data).to.deep.equal({});
    });
});