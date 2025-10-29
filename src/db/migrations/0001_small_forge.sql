CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"sub_categories" jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"link" text DEFAULT '#',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
