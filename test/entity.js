process.env.NODE_ENV = 'test';

// const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');
const Entity = require('../app/models/entity');

const should = chai.should();

chai.use(chaiHttp);
describe('ENTITY', () => {
  beforeEach((done) => {
    Entity.remove({}, () => {
      done();
    });
  });

  // get all
  describe('/GET entity', () => {
    it('Получить список всех Entity', (done) => {
      chai.request(server)
        .get('/entity')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  // get create
  describe('/POST Entity', () => {
    it('Записать новый Entity', (done) => {
      const data = {
        name: 'name',
        address: 'string',
        phone: '+7 (000) 000-00-00',
        inn: '0010101',
        opko: '00001010',
      };

      chai.request(server)
        .post('/entity')
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
        // name: '121431412',
        address: 'string',
        phone: '+7 (000) 000-00-00',
        inn: '0010101',
        opko: '00001010',
      };

      chai.request(server)
        .post('/entity')
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
  describe('/PUT Entity', () => {
    it('обновление Entity', (done) => {
      new Promise((resolve) => {
        const record = new Entity({
          _id: 1,
          name: 'Eitity 1',
          address: 'text2',
          phone: '+7 (000) 000-00-00',
        });
        resolve(record.save());
      })

        .then((record) => chai.request(server)
          .put(`/entity/${record.id}`)
          .send({
            name: 'Eitity #233424',
            address: null,
            phone: '+7 (000) 101-00-00',
            inn: '0002',
          }))

        .then((res) => {
          if (res.status === 200) {
            res.body.should.be.a('object');
            res.body.should.have.property('address').eql(null);
            res.body.should.have.property('phone').eql('+7 (000) 101-00-00');
            res.body.should.have.property('inn').eql('0002');
          } else {
            res.should.have.status(204);
          }
          return Entity.findById(1);
        })

        .then((record) => {
          should.not.equal(record, null);
          record.should.have.property('address').eql(null);
          record.should.have.property('phone').eql('+7 (000) 101-00-00');
          record.should.have.property('inn').eql('0002');
          done();
        })
        .catch(done);
    });
  });

  // delete
  describe('/DELETE Entity', () => {
    it('Удаление Entity', (done) => {
      new Promise((resolve) => {
        const record = new Entity({ name: 'Eitity 1', address: 'text2', phone: '+7 (000) 666-00-00' });
        resolve(record.save());
      })

      /* .then((record) => {
          Entity.countDocuments((err, count) => {
            console.log(count);
          });
          return record;
        }) */

        .then((record) => chai.request(server)
          .delete(`/entity/${record.id}`))

        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          // console.log(res.body.id);

          return Entity.countDocuments();
        })

        .then((record) => {
          should.equal(record, 0);
          done();
        })
        .catch(done);
    });
  });
});
