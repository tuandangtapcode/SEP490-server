import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import LearnHistory from '../../src/models/learnhistory';
import LearnHistoryService from '../../src/services/learnhistory.service';
import * as sendEmail from '../../src/utils/send-mail';

describe('fncCreateLearnHistory', () => {
    let sandbox: sinon.SinonSandbox;
  
    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });
  
    it('should successfully create a new learn history and send email', async () => {
      const req = {
        user: { ID: 'student123' },
        body: {
          TeacherName: 'Teacher A',
          StudentName: 'Student B',
          SubjectName: 'Math',
          StudentEmail: 'student@example.com',
          TeacherEmail: 'teacher@example.com',
          Times: ['2024-11-20 10:00-12:00', '2024-11-22 14:00-16:00'],
          Teacher: 'teacher123',
          Subject: 'subject123',
          TotalLearned: 10,
        },
      } as Partial<Request>;
  
      // Stub email sending
      const sendEmailStub = sandbox.stub(sendEmail, 'default').resolves(true);
  
      // Stub LearnHistory.create
      const mockLearnHistory = {
        _id: 'learnhistory123',
        Teacher: 'teacher123',
        Student: 'student123',
        Subject: 'subject123',
        TotalLearned: 10,
        LearnedNumber: 0,
        LearnedStatus: 1,
      };
      const createStub = sandbox.stub(LearnHistory, 'create').resolves(mockLearnHistory as any);
  
      const response = await LearnHistoryService.fncCreateLearnHistory(req as Request);
  
      // Assertions
      expect(sendEmailStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(response.isError).to.be.false;
      expect(response.msg).to.equal('Thêm thành công');
      expect(response.statusCode).to.equal(200);
      expect(response.data).to.deep.equal(mockLearnHistory);
    });
  
    it('should return an error if email sending fails', async () => {
      const req = {
        user: { ID: 'student123' },
        body: {
          TeacherName: 'Teacher A',
          StudentName: 'Student B',
          SubjectName: 'Math',
          StudentEmail: 'student@example.com',
          TeacherEmail: 'teacher@example.com',
          Times: ['2024-11-20 10:00-12:00', '2024-11-22 14:00-16:00'],
          Teacher: 'teacher123',
          Subject: 'subject123',
          TotalLearned: 10,
        },
      } as Partial<Request>;
  
      // Stub email sending to fail
      const sendEmailStub = sandbox.stub(sendEmail, 'default').resolves(false);
  
      const response = await LearnHistoryService.fncCreateLearnHistory(req as Request);
  
      // Assertions
      expect(sendEmailStub.calledOnce).to.be.true;
      expect(response.isError).to.be.true;
      expect(response.msg).to.equal('Có lỗi xảy ra trong quá trình gửi mail');
      expect(response.statusCode).to.equal(200);
      expect(response.data).to.deep.equal({});
    });
  
    it('should handle errors gracefully', async () => {
      const req = {
        user: { ID: 'student123' },
        body: {
          TeacherName: 'Teacher A',
          StudentName: 'Student B',
          SubjectName: 'Math',
          StudentEmail: 'student@example.com',
          TeacherEmail: 'teacher@example.com',
          Times: ['2024-11-20 10:00-12:00', '2024-11-22 14:00-16:00'],
          Teacher: 'teacher123',
          Subject: 'subject123',
          TotalLearned: 10,
        },
      } as Partial<Request>;
  
      // Stub email sending
      sandbox.stub(sendEmail, 'default').resolves(true);
  
      // Simulate a database error
      const errorMessage = 'Database error';
      sandbox.stub(LearnHistory, 'create').throws(new Error(errorMessage));
  
      const response = await LearnHistoryService.fncCreateLearnHistory(req as Request);
  
      // Assertions
      expect(response.isError).to.be.true;
      expect(response.msg).to.equal(`Error: ${errorMessage}`);
      expect(response.statusCode).to.equal(500);
      expect(response.data).to.deep.equal({});
    });
  });
