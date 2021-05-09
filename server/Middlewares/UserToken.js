const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    process.env.ACCESSTOKEN
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.json({ error: "User not Authenticated!" });
  }
  try {
    const validToken = verify(accessToken, process.env.ACCESSTOKEN);
    if (validToken) {
      req.user = {validToken};
      return next();
    }
  } catch (err) {
    res.clearCookie("access-token");
    return res.json({ error: err });
  }
};

module.exports = { createTokens, validateToken };