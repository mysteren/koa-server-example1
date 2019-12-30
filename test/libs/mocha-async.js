const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(() => {}, (err) => {
      done(err);
    });
  };
};

module.exports = mochaAsync;
