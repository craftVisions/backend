import { HttpStatus, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DrizzleService } from "src/db/drizzle.service";
import { CreateUser } from "./interfaces/user.interface";
import { users } from "src/db/schema/user";
import { CustomException } from "src/lib/exception/custom-exception";
import { HandleDbErrors } from "src/lib/errors/handle-db-errors";

const USER_SERVICE_ERRORS = {
    users_email_unique: new CustomException("Email Already Exists", HttpStatus.CONFLICT),
};

@Injectable()
export class UserService {
    constructor(private readonly drizzleService: DrizzleService) {}

    @HandleDbErrors(USER_SERVICE_ERRORS)
    async create(input: CreateUser): Promise<string> {
        const [user] = await this.drizzleService.db.insert(users).values(input).returning({ id: users.id });
        return user.id;
    }

    findAll() {
        return `This action returns all user`;
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
