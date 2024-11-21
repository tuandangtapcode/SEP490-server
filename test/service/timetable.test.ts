import { expect } from 'chai';
import sinon from 'sinon';
import { Request } from 'express';
import * as responsed from '../../src/utils/response'
import TimeTable from '../../src/models/timetable';
import TimeTableService from '../../src/services/timetable.service';

describe('fncCreateTimeTable', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox(); // Create a sandbox to reset stubs between tests
  });

  afterEach(() => {
    sandbox.restore(); // Restore the sandbox after each test
  });

  it('should successfully create a new timetable', async () => {
    const req = {
      user: { ID: 'student123' },
      body: [
        {
          Teacher: 'teacher123',
          Subject: 'subject123',
          StartTime: new Date('2024-11-15T10:00:00Z'),
          EndTime: new Date('2024-11-15T12:00:00Z'),
          LearnType: 1,
          Address: 'Online',
        },
      ],
    } as Partial<Request>;

    // Mock the insertMany function to simulate successful insertion
    const insertManyStub = sandbox.stub(TimeTable, 'insertMany').resolves([
      {
        Teacher: 'teacher123',
        Student: 'student123',
        Subject: 'subject123',
        StartTime: new Date('2024-11-15T10:00:00Z'),
        EndTime: new Date('2024-11-15T12:00:00Z'),
        LearnType: 1,
        Address: 'Online',
        _id: 'timetable123',
      },
    ]);

    // Mock the response utility directly, as it's the default export
    const responseStub = sandbox.stub(responsed, 'default').returns({
      data: [
        {
          Teacher: 'teacher123',
          Student: 'student123',
          Subject: 'subject123',
          StartTime: new Date('2024-11-15T10:00:00Z'),
          EndTime: new Date('2024-11-15T12:00:00Z'),
          LearnType: 1,
          Address: 'Online',
          _id: 'timetable123',
        },
      ],
      isError: false,
      msg: 'Thêm thành công',
      statusCode: 201,
    });

    // Call the service method
    const response = await TimeTableService.fncCreateTimeTable(req as Request);

    // Assertions
    expect(insertManyStub.calledOnce).to.be.true;  // Ensure insertMany is called once
    expect(responseStub.calledOnce).to.be.true; // Ensure response is returned once
    expect(response.isError).to.be.false;
    expect(response.msg).to.equal('Thêm thành công');
    expect(response.statusCode).to.equal(201);
    expect(response.data).to.have.length(1);
    expect(response.data[0]).to.have.property('_id', 'timetable123');
  });

  it('should handle errors gracefully when an error occurs during timetable creation', async () => {
    const req = {
      user: { ID: 'student123' },
      body: [
        {
          Teacher: 'teacher123',
          Subject: 'subject123',
          StartTime: new Date('2024-11-15T10:00:00Z'),
          EndTime: new Date('2024-11-15T12:00:00Z'),
          LearnType: 1,
          Address: 'Online',
        },
      ],
    } as Partial<Request>;

    // Stub insertMany to simulate an error
    const insertManyStub = sandbox.stub(TimeTable, 'insertMany').rejects(new Error('Database error'));

    // Mock the response utility to return an error response
    const responseStub = sandbox.stub(responsed, 'default').returns({
      data: {},
      isError: true,
      msg: 'Error: Database error',
      statusCode: 500,
    });

    // Call the service method
    const response = await TimeTableService.fncCreateTimeTable(req as Request);

    // Assertions
    expect(insertManyStub.calledOnce).to.be.true; // Ensure insertMany is called once
    expect(responseStub.calledOnce).to.be.true; // Ensure response is returned once
    expect(response.isError).to.be.true;
    expect(response.msg).to.equal('Error: Database error');
    expect(response.statusCode).to.equal(500);
    expect(response.data).to.be.empty; // Ensure the response data is empty on error
  });
})