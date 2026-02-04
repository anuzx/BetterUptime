import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getWebsite, postWebsite } from "../../controller/web.controller";

const router = Router();

router.route("/").post(authMiddleware, postWebsite);

router.route("/status/:websiteId").get(authMiddleware, getWebsite);

export default router;
