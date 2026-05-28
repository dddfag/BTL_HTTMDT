const express = require("express");
const { createNewAdmin, removeAdmin, validateUserAsAnAdmin, getAdminDatas, getAllOrders, updateOrderStatus } = require("../controllers/admin");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation");

const router = express.Router();

router.route("/checkIfUserIsAdmin").get(checkIfUserIsAnAdminMiddleware, validateUserAsAnAdmin);
router.route("/createNewAdmin").post(checkIfUserIsAnAdminMiddleware, createNewAdmin);
router.route("/getAdminDatas").post(checkIfUserIsAnAdminMiddleware, getAdminDatas);
router.route("/removeAdmin").delete(checkIfUserIsAnAdminMiddleware, removeAdmin);
router.route("/getAllOrders").get(checkIfUserIsAnAdminMiddleware, getAllOrders);
router.route("/updateOrderStatus").patch(checkIfUserIsAnAdminMiddleware, updateOrderStatus);

module.exports = router;
