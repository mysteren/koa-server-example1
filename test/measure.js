/* process.env.NODE_ENV = 'test';

// const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');
const Measure = require('../app/models/measure');

const should = chai.should();

chai.use(chaiHttp);
describe('MEASURE:', () => {
  beforeEach((done) => {
    Measure.remove({}, () => {
      done();
    });
  });

  // get all
  describe('/GET measure', () => {
    it('Получить список всех Measure', (done) => {
      chai.request(server)
        .get('/measure')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          should.equal(res.body.length, 0);
          done();
        });
    });
  });

  // create
  describe('/POST measure', () => {
    it('Записать новый Measure', (done) => {
      const data = {
        name: 'построить дом',
      };
      chai.request(server)
        .post('/measure')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.not.have.property('errors');
          done();
        });
    });

    it('Записать новый не правильный measure', (done) => {
      const data = {
        name: null,
      };

      chai.request(server)
        .post('/measure')
        .send(data)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          done();
        });
    });
  });

  // update
  describe('/PUT measure', () => {
    it('обновление measure', async () => {
      let record = new Measure({ name: 'name 1.0' });
      record = await record.save();
      chai.request(server)
        .put(`/measure/${record.id}`)
        .send({
          name: 'name 1.1',
        })
        .end(async (err, res) => {
          if (res.status === 200) {
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('name 1.1');
          } else {
            res.should.have.status(204);
          }

          const dbRecord = await Measure.findById(record.id);

          chai.expect(dbRecord).not.to.be.null;
          // should.not.equal(dbRecord, null);
          dbRecord.should.have.property('name').eql('name 1.1');
        });
    });
  });

  // delete
  describe('/DELETE measure', () => {
    it('Удаление measure', async () => {
      const record = new Measure({ name: 'Eitity 1', address: 'text2', phone: '+7 (000) 000-00-00' });
      await record.save();
      chai.request(server)
        .delete(`/measure/${record.id}`)
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          const result = await Measure.findById(record.id);
          should.equal(result, null);
        });
    });
  });
});
 */