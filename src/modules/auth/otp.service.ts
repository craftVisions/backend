import { Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";
import { DrizzleService } from "src/db/drizzle.service";
import { eq, and, desc } from "drizzle-orm";
import { randomInt } from "crypto";
import { addMinutes, isAfter } from "date-fns";
import { ConfigService } from "@nestjs/config";
import { otpVerification } from "src/db/schema";
import { HandleDbErrors } from "src/lib/decorators";

@Injectable()
export class OtpService {
    constructor(
        private readonly drizzle: DrizzleService,
        private readonly configService: ConfigService,
    ) {}

    private generateOtp(): string {
        return randomInt(100000, 999999).toString();
    }

    @HandleDbErrors({})
    async createOtp(identityId: string, purpose: string): Promise<string> {
        const otp = this.generateOtp();
        const expiryMinutes = parseInt(this.configService.get("OTP_EXPIRY_MINUTES") ?? "5", 10);
        const expiresAt = addMinutes(new Date(), expiryMinutes);

        await this.drizzle.db.insert(otpVerification).values({
            identityId,
            purpose,
            otp,
            expiresAt,
        });

        return otp;
    }

    @HandleDbErrors({})
    async verifyOtp(identityId: string, otp: string): Promise<{ isVerified: boolean; purpose: string }> {
        const [record] = await this.drizzle.db
            .select()
            .from(otpVerification)
            .where(and(eq(otpVerification.identityId, identityId), eq(otpVerification.isVerified, false)))
            .orderBy(desc(otpVerification.createdAt))
            .limit(1);

        if (!record) {
            throw new BadRequestException("OTP not found or already used.");
        }

        if (record.attempts >= 5) {
            throw new ForbiddenException("Too many attempts. Try again later.");
        }

        if (isAfter(new Date(), new Date(record.expiresAt))) {
            throw new BadRequestException("OTP expired.");
        }

        if (record.otp !== otp) {
            await this.drizzle.db
                .update(otpVerification)
                .set({ attempts: record.attempts + 1 })
                .where(eq(otpVerification.id, record.id));

            throw new BadRequestException("Incorrect OTP.");
        }

        await this.drizzle.db.update(otpVerification).set({ isVerified: true }).where(eq(otpVerification.id, record.id));

        return {
            isVerified: true,
            purpose: record.purpose,
        };
    }
}
