import { Router } from "express";
import { agentController } from "../controller/brokerController";
import {
  Agentapplyusecase,
  agentloginusecase,
  ProductAddingUsecase,
  listingproductusecase,
  EditProductUseCase,
  DeleteProductUseCase,
  getordersfromagentusecase,
  updateorderstatususecase,
} from "../../usecase";
import { AgentRepository } from "../../infrastructure/repository";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "thashree",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
// const uploadDir = path.join(__dirname, '..', '..', '..', '../../infrastructure/uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage: storage });

// Repository Instance
const AgentRepositoryInstance = new AgentRepository();

// Usecase Instance
const AgentApplyUsecaseInstance = new Agentapplyusecase(
  AgentRepositoryInstance
);
const AgentLoginUseCaseInstance = new agentloginusecase(
  AgentRepositoryInstance
);
const ProductAddingUseCaseInstance = new ProductAddingUsecase(
  AgentRepositoryInstance
);
const ListingProductUseCaseInstance = new listingproductusecase(
  AgentRepositoryInstance
);
const EditProductUseCaseInstance = new EditProductUseCase(
  AgentRepositoryInstance
);
const DeleteProductUseCaseInstance = new DeleteProductUseCase(
  AgentRepositoryInstance
);
const GetOrdersFromAgentUseCaseInstance = new getordersfromagentusecase(
  AgentRepositoryInstance
);
const UpdateOrderStatusUseCaseInstance = new updateorderstatususecase(
  AgentRepositoryInstance
);
// conntroller
const agentControllerInstance = new agentController(
  AgentApplyUsecaseInstance,
  AgentLoginUseCaseInstance,
  ProductAddingUseCaseInstance,
  ListingProductUseCaseInstance,
  EditProductUseCaseInstance,
  DeleteProductUseCaseInstance,
  GetOrdersFromAgentUseCaseInstance,
  UpdateOrderStatusUseCaseInstance
);

const router = Router();

router.post(
  "/apply",
  upload.single("image"),
  agentControllerInstance.agentregister
);
router.post("/agentlogin", agentControllerInstance.agentlogin);
router.post("/addproduct", agentControllerInstance.addProduct);
router.get("/getproduct", agentControllerInstance.listproduct);
router.patch("/editproduct", agentControllerInstance.editproduct);
router.delete("/deleteproduct/:id", agentControllerInstance.deleteProduct);
router.get("/agentgetorders", agentControllerInstance.getordersin);
router.patch("/orderstatus/:orderid", agentControllerInstance.statusupdate);
export { router as agentroute };

// Error handling middleware (add this to your main app file)
import { Request, Response, NextFunction } from "express";
import express from "express";

const app = express();
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});
