import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ResponseData } from "src/lib/transformer/response";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "src/guards/auth.guard";
import { UserContext } from "src/lib/decorators/user-context";
import { User } from "src/interfaces/user";

@Controller("user")
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(@UserContext() {userId}: User) {
        const users = await this.userService.searchUsers();
        return ResponseData({ users });
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.userService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.userService.remove(+id);
    }
}
