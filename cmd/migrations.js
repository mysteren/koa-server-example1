#!/usr/bin/env node
require('./../app/db');

const User = require('./../app/models/user');
const Project = require('./../app/models/project');
const Statement = require('./../app/models/statement');
const Register = require('./../app/models/register');
const DocKS2 = require('./../app/models/docks2');
const DocKS3 = require('./../app/models/docks3');
const Measure = require('./../app/models/measure');
const Entity = require('./../app/models/entity');

const m_v1 = async () => {
  const getUsers = new Promise((resolve) => {
    resolve(User.find());
  });

  const getProjects = new Promise((resolve) => {
    resolve(Project.find());
  });

  const getStatement = new Promise((resolve) => {
    resolve(Statement.find());
  });

  const getRegister = new Promise((resolve) => {
    resolve(Register.find());
  });

  const getDocKS2 = new Promise((resolve) => {
    resolve(DocKS2.find());
  });

  const getDocKS3 = new Promise((resolve) => {
    resolve(DocKS3.find());
  });

  const getMeasure = new Promise((resolve) => {
    resolve(Measure.find());
  });

  const getEntity = new Promise((resolve) => {
    resolve(Entity.find());
  });

  Promise.all([
    getUsers,
    getProjects,
    getStatement,
    getRegister,
    getDocKS2,
    getDocKS3,
    getMeasure,
    getEntity,
  ])
    .then((values) => {
      const createDate = new Date('2020');
      const updateDate = new Date();
      const promises = [];
      values.forEach((modelsList) => {
        modelsList.forEach((r) => {
          // console.log(r);
          const record = r;
          let upgrade = false;
          if (!record.__v) {
            record.__v = 0;
            upgrade = true;
          }

          if (!record.createdAt) {
            record.createdAt = createDate;
            upgrade = true;
          }

          if (!record.updatedAt) {
            record.updatedAt = updateDate;
            upgrade = true;
          }

          if (upgrade) {
            promises.push(record.save());
          }
        });
      });

      return Promise.all(promises);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    })
    .finally(() => {
      process.exit();
    });
};

m_v1();
