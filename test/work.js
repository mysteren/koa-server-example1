/* process.env.NODE_ENV = 'test';

// const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');
const Work = require('../app/models/work');

const should = chai.should();

chai.use(chaiHttp);
describe('WORK:', () => {
  beforeEach((done) => {
    Work.remove({}, () => {
      done();
    });
  });

  // get all
  describe('/GET works', () => {
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
  describe('/POST work', () => {
    it('Записать новый Entity', (done) => {
      const data = {
        name: 'построить дом',
      };
      chai.request(server)
        .post('/work')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.not.have.property('errors');
          done();
        });
    });

    it('Записать новый не правильный Entity', (done) => {
      const data = {
      };

      chai.request(server)
        .post('/work')
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
  describe('/PUT work', () => {
    it('обновление Work', async () => {
      let record = new Work({ name: 'name 1.0' });
      record = await record.save();
      chai.request(server)
        .put(`/work/${record.id}`)
        .send({
          name: 'name 1.1',
        })
        .end(async (err, res) => {
          if (res.status === 200) {
            res.body.should.be.a('object');
            res.body.should.have.property('name').deep.eql('name 1.1');
          } else {
            res.should.have.status(204);
          }

          const dbRecord = await Work.findById(record.id);

          dbRecord.should.notEqual(dbRecord, null);
          dbRecord.should.have.property('name').eql('name 1.1');
        });
    });
  });

  // delete
  describe('/DELETE work', () => {
    it('Удаление Work', async () => {
      const record = new Work({ name: 'Eitity 1', measure_id: 1 });
      await record.save();
      chai.request(server)
        .delete(`/work/${record.id}`)
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          const result = await Work.findById(record.id);
          should.equal(result, null);
        });
    });
  });
});
 */