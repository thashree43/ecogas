import {IagentData} from "../entities"
import {IadminRepository} from "../infrastructure/repository"

export class updateapprovalusecase {
    constructor(private IAdminRepository:IadminRepository){}

    async execute(id:string,data:object):Promise<IagentData | null>{
        const updatapproval = await this.IAdminRepository.updateApproval(id,data)
        if (!updatapproval) {
            throw new Error(" the datas are not found")
        }
        return updatapproval
    }
}