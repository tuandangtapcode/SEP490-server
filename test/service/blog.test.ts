import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import { Request } from 'express';
import Blog from '../../src/models/blog';
import UserSerivce from '../../src/services/user.service';
import BlogService from '../../src/services/blog.service';
import * as queryFunction from '../../src/utils/queryFunction';

describe('fncCreateBlog', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create a blog successfully', async () => {
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { ID: userId.toString(), RoleID: 1 }, // Ensure ID is a string
            body: {
                Subject: new mongoose.Types.ObjectId(),
                Gender: [1],
                Title: 'Test Blog Title',
                Price: 1000,
                NumberSlot: 5,
                Content: 'This is a test blog content.',
                LearnType: [1],
                Address: '123 Test Street',
                Schedules: [
                    { StartTime: new Date(), EndTime: new Date() },
                ],
            },
        } as Partial<Request>;
    
        // Mock the Blog.create method
        const mockBlog = {
            ...req.body,
            RegisterStatus: 2,
            User: userId.toString(),
            _id: new mongoose.Types.ObjectId(),
        };
        const createStub = sandbox.stub(Blog, 'create').resolves(mockBlog);
    
        const response = await BlogService.fncCreateBlog(req as Request);
    
        // Assertions
        const expectedArgs = {
            ...req.body,
            RegisterStatus: 2,
            User: userId.toString(), // Match the type used in fncCreateBlog
        };
        // Check if Blog.create was called with the correct arguments
        expect(createStub.calledOnce).to.be.true;
        expect(createStub.args[0][0]).to.deep.include(expectedArgs); // Use include for partial match
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Tạo bài viết thành công');
        expect(response.statusCode).to.equal(201);
        expect(response.data).to.deep.equal(mockBlog);
    });


    it('should handle errors gracefully', async () => {
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { ID: userId.toString(), RoleID: 1 }, // Ensure both ID (string) and RoleID (number) are provided
            body: {
                Subject: new mongoose.Types.ObjectId().toString(), // Convert ObjectId to string if required by your schema
                Gender: [1],
                Title: 'Test Blog Title',
                Price: 1000,
                NumberSlot: 5,
                Content: 'This is a test blog content.',
                LearnType: [1],
                Address: '123 Test Street',
                Schedules: [
                    { StartTime: new Date().toISOString(), EndTime: new Date().toISOString() }, // Ensure dates are in ISO string format
                ],
            },
        } as Partial<Request>;

        // Simulate an error
        const errorMessage = 'Database error';
        sandbox.stub(Blog, 'create').throws(new Error(errorMessage));

        const response = await BlogService.fncCreateBlog(req as Request);

        // Assertions
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal(`Error: ${errorMessage}`);
        expect(response.statusCode).to.equal(500);
        expect(response.data).to.deep.equal({});
    });
});

describe('fncGetDetailBlog', () => {
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it('should return the blog details if the blog exists', async () => {
        const mockBlog = {
            _id: new mongoose.Types.ObjectId(),
            Title: 'Test Blog Title',
            Content: 'This is a test blog content.',
            User: new mongoose.Types.ObjectId(),
        };

        const req = {
            params: { BlogID: mockBlog._id.toString() },
        } as Partial<Request>; // You can also use a more specific type here

        // Stub getOneDocument to return the mock blog
        const getOneDocumentStub = sandbox.stub(queryFunction, 'getOneDocument').resolves(mockBlog);

        const response = await BlogService.fncGetDetailBlog(req as Request);

        // Assertions
        expect(getOneDocumentStub.calledOnceWithExactly(Blog, '_id', req.params!.BlogID)).to.be.true; // Using non-null assertion
        expect(response.isError).to.be.false;
        expect(response.msg).to.equal('Blog tồn tại');
        expect(response.statusCode).to.equal(200);
        expect(response.data).to.deep.equal(mockBlog);
    });

    it('should return an error if the blog does not exist', async () => {
        const blogID = new mongoose.Types.ObjectId().toString();
        const req = {
            params: { BlogID: blogID },
        } as Partial<Request>;

        // Stub findOne to return null and ensure lean() is chained
        const findOneStub = sandbox.stub(Blog, 'findOne').resolves(null);
        findOneStub.returns({ lean: () => null } as any); // Mock the chainable `lean` method

        const response = await BlogService.fncGetDetailBlog(req as Request);

        // Assertions
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal('Blog không tồn tại');
        expect(response.statusCode).to.equal(200);
        expect(response.data).to.deep.equal({});
    });

    it('should handle errors gracefully', async () => {
        const blogID = new mongoose.Types.ObjectId().toString();
        const req = {
            params: { BlogID: blogID },
        } as Partial<Request>;

        const errorMessage = 'Database error';

        // Stub findOne to throw an error
        sandbox.stub(Blog, 'findOne').throws(new Error(errorMessage));

        const response = await BlogService.fncGetDetailBlog(req as Request);

        // Assertions
        expect(response.isError).to.be.true;
        expect(response.msg).to.equal(`Error: ${errorMessage}`); // Match full error message
        expect(response.statusCode).to.equal(500);
        expect(response.data).to.deep.equal({});
    });
});

