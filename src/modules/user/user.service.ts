import { HttpStatus, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DrizzleService } from "src/db/drizzle.service";
import { CreateUser } from "./interfaces/user.interface";
import { users } from "src/db/schema/user";
import { CustomException } from "src/lib/exception/custom-exception";
import { HandleDbErrors } from "src/lib/decorators/handle-db-errors";

const USER_SERVICE_ERRORS = {
    users_email_unique: new CustomException("Email Already Exists", HttpStatus.CONFLICT),
};

@Injectable()
export class UserService {
    constructor(private readonly drizzleService: DrizzleService) {}

    @HandleDbErrors(USER_SERVICE_ERRORS)
    async createUser(input: CreateUser, tx?: any): Promise<string> {
        const db = tx || this.drizzleService.db;
        const [user] = await db.insert(users).values(input).returning({ id: users.id });
        return user.id;
    }

    async searchUsers() {
        const usersList = await this.drizzleService.db.select().from(users);
        return usersList; 
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
