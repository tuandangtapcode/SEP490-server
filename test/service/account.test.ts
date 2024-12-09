import { expect } from 'chai'
import sinon from 'sinon'
import { Request, Response } from 'express'
import AccountService from '../../src/services/account.service'
import * as queryFunction from '../../src/utils/queryFunction'
import * as commonFunction from '../../src/utils/tokenUtils'
import * as response from '../../src/utils/response'
import proxyquire from 'proxyquire'

describe('fncLogin', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let sandbox: sinon.SinonSandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    req = {
      body: {
        Email: 'tuanpham081102@gmail.com',
        Password: 'Ab12345',
      },
    }
    res = {
      cookie: sandbox.stub(), // Stub res.cookie method here
    } as Partial<Response> & { cookie: sinon.SinonStub }
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should log in successfully with correct credentials', async () => {
    const token = 'mockToken'
    sandbox.stub(queryFunction, 'getOneDocument').resolves({
      IsActive: true,
      Password: '$2b$10$p3ojxD42zZ1HBp5V2MtyFuJr1IqqHjINBT6SlFhH32OCNpRgePAW.',  // Mock hashed password
      UserID: '66f831fdcc7df77bc5f56a3c',
      RoleID: 4,
    })
    const bcryptMock = {
      compareSync: sinon.stub().returns(true),
    }
    const AccountServiceWithMockedBcrypt = proxyquire('../../src/services/account.service', {
      bcrypt: bcryptMock,
    }).default
    sandbox.stub(commonFunction, 'encodeData').returns(token)
    const responseStub = sandbox.stub(response, 'default').returns({} as any)
    await AccountServiceWithMockedBcrypt.fncLogin(req as Request, res as Response)
    expect(responseStub.calledOnceWith(token, false, 'Login thành công', 200)).to.be.true
  })

  it('should return an error if email does not exist', async () => {
    sandbox.stub(queryFunction, 'getOneDocument').resolves(null)
    const responseStub = sandbox.stub(response, 'default').returns({} as any)
    await AccountService.fncLogin(req as Request, res as Response)
    expect(responseStub.calledOnceWith({}, true, 'Email không tồn tại', 200)).to.be.true
  })

  it('should return an error if the account is inactive', async () => {
    sandbox.stub(queryFunction, 'getOneDocument').resolves({ IsActive: false })
    const responseStub = sandbox.stub(response, 'default').returns({} as any)
    await AccountService.fncLogin(req as Request, res as Response)
    expect(responseStub.calledOnceWith({}, true, 'Tài khoản đã bị khóa', 200)).to.be.true
  })

  it('should return an error if the password is incorrect', async () => {
    sandbox.stub(queryFunction, 'getOneDocument').resolves({
      IsActive: true,
      Password: 'hashedPassword',
    })
    const bcryptMock = {
      compareSync: sinon.stub().returns(false),
    }
    const AccountServiceWithMockedBcrypt = proxyquire('../../src/services/account.service', {
      bcrypt: bcryptMock,
    }).default
    const responseStub = sandbox.stub(response, 'default').returns({} as any)
    await AccountServiceWithMockedBcrypt.fncLogin(req as Request, res as Response)
    expect(responseStub.calledOnceWith({}, true, 'Mật khẩu không chính xác', 200)).to.be.true
  })

  it('should handle unexpected errors gracefully', async () => {
    sandbox.stub(queryFunction, 'getOneDocument').throws(new Error('Unexpected error'))
    const responseStub = sandbox.stub(response, 'default').returns({} as any)
    await AccountService.fncLogin(req as Request, res as Response)
    expect(responseStub.calledOnceWith({}, true, 'Error: Unexpected error', 500)).to.be.true
  })

})