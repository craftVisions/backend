CREATE TYPE "public"."login_method_enum" AS ENUM('local', 'github', 'google');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('admin', 'user');--> statement-breakpoint
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
	CONSTRAINT "auth_email_unique" UNIQUE("email")
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
ALTER TABLE "users" ADD CONSTRAINT "users_credential_id_auth_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."auth"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_assets_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;