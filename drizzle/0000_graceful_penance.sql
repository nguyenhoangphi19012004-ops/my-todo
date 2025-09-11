CREATE TABLE `todos` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `todos_id` PRIMARY KEY(`id`)
);
