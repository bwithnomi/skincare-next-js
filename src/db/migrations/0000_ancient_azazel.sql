CREATE TABLE `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`patient` varchar(255) NOT NULL,
	`issue` text NOT NULL,
	`consultation_type` varchar(255) NOT NULL,
	`checkup_date` varchar(50) NOT NULL,
	`checkup_slot` varchar(50) NOT NULL,
	`payment_status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
	`appointment_status` enum('pending','confirmed','cancelled','completed','resheduled') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `footer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`address` text DEFAULT ('Address'),
	`email` varchar(255) DEFAULT 'email',
	`phone` varchar(50) DEFAULT 'phone',
	`facebook` varchar(255) DEFAULT '#',
	`linkedin` varchar(255) DEFAULT '#',
	`instagram` varchar(255) DEFAULT '#',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `footer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`whatsapp` varchar(50) DEFAULT '',
	`phone` varchar(50) NOT NULL,
	`password` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `doctor_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`weekly_schedule` text NOT NULL,
	`effective_from` timestamp NOT NULL DEFAULT (now()),
	`effective_until` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `doctor_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`sub_categories` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`link` varchar(255) DEFAULT '#',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_email_users_email_fk` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE no action ON UPDATE no action;