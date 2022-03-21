const sleep = (delay = 2000) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, delay);
  });
};

export default sleep;
