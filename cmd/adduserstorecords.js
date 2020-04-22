#!/usr/bin/env node
require('../app/db');

const User = require('../app/models/user');
const Project = require('../app/models/project');
const Statement = require('../app/models/statement');
const Register = require('../app/models/register');
const DocKS2 = require('../app/models/docks2');
const DocKS3 = require('../app/models/docks3');
const Measure = require('../app/models/measure');
const Entity = require('../app/models/entity');

const start = async () => {
  const getUsers = new Promise((resolve) => {
    resolve(User.find());
  });

  const getProjects = new Promise((resolve) => {
    resolve(Project.find());
  });

  const getMeasure = new Promise((resolve) => {
    resolve(Measure.find());
  });

  const getEntity = new Promise((resolve) => {
    resolve(Entity.find());
  });

  let userOwner;

  Promise.all([getUsers, getProjects, getMeasure, getEntity])
    .then((values) => {
      const [users, projects, measures, entities] = values;
      const promises = [];
      if (users.length && projects.length) {
        userOwner = users.find((u) => u.username === 'admin') || users[0];

        [projects, measures, entities].forEach((modelsList) => {
          modelsList.forEach((r) => {
            if (!r.user) {
              const project = r;
              project.user = userOwner._id;
              promises.push(project.save());
            }
          });
        });
      } else {
        throw new Error('records empty');
      }
      promises.unshift(Project.find());
      promises.unshift(Statement.find());
      promises.unshift(DocKS2.find());
      promises.unshift(DocKS3.find());
      promises.unshift(Register.find());
      return Promise.all(promises);
    })
    .then((values) => {
      const promises = [];
      const [registers, docks3rcds, docks2rcds, statements, projects] = values;

      [registers, docks3rcds, docks2rcds, statements].forEach((modelsList) => {
        // console.log(modelsList.length);
        modelsList.forEach((r) => {
          if (!r.user) {
            const project = projects.find((p) => p._id.equals(r.project));
            if (project) {
              const record = r;
              record.user = project.user;
              promises.push(record.save());
            }
          }
        });
      });

      return Promise.all(promises);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      process.exit();
    });
};

start();
