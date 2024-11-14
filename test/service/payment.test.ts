import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import Payment from '../../src/models/payment';
import PaymentService from '../../src/services/payment.service';
import * as sendEmail from '../../src/utils/send-mail';

describe('fncCreatePayment', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create a payment successfully', async () => {
        const req = {
            user: { ID: 'user123' },
            body: {
                Receiver: 'receiver123',
                PaymentType: 1,
                TraddingCode: 'TRA12345',
                TotalFee: 1000,
                Description: 'Test payment',
                PaymentMethod: 1,
            },
        } as Partial<Request>;
        const mockPayment = {
            _id: 'payment123',
            Sender: 'user123',
            ...req.body,
            PaymentStatus: 2,
            PaymentTime: new Date(),
        };
        const paymentCreateStub = sandbox.stub(Payment, 'create').resolves(mockPayment);
        const response = await PaymentService.fncCreatePayment(req as Request);
        expect(paymentCreateStub.calledOnceWithExactly({
            ...req.body,
            Sender: 'user123',
        })).to.be.true;
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Lấy link thành công');
        expect(response.statusCode).to.equal(200);
        expect(response.data).to.deep.equal(mockPayment);
    });

    it('should handle errors gracefully', async () => {
        const req = {
            user: { ID: 'user123' },
            body: {
                Receiver: 'receiver123',
                PaymentType: 1,
                TraddingCode: 'TRA12345',
                TotalFee: 1000,
                Description: 'Test payment',
                PaymentMethod: 1,
            },
        } as Partial<Request>;
        const errorMessage = 'Database error';
        sandbox.stub(Payment, 'create').throws(new Error(errorMessage));    
        const response = await PaymentService.fncCreatePayment(req as Request);
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal(`Error: ${errorMessage}`); 
        expect(response.statusCode).to.equal(500);
        expect(response.data).to.deep.equal({});
    });
});

describe('fncChangePaymentStatus', () => {
    let sandbox: sinon.SinonSandbox;
  
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });
  
    it('should handle successful payment status update and send an email', async () => {
      // Mock request
      const req = {
        user: { ID: 'user123' },
        body: {
          PaymentID: 'payment123',
          PaymentStatus: 1,
          TotalFee: 5000,
          FullName: 'John Doe',
          Email: 'johndoe@example.com',
          RoleID: 2,
        },
        file: {
          originalname: 'receipt.png',
          path: '/path/to/receipt.png',
        },
      } as Partial<Request>;
  
      // Stub database and email behavior
      const mockPayment = { _id: 'payment123', PaymentStatus: 1 };
      sandbox.stub(Payment, 'findOneAndUpdate').resolves(mockPayment);
      const sendEmailStub = sandbox.stub(sendEmail, 'default').resolves(true);
  
      const response = await PaymentService.fncChangePaymentStatus(req as Request);
  
      // Assertions
      expect(sendEmailStub.calledOnce).to.be.true;
      expect(sendEmailStub.calledWith(
        'johndoe@example.com',
        sinon.match.string, // Subject
        sinon.match.string, // HTML content
      )).to.be.true;
      expect(response.isError).to.be.false;
      expect(response.msg).to.equal('Thanh toán thành công');
      expect(response.statusCode).to.equal(200);
      expect(response.data).to.deep.equal(mockPayment);
    });
  
    it('should return an error if payment is not found', async () => {
      // Mock request
      const req = {
        user: { ID: 'user123' },
        body: {
          PaymentID: 'nonexistentPayment',
          PaymentStatus: 1,
          TotalFee: 5000,
          FullName: 'John Doe',
          Email: 'johndoe@example.com',
          RoleID: 2,
        },
      } as Partial<Request>;
  
      // Stub database behavior
      sandbox.stub(Payment, 'findOneAndUpdate').resolves(null);
  
      const response = await PaymentService.fncChangePaymentStatus(req as Request);
  
      // Assertions
      expect(response.isError).to.be.true;
      expect(response.msg).to.equal('Có lỗi xảy ra');
      expect(response.statusCode).to.equal(200);
      expect(response.data).to.deep.equal({});
    });
  
    it('should handle email sending failure', async () => {
      // Mock request
      const req = {
        user: { ID: 'user123' },
        body: {
          PaymentID: 'payment123',
          PaymentStatus: 1,
          TotalFee: 5000,
          FullName: 'John Doe',
          Email: 'johndoe@example.com',
          RoleID: 2,
        },
        file: {
          originalname: 'receipt.png',
          path: '/path/to/receipt.png',
        },
      } as Partial<Request>;
  
      // Stub database and email behavior
      const mockPayment = { _id: 'payment123', PaymentStatus: 1 };
      sandbox.stub(Payment, 'findOneAndUpdate').resolves(mockPayment);
      sandbox.stub(sendEmail, 'default').resolves(false); // Simulate email failure
  
      const response = await PaymentService.fncChangePaymentStatus(req as Request);
  
      // Assertions
      expect(response.isError).to.be.true;
      expect(response.msg).to.equal('Có lỗi xảy ra trong quá trình gửi mail');
      expect(response.statusCode).to.equal(200);
      expect(response.data).to.deep.equal({});
    });
  
    it('should handle unexpected errors gracefully', async () => {
      // Mock request
      const req = {
        user: { ID: 'user123' },
        body: {
          PaymentID: 'payment123',
          PaymentStatus: 1,
          TotalFee: 5000,
          FullName: 'John Doe',
          Email: 'johndoe@example.com',
          RoleID: 2,
        },
      } as Partial<Request>;
  
      // Simulate an unexpected error
      sandbox.stub(Payment, 'findOneAndUpdate').throws(new Error('Unexpected error'));
  
      const response = await PaymentService.fncChangePaymentStatus(req as Request);
  
      // Assertions
      expect(response.isError).to.be.true;
      expect(response.msg).to.equal('Error: Unexpected error');
      expect(response.statusCode).to.equal(500);
      expect(response.data).to.deep.equal({});
    });
  });