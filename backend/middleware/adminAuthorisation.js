const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../errors/customErrorHandler");
const Admin = require("../models/admin");
const User = require("../models/userData");

const checkIfUserIsAnAdminMiddleware = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || " ";

    console.log("=== Admin Auth Check ===");
    console.log("Auth Header:", authHeader ? "Present" : "Missing");
    console.log("Token:", token.substring(0, 20) + "...");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomErrorHandler(401, "Unauthorized,please relogin - no auth header");
    }

    const tokenVerification = jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, decoded) => {
      if (err) {
        console.log("Token verification error:", err.message);
        return false;
      } else {
        console.log("Token verified");
        return true;
      }
    });

    if (!tokenVerification) {
      throw new CustomErrorHandler(401, "Unauthorized,please relogin - invalid token");
    }

    let checkIfTokenExist = await User.findOne({ verificationToken: token });
    console.log("User with token found:", checkIfTokenExist ? checkIfTokenExist.email : "Not found");

    if (!checkIfTokenExist) {
      throw new CustomErrorHandler(401, "Unauthorized,only logged in admin may perfrom action - user not found");
    }

    console.log("User adminStatus:", checkIfTokenExist.adminStatus);

    if (checkIfTokenExist.adminStatus !== true) {
      throw new CustomErrorHandler(401, "Unauthorized,only logged in admin may perfrom action - not admin");
    }

    const adminData = await Admin.findOne({ userData: checkIfTokenExist._id });
    if (!adminData) {
      throw new CustomErrorHandler(401, "Unauthorized,only logged in admin may perfrom action - admin record not found");
    }

    console.log("Admin auth passed for:", checkIfTokenExist.email);

    res.locals.actionDoer = { doerRank: adminData.adminRank, doerData: checkIfTokenExist };
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    throw error;
  }
};

module.exports = { checkIfUserIsAnAdminMiddleware };
