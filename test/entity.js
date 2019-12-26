process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app/index');
const Entity = require('../app/models/entity');

const should = chai.should();

chai.use(chaiHttp);
describe('Entity', () => {
  console.log('start test');
});
