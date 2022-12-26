export default (authorization) => {
  const credential = Buffer.from(authorization.slice(6), "base64").toString("utf8");
  return credential === process.env.PASS_ADMIN;
};
