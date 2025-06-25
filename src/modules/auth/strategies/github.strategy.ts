import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor() {
        super({
            clientID: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            callbackURL: "http://localhost:3000/auth/github/redirect",
            scope: ["user:email"],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const { id, username, emails } = profile;
        const user = {
            providerId: id,
            username,
            email: emails?.[0]?.value,
            provider: "github",
        };

        console.log({user});
        done(null, user);
    }
}
