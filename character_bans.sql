CREATE TABLE IF NOT EXISTS `character_bans` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`identifier` VARCHAR(60) NOT NULL,
	`char_slot` INT(11) NOT NULL,
	`banned_until` BIGINT(20) NOT NULL,
	`reason` VARCHAR(255) NULL DEFAULT NULL,
	`banned_by` VARCHAR(60) NOT NULL,
	`banned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `identifier_slot` (`identifier`, `char_slot`) USING BTREE,
	INDEX `banned_until` (`banned_until`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
