const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')
const { loadPlanets } = require('../../models/planets.model');


describe('Launches integration tests', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanets();
  });

  afterAll( async () => {
    await mongoDisconnect();
  })

  describe('Test GET /v1/launches', () => {

    test('It should respond with 200 success', async()=> {
      await request(app)
        .get('/v1/launches')
        .expect('Content-type', /json/)
        .expect(200)
    })  
  })
  
  describe('Test POST /v1/launches', ()=>{
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1410 b',
      launchDate: 'January 4, 2028'
    }
  
    const completeLaunchWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1410 b',
    }
  
    const completeLaunchErrorDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1410 b',
      launchDate: 'xzmcnxz,mnds'
    }
  
    test('It should respond with 201 success', async () => {
  
      const response = await request(app).post('/v1/launches')
        .send(completeLaunchData)
        .expect(201)
        .expect('Content-Type', /json/);
      console.log(completeLaunchData);
  
      const dateSend = new Date(completeLaunchData.launchDate).valueOf();
      const dateReceive = new Date(response.body.launchDate).valueOf();
  
      expect(response.body).toMatchObject(completeLaunchWithoutDate)
      expect(dateSend).toBe(dateReceive)
    })
  
    test('It should respond with 400 missing required property', async () => {
  
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchWithoutDate)
        .expect(400)
      

      expect(response.body).toStrictEqual({ error: 'missing property required' })
  
    })
  
    test('It should respond with 400 invalid date', async () => {
  
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchErrorDate)
        .expect(400)
      
      expect(response.body).toStrictEqual({ error: 'invalid date' })
  
    })
  
  })
})

