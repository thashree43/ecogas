import { Router } from "express";
import { AdminController } from "../controller/adminController";
import { AdminRepository } from "../../infrastructure/repository";
import {
  Adminloginusecase,
  getuserusecase,
  updateusecase,
  getagentusecase,
  updateapprovalusecase,
  admingetallorderusecasse,
} from "../../usecase";
import { adminauth } from "../middleware/adminauth";

const AdminRepositoryInstance = new AdminRepository();

const AdminLoginUseCaseInstance = new Adminloginusecase(
  AdminRepositoryInstance
);
const GetUserUseCaseInstance = new getuserusecase(AdminRepositoryInstance);
const UpdateStatusUseCaseInstance = new updateusecase(AdminRepositoryInstance);
const GetAgentUseCaseInstance = new getagentusecase(AdminRepositoryInstance);
const UpdateApprovalUseCaseInstance = new updateapprovalusecase(
  AdminRepositoryInstance
);
const AdminGetallOrderUseCaseInstance = new admingetallorderusecasse(
  AdminRepositoryInstance
);
const AdminControllerInstance = new AdminController(
  AdminLoginUseCaseInstance,
  GetUserUseCaseInstance,
  UpdateStatusUseCaseInstance,
  GetAgentUseCaseInstance,
  UpdateApprovalUseCaseInstance,
  AdminGetallOrderUseCaseInstance
);

let router = Router();
router.post("/adminlogin", (req, res, next) =>
  AdminControllerInstance.adminlogin(req, res, next)
);
router.post("/adminlogout",(req,res,next)=>
AdminControllerInstance.adminlogout(req,res,next))

router.post("/refresh-token", (req, res, next) =>
  AdminControllerInstance.refreshToken(req, res, next)
);
router.get("/get_user",adminauth, (req, res, next) =>
  AdminControllerInstance.getusers(req, res, next)
);
router.patch(
  "/updatestatus/:id",
  adminauth,
  (req, res, next) => AdminControllerInstance.updatestatus(req, res, next)
);
router.get("/get_agent", adminauth, (req, res, next) =>
  AdminControllerInstance.getallagent(req, res, next)
);
router.patch("/updateapproval/:id", (req, res, next) =>
  AdminControllerInstance.updateapproval(req, res, next)
);
router.get(
  "/admingetorders",
  adminauth,
  (req, res, next) => AdminControllerInstance.getallorder(req, res, next)
);
export { router as adminroute };
