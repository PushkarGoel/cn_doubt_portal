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
-- Table structure for table `doubt_ta_mapping`
--

DROP TABLE IF EXISTS `doubt_ta_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doubt_ta_mapping` (
  `mapping_id` int NOT NULL AUTO_INCREMENT,
  `doubt_id` varchar(45) NOT NULL,
  `ta_id` varchar(45) NOT NULL,
  `assign_time` datetime NOT NULL,
  `pass_time` datetime DEFAULT NULL,
  `action_taken` varchar(45) DEFAULT 'assigned',
  PRIMARY KEY (`mapping_id`),
  UNIQUE KEY `mapping_id_UNIQUE` (`mapping_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doubt_ta_mapping`
--

LOCK TABLES `doubt_ta_mapping` WRITE;
/*!40000 ALTER TABLE `doubt_ta_mapping` DISABLE KEYS */;
INSERT INTO `doubt_ta_mapping` VALUES (2,'2','Sankalp','2021-07-13 21:45:15','2021-07-13 21:45:38','solved'),(3,'3','Sankalp','2021-07-13 21:46:42','2021-07-13 21:46:44','escalated'),(4,'1','Vishal','2021-07-13 21:51:32','2021-07-13 21:51:54','solved'),(5,'4','Anshuman','2021-07-13 22:04:49','2021-07-13 22:05:57','solved'),(6,'3','Vishal','2021-07-13 22:07:05','2021-07-13 22:07:06','escalated'),(7,'3','Anshuman','2021-07-13 22:07:16','2021-07-13 22:07:29','solved');
/*!40000 ALTER TABLE `doubt_ta_mapping` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-13 22:17:25
