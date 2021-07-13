-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sys
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `doubts`
--

DROP TABLE IF EXISTS `doubts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doubts` (
  `doubt_id` int NOT NULL AUTO_INCREMENT,
  `doubt_title` varchar(180) NOT NULL,
  `doubt_description` varchar(720) NOT NULL,
  `student_id` varchar(135) NOT NULL,
  `solved_by` varchar(135) DEFAULT NULL,
  `creation_timestamp` datetime DEFAULT NULL,
  `status` varchar(45) DEFAULT 'unsolved',
  `solve_timestamp` datetime DEFAULT NULL,
  `solution` varchar(720) DEFAULT NULL,
  `n_escalated` int DEFAULT '0',
  PRIMARY KEY (`doubt_id`),
  UNIQUE KEY `doubt_id_UNIQUE` (`doubt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doubts`
--

LOCK TABLES `doubts` WRITE;
/*!40000 ALTER TABLE `doubts` DISABLE KEYS */;
INSERT INTO `doubts` VALUES (1,'Condition in Mysql','How to add a condition in Mysql?','Amit','Vishal','2021-07-13 21:35:18','solved','2021-07-13 21:51:54','You can use WHERE clause which can specify the condition',0),(2,'Check if number is even','How to check if number is even?','Chirag','Sankalp','2021-07-13 21:37:09','solved','2021-07-13 21:45:38','You can use modulo symbol % and check if number % 2 equals 0',0),(3,'Melody Toffees','Melody etni chocolaty kyo hai?','Deepank','Anshuman','2021-07-13 21:41:49','solved','2021-07-13 22:07:29','Khao or khud jan Jao!',0),(4,'Time Travel','Can we travel time if we reach speed of light?','Chirag','Anshuman','2021-07-13 21:48:59','solved','2021-07-13 22:05:57','Theoretically, yes you can but whether you survive or not is a different question :P',0);
/*!40000 ALTER TABLE `doubts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-13 22:17:26
