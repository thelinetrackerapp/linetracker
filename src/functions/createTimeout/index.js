const fn = (t) => {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
};

export default fn;
