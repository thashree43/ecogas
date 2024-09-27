import { Router } from "express";
import { userController } from "../../../adapter/userController";
import {
  signupusecase,
  VerifyOtpUseCase,
  loginusecase,
  RequestpasswordUsecase,
  GoogleAuthUseCase,
  Resetpasswordusecase,
  ResentotpUseCase,
  Adminloginusecase,
  getuserusecase,
  updateusecase,
  GetProviderUserSideUseCase,
  addbookusecase,
  GetBookUseCase,
  deletebookusecase,
  orderplaceusecase,
  listorderusersideusecase
} from "../../../usecase";
import authenticateToken from "../../../middleware/Authmidleware";
import {
  UserRepository,
  RedisOtpRepository,
  AgentRepository,
} from "../../repository";
import { Otpservice } from "../../service/Otpservice";

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
const adminLoginUseCaseInstance = new Adminloginusecase(userRepositoryInstance);
const getUserUserCaseInstance = new getuserusecase(userRepositoryInstance);
const updateUseCaseInstance = new updateusecase(userRepositoryInstance);
const GetproviderUseCaseInstance = new GetProviderUserSideUseCase(
  agentRepositoryInstance
);
const AddBookUseCaseInstance = new addbookusecase(userRepositoryInstance);
const GetBookUseCaseInstance = new GetBookUseCase(userRepositoryInstance);
const DeleteBookUseCasseInstance = new deletebookusecase(
  userRepositoryInstance
);
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
  adminLoginUseCaseInstance,
  getUserUserCaseInstance,
  updateUseCaseInstance,
  GetproviderUseCaseInstance,
  AddBookUseCaseInstance,
  GetBookUseCaseInstance,
  DeleteBookUseCasseInstance,
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
router.post("/resetpassword", (req, res, next) =>
  userControllerInstance.forgetpassword(req, res, next)
);
router.patch("/updatepassword", (req, res, next) =>
  userControllerInstance.resetpassword(req, res, next)
);
router.post("/adminlogin", (req, res, next) =>
  userControllerInstance.adminlogin(req, res, next)
);
router.get("/get_user", authenticateToken(true), (req, res, next) =>
  userControllerInstance.getusers(req, res, next)
);
router.patch("/updatestatus/:id", authenticateToken(true), (req, res, next) =>
  userControllerInstance.updatestatus(req, res, next)
);
router.get(
  "/gas-providers/:pincode",
  authenticateToken(false, true),
  (req, res, next) => userControllerInstance.getprovider(req, res, next)
);

router.post("/addbook", authenticateToken(false, true), (req, res, next) =>
  userControllerInstance.addbook(req, res, next)
);

router.get("/getbook/:userId", (req, res, next) =>
  userControllerInstance.getbook(req, res, next)
);

router.delete(
  "/deletebook/:bookid",
  authenticateToken(false, true),
  (req, res, next) => userControllerInstance.deletebook(req, res, next)
);

router.post("/ordergas", (req, res, next) =>
  userControllerInstance.ordergas(req, res, next)
);

router.get('/getorders/:id',(req,res,next)=>userControllerInstance.getorders(req,res,next))
export { router as userroute };
