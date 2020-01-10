/* process.env.NODE_ENV = 'test';

// const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');
const Project = require('../app/models/project');

const should = chai.should();

chai.use(chaiHttp);
describe('PROJECT:', () => {
  beforeEach((done) => {
    Project.remove({}, () => {
      done();
    });
  });

  // get all
  describe('/GET projects', () => {
    it('Получить список всех Measure', (done) => {
      chai.request(server)
        .get('/project')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          should.equal(res.body.length, 0);
          done();
        });
    });
  });

  // create
  describe('/POST project', () => {
    it('Записать новый Project', (done) => {
      const data = {
        name: 'Контракт №23',
        object_code: 10023,
        contract_number: 23,
        contract_date: '2019-12-19T00:00:00.000Z',
        customer_id: 12,
        contractor_id: 12,
      };
      chai.request(server)
        .post('/project')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.not.have.property('errors');
          done();
        });
    });

    it('Записать новый не правильный Project', (done) => {
      const data = {
        name: 'Контракт №23',
        object_code: 10023,
        contract_number: 23,
        contract_date: '2019-12-19T00:00:00.000Z',
      };
      chai.request(server)
        .post('/project')
        .send(data)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('customer_id');
          res.body.errors.should.have.property('contractor_id');
          done();
        });
    });
  });

  // update
  describe('/PUT project', () => {
    it('обновление Project', async () => {
      let record = new Project({
        name: 'Контракт №23',
        object_code: 10023,
        contract_number: 23,
        contract_date: '2019-12-19T00:00:00.000Z',
        customer_id: 11,
        contractor_id: 11,
      });
      record = await record.save();
      chai.request(server)
        .put(`/project/${record.id}`)
        .send({
          name: 'Контракт №23',
          object_code: 10023,
          contract_number: 23,
          contract_date: '2019-12-19T00:00:00.000Z',
          customer_id: 12,
          contractor_id: 12,
        })
        .end(async (err, res) => {
          if (res.status === 200) {
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Контракт №23');
            res.body.should.have.property('customer_id').eql(12);
            res.body.should.have.property('contractor_id').eql(12);
          } else {
            res.should.have.status(204);
          }

          const dbRecord = await Project.findById(record.id);

          chai.expect(dbRecord).should.be.a('oobject');
          dbRecord.should.have.property('customer_id').eql(12);
          dbRecord.should.have.property('contractor_id').eql(12);
        });
    });
  });

  // delete
  describe('/DELETE project', () => {
    it('Удаление project', async () => {
      const record = new Project({
        name: 'Контракт №23',
        object_code: 10023,
        contract_number: 23,
        contract_date: '2019-12-19T00:00:00.000Z',
        customer_id: 12,
        contractor_id: 12,
      });
      await record.save();
      chai.request(server)
        .delete(`/project/${record.id}`)
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          const result = await Project.findById(record.id);
          should.equal(result, null);
        });
    });
  });
});
 */