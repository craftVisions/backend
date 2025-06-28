import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(config: ConfigService) {
        super({
            clientID: config.get<string>("GOOGLE_CLIENT_ID") || "",
            clientSecret: config.get<string>("GOOGLE_CLIENT_SECRET") || "",
            callbackURL: "http://localhost:3000/auth/google/redirect",
            scope: ["email", "profile"],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos, id } = profile;
        const user = {
            providerId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            avatar: photos[0].value,
            provider: "google",
        };

        console.log(user);
        done(null, user);
    }
}
