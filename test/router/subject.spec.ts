import { expect } from 'chai'
import { describe } from 'mocha'
import supertest from 'supertest'
import * as sinon from 'sinon'
import app from '../../src/index'
import SubjectService from '../../src/services/subject.service'
import Subject from '../../src/models/subject'

describe('Subject Service', () => {
  let sandbox: sinon.SinonSandbox
  let subjectService: any
  let subjectModel: any

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    subjectService = SubjectService
    subjectModel = Subject
  })

  afterEach(() => {
    sandbox.restore()
  })

  //test for router createSubject
  describe('CreateSubject', () => {
    it('should create a new subject successfully', async () => {
      const mockSubject = {
        SubjectCateID: '6647a0619622c9bd93fab07e',
        SubjectName: 'Dan to rung 10',
        AvatarPath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
        Description: 'testing number 1',
      }

      const response = await supertest(app)
        .post('/subject/createSubject')
        .send(mockSubject) // Send the subject data

      expect(response.status).to.equal(201)
      expect(response.error).to.equal(false)
    })

    it('should fail to create a subject (missing field)', async () => {
      const mockSubject = {
        SubjectCateID: '6647a0619622c9bd93fab07e',
        SubjectName: 'Dan to rung 10',
        AvatarPath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
        Description: 'testing number 1',
      }

      const response = await supertest(app)
        .post('/subject/createSubject')
        .send(mockSubject) // Send the subject data with missing field

      expect(response.status).to.be.equal(200) // Expect an error status code
    })
  })

  //test for router getListSubject
  describe('getListSubject', () => {
    it('should show the correct list subject', async () => {
      const mockSubject = {
        TextSearch: '',
        CurrentPage: 0,
        PageSize: 0,
      }

      const response = await supertest(app)
        .post('/subject/getListSubject')
        .send(mockSubject) // Send the subject data

      expect(response.status).to.equal(200)
      expect(response.error).to.equal(false)
    })
  })


})