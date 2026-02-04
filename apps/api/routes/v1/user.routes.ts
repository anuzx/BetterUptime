import { Router } from "express";
import { handleSignin, handleSignup } from "../../controller/user.controller"

const router = Router()

router.route("/signup").post(handleSignup)
router.route("/signin").post(handleSignin)


export default router