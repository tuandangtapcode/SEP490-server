import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import BankingInfor from '../../src/models/bankinginfor'
import BankingInforService from '../../src/services/bankinginfor.service'

describe('fncCreateBankingInfor', () => {
    let sandbox: sinon.SinonSandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox() 
    })
    afterEach(() => {
        sandbox.restore() 
    })
    it('should successfully create banking information', async () => {
        const req = {
            user: { ID: 'user123' },
            body: {
                BankID: 12345,
                UserBankName: 'John Doe Bank',
                UserBankAccount: 987654321,
            },
        } as Partial<Request>
        const mockBankingInforData = {
            _id: new mongoose.Types.ObjectId(),
            User: new mongoose.Types.ObjectId(),
            BankID: 12345,
            UserBankName: 'John Doe Bank',
            UserBankAccount: 987654321,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const BankingInforModel = mongoose.model('BankingInfor', BankingInfor.schema)
        const mockBankingInforDoc = new BankingInforModel(mockBankingInforData)
        const createStub = sandbox.stub(BankingInfor, 'create').resolves([mockBankingInforDoc])
        const response = await BankingInforService.fncCreateBankingInfor(req as Request)
        expect(createStub.calledOnce).to.be.true 
        expect(response.isError).to.be.false
        expect(response.msg).to.equal('Tạo thông tin banking thành công')
        expect(response.statusCode).to.equal(201)
        expect(response.data).to.have.length(1)
        expect(response.data[0]).to.have.property('_id')
        expect(response.data[0].UserBankName).to.equal('John Doe Bank')
    })

    it('should return an error if creation fails', async () => {
        const userId = new mongoose.Types.ObjectId()
        const req = {
            user: { ID: userId.toString() }, 
            body: {
                BankID: 1,
                UserBankName: 'John Doe Bank',
                UserBankAccount: 1234567890,
            },
        } as Partial<Request>

        sandbox.stub(BankingInfor, 'create').rejects(new Error('Database error'))

        const response = await BankingInforService.fncCreateBankingInfor(req as Request)

        expect(response.isError).to.be.true
        expect(response.msg).to.equal('Error: Database error')
        expect(response.statusCode).to.equal(500)
        expect(response.data).to.deep.equal({})
    })
})