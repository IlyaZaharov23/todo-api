const getReqError = (path, location, msg, value) => {
  const error = {
    type: "field",
    msg: msg,
    path: path,
    location: location,
  };

  if (typeof value === "string") {
    error.value = value;
  }

  return error;
};

const createAuthHeader = (token) => `Bearer ${token}`;

module.exports = {
  getReqError,
  createAuthHeader,
};
