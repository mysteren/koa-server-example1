module.exports = {
  app: {
    name: 'dordoc-api',
    version: '0.1.4',
  },
  server: {
    port: 3002,
  },
  logger: true,
  mongodb: {
    host: 'localhost',
    port: 27017,
    user: '',
    pass: '',
    base: 'dordoc',
  },
  server_test: {
    port: 3003,
  },
  mongodb_test: {
    host: 'localhost',
    port: 27017,
    user: '',
    pass: '',
    base: 'dordoc-test',
  },
};
