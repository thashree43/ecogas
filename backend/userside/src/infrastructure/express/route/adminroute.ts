import { Router } from "express";
import { AdminController } from "../../../adapter/adminController";
import { AdminRepository } from "../../../infrastructure/repository";
import { 
    getagentusecase,
    updateapprovalusecase,
    admingetallorderusecasse
} from "../../../usecase";
import authenticateToken from "../../../middleware/Authmidleware";

const AdminRepositoryInstance = new AdminRepository();
const GetAgentUseCaseInstance = new getagentusecase(AdminRepositoryInstance);
const UpdateApprovalUseCaseInstance = new updateapprovalusecase(AdminRepositoryInstance)
const AdminGetallOrderUseCaseInstance = new admingetallorderusecasse(AdminRepositoryInstance)
const AdminControllerInstance = new AdminController(
    GetAgentUseCaseInstance,
    UpdateApprovalUseCaseInstance,
    AdminGetallOrderUseCaseInstance
);


let router = Router();

router.get('/get_agent',authenticateToken(true), (req, res, next) => AdminControllerInstance.getallagent(req, res, next));
router.patch('/updateapproval/:id',(req,res,next)=>AdminControllerInstance.updateapproval(req,res,next))
router.get('/admingetorders',(req,res,next)=>AdminControllerInstance.getallorder(req,res,next))
export { router as adminroute };
