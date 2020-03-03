const ObjectExtend = (obj1, obj2) => {
  for (const key in obj2) {
    // eslint-disable-next-line no-param-reassign
    obj1[key] = obj2[key];
  }
  return obj1;
};

module.exports = {
  ObjectExtend,
};
