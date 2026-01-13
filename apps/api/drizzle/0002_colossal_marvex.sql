ALTER TABLE `tags` ADD `userId` text NOT NULL REFERENCES users(id);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_user_id_name_unique` ON `tags` (`userId`,`name`);