process.env.NODE_ENV = 'test';

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
  describe('/GET work', () => {
    it('Получить список всех Work', (done) => {
      chai.request(server)
        .get('/work')
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
    it('Записать новый Work', (done) => {
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

    it('Записать новый не правильный Work', (done) => {
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
  describe('/PUT Work', () => {
    it('обновление Work', (done) => {
      new Promise((resolve) => {
        const record = new Work({
          _id: 1,
          name: 'Work',
          measure_id: 1,
        });
        resolve(record.save());
      })
        .then((record) => chai.request(server)
          .put(`/work/${record.id}`)
          .send({
            name: 'Work 11',
            measure_id: 1,
          }))

        .then((res) => {
          if (res.status === 200) {
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Work 11');
            res.body.should.have.property('measure_id').eql(1);
          } else {
            res.should.have.status(204);
          }
          return Work.findById(1);
        })
        .then((record) => {
          should.not.equal(record, null);
          record.should.have.property('name').eql('Work 11');
          record.should.have.property('measure_id').eql(1);
          done();
        })
        .catch(done);
    });
  });

  // delete
  describe('/DELETE Work', () => {
    it('Удаление Work', (done) => {
      new Promise((resolve) => {
        const record = new Work({ name: 'Work 2', measure_id: 1 });
        resolve(record.save());
      })

        .then((record) => {
          Work.countDocuments((err, count) => {
            console.log(count);
          });
          return record;
        })

        .then((record) => chai.request(server)
          .delete(`/work/${record.id}`))

        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          // console.log(res.body.id);

          return Work.countDocuments();
        })

        .then((record) => {
          should.equal(record, 0);
          done();
        })
        .catch(done);
    });
  });
});

/*   // update
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
}); */
