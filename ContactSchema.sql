-- SQL query to create contact table 

CREATE TABLE `Contact` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(16) DEFAULT NULL,
  `email` varchar(25) DEFAULT NULL,
  `linkedId` int DEFAULT NULL,
  `linkPrecedence` enum('PRIMARY','SECONDARY') NOT NULL DEFAULT 'PRIMARY',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);