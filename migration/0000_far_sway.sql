CREATE TYPE "public"."login_method_enum" AS ENUM('local', 'github', 'google');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."reward_type_enum" AS ENUM('question_created', 'submission_created', 'test_case_created');--> statement-breakpoint
CREATE TYPE "public"."difficulty_enum" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"download_url" varchar(2048) NOT NULL,
	"upload_url" varchar(2048) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"password" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"role" "roles" DEFAULT 'user' NOT NULL,
	"login_method" "login_method_enum" DEFAULT 'local' NOT NULL,
	"refresh_token" text,
	CONSTRAINT "auth_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "otp_verification" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_id" uuid NOT NULL,
	"otp" text NOT NULL,
	"purpose" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"reward_type" "reward_type_enum" NOT NULL,
	"reference_id" uuid,
	"points_earned" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credential_id" uuid,
	"email" varchar(320) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100),
	"avatar_id" uuid,
	"urls" jsonb,
	CONSTRAINT "users_credential_id_unique" UNIQUE("credential_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty_enum" NOT NULL,
	"points" integer NOT NULL,
	"tags" text[],
	"hints" jsonb
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submitted_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"question_id" uuid NOT NULL,
	"solution" text NOT NULL,
	"language" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"score" numeric DEFAULT '0' NOT NULL,
	"execution_time" double precision,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"is_sample" boolean DEFAULT false NOT NULL,
	"input" text NOT NULL,
	"expected_output" text NOT NULL,
	"timeoutMs" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "otp_verification" ADD CONSTRAINT "otp_verification_identity_id_auth_id_fk" FOREIGN KEY ("identity_id") REFERENCES "public"."auth"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_credential_id_auth_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."auth"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_assets_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;