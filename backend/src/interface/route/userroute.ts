import { Router } from "express";
import { userController } from "../controller/userController";

import {
  signupusecase,
  VerifyOtpUseCase,
  loginusecase,
  RequestpasswordUsecase,
  GoogleAuthUseCase,
  Resetpasswordusecase,
  ResentotpUseCase,
  GetProviderUserSideUseCase,
  addbookusecase,
  GetBookUseCase,
  deletebookusecase,
  orderplaceusecase,
  listorderusersideusecase
} from "../../usecase";
import {
  UserRepository,
  RedisOtpRepository,
  AgentRepository,
} from "../../infrastructure/repository";
import { Otpservice } from "../../infrastructure/service/Otpservice";
import { userauth } from "../middleware/userauth";

// Create instances of repositories, services, and use cases
const userRepositoryInstance = new UserRepository();
const OtpServiceInstance = new Otpservice();
const redisOtpRepositoryInstance = new RedisOtpRepository();
const agentRepositoryInstance = new AgentRepository();

const googleAuthUseCaseInstance = new GoogleAuthUseCase(userRepositoryInstance);
const signupUseCaseInstance = new signupusecase(
  userRepositoryInstance,
  OtpServiceInstance,
  redisOtpRepositoryInstance
);
const verifyOtpInstance = new VerifyOtpUseCase(
  redisOtpRepositoryInstance,
  userRepositoryInstance
);
const loginusecaseInstance = new loginusecase(userRepositoryInstance);
const requestPasswordUseCaseInstance = new RequestpasswordUsecase(
  userRepositoryInstance,
  redisOtpRepositoryInstance,
  OtpServiceInstance
);
const resetPasswordUseCaseInstance = new Resetpasswordusecase(
  userRepositoryInstance,
  redisOtpRepositoryInstance
);
const resentOtpUseCaseInstance = new ResentotpUseCase(
  OtpServiceInstance,
  redisOtpRepositoryInstance
);
const GetproviderUseCaseInstance = new GetProviderUserSideUseCase(
  agentRepositoryInstance
);
const AddBookUseCaseInstance = new addbookusecase(userRepositoryInstance);
const GetBookUseCaseInstance = new GetBookUseCase(userRepositoryInstance);
const DeleteBookUseCaseInstance = new deletebookusecase(userRepositoryInstance);

const OrderPlaceUseCaseInstance = new orderplaceusecase(userRepositoryInstance);
const ListOrderUserSideUseCaseInstance = new listorderusersideusecase(userRepositoryInstance)
// instances of the user controller
const userControllerInstance = new userController(
  signupUseCaseInstance,
  verifyOtpInstance,
  loginusecaseInstance,
  googleAuthUseCaseInstance,
  requestPasswordUseCaseInstance,
  resetPasswordUseCaseInstance,
  resentOtpUseCaseInstance,
  GetproviderUseCaseInstance,
  AddBookUseCaseInstance,
  GetBookUseCaseInstance,
  DeleteBookUseCaseInstance,
  OrderPlaceUseCaseInstance,
  ListOrderUserSideUseCaseInstance
);

const router = Router();

// Define routes
router.post("/register", (req, res, next) =>
  userControllerInstance.signup(req, res, next)
);
router.post("/verifyotp", (req, res, next) =>
  userControllerInstance.verifyotp(req, res, next)
);
router.post("/resendotp", (req, res, next) =>
  userControllerInstance.resendotp(req, res, next)
);
router.post("/login", (req, res, next) =>
  userControllerInstance.loginuse(req, res, next)
);
router.post("/google-login", (req, res, next) =>
  userControllerInstance.googleAuth(req, res, next)
);
router.post("/userrefresh-token",(req,res,next)=>
userControllerInstance.userrefreshtoken(req,res,next))
router.post("/resetpassword", (req, res, next) =>
  userControllerInstance.forgetpassword(req, res, next)
);
router.patch("/updatepassword", (req, res, next) =>
  userControllerInstance.resetpassword(req, res, next)
);

router.get(
  "/gas-providers/:pincode",
  userauth,
  (req, res, next) => userControllerInstance.getprovider(req, res, next)
);

router.post("/addbook", userauth, (req, res, next) =>
  userControllerInstance.addbook(req, res, next)
);

router.get("/getbook/:userId", (req, res, next) =>
  userControllerInstance.getbook(req, res, next)
);

router.delete(
  "/deletebook/:bookid",
  userauth,
  (req, res, next) => userControllerInstance.deletebook(req, res, next)
);

router.post("/ordergas", (req, res, next) =>
  userControllerInstance.orderplace(req, res, next)
);

router.get('/getorders/:id',userauth,(req,res,next)=>userControllerInstance.listorderuserside(req,res,next))
export { router as userroute };
