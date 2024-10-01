import { NextFunction, Request, Response } from "express";
import { 
    getagentusecase,
    updateapprovalusecase,
    admingetallorderusecasse
} from "../../usecase";
import nodemailer from 'nodemailer'; 


export class AdminController {
  constructor(
    private getAgentUseCaseInstance: getagentusecase,
    private UpdateApprovalUseCaseInstance :updateapprovalusecase,
    private AdminGetallOrdersInstance :admingetallorderusecasse,

) {}

  async getallagent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agents = await this.getAgentUseCaseInstance.execute(); // Call the use case
      res.status(200).json({ success: true, agents }); // Respond with the agent list
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch agents" });
    }
  }
  async updateapproval(req:Request,res:Response,next:NextFunction):Promise<void>{
    const {id} = req.params;
    const {is_Approved} = req.body

    console.log(id,is_Approved,"from  the admin side ");
    if (!id) {
        res.status(400).json({ success: false, message: "User ID not provided" });
        return;
      }
    
    try {
        const updateapproval = await this.UpdateApprovalUseCaseInstance.execute(id,{is_Approved})
        if (!updateapproval) {
            res.status(404).json({ success: false, message: "agnet not found" });
            return;
          }
          res.status(200).json({ success: true, agent:updateapproval });
          const approvalStatus = is_Approved ? "Approved" : "Rejected";
          await this.sendApprovalEmail(updateapproval.email, approvalStatus, updateapproval.agentname);

          res.status(200).json({ success: true, agent: updateapproval });
    } catch (error) {
     next(error)   
    }
  }



 // Email sending method
 private async sendApprovalEmail(email: string, status: string, agentName: string) {
    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services or SMTP
        auth: {
            user: process.env.EMAIL_USER, // Use your email
            pass: process.env.EMAIL_PASS, // Use your password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your Agent Account is ${status}`,
        text: `Hello ${agentName},\n\nYour agent account has been ${status}.`,
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} with status: ${status}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
}
async getallorder(
  req:Request,
  res:Response,
  next:NextFunction
):Promise<void>{
  try {
    const orders = await this.AdminGetallOrdersInstance.execute();
    res.status(200).send({success:true,orders})
  } catch (error) {
    console.error(error);
    
  }
}
}
