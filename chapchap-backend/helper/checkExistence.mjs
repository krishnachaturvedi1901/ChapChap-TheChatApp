export const checkExistence = (uncheckedObj) => {
  const messageArr = [];
  Object.entries(uncheckedObj).forEach(([key, val]) => {
    if (!val) {
      messageArr.push(`${key} is a required entity`);
    }
  });
  if (messageArr.length > 0) {
    return {
      isAllExist: false,
      message: messageArr,
    };
  } else {
    return {
      isAllExist: true,
      message: messageArr,
    };
  }
};
