import { IUserRepository } from "../infrastructure/repository";
import { verifypassword } from "../utilis";
import jwt from 'jsonwebtoken';

export class Adminloginusecase {
    constructor(private adminRepository: IUserRepository) {}

    async execute(email: string, password: string): Promise<any> {
        if (!email || !password) {
            return { success: false, message: "Email and password are required." };
        }
console.log("it may have reached upto the adminloginusecase ");

        const admin = await this.adminRepository.findbyEmail(email);

        console.log("it may have reached upto the adminRepository ");

        if (!admin) {
            return { success: false, message: "Admin doesn't exist." };
        }

        if (admin.is_admin) {
            const isPassValid = await verifypassword(password, admin.password);
            if (!isPassValid) {
                return { success: false, message: "Password is not correct." };
            }

            const token = jwt.sign(
                { id: admin._id, email: admin.email, is_admin: true },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '1h' }
            );

            return { success: true, admin, token };
            console.log("the adminlogin case wa");
            
        }

        return { success: false, message: "You are not authorized." };
    }
}