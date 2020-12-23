const axios = require("axios");
const finerio = axios.create({
  baseURL: `${process.env.FINERIO_URL}`,
});
const qs = require("qs");

const finerioToken = async () => {
  const url = `${process.env.FINERIO_URL}/oauth/token`;

  const credentials = Buffer.from(
    `${process.env.FINERIO_CLIENT_ID}:${process.env.FINERIO_CLIENT_SECRET}`
  ).toString("base64");

  const data = qs.stringify({
    username: process.env.FINERIO_USERNAME,
    password: process.env.FINERIO_PASSWORD,
    grant_type: "password",
  });

  const options = {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let response = await axios.post(
    `${process.env.FINERIO_URL}/oauth/token`,
    data,
    options
  );

  return response.data;
};

finerio.interceptors.request.use(
  async (config) => {
    const { access_token } = await finerioToken();

    config.headers = {
      Authorization: `Bearer ${access_token}`,
    };

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

finerio.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { access_token } = await finerioToken();

      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      return finerio(originalRequest);
    }

    return Promise.reject(error);
  }
);

module.exports = finerio;
