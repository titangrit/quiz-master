CREATE DATABASE  IF NOT EXISTS `quiz_master` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `quiz_master`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: quiz_master
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `UUID` varchar(36) NOT NULL,
  `SURNAME` varchar(45) DEFAULT NULL,
  `NAME` varchar(45) DEFAULT NULL,
  `LASTNAME` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `UUID` varchar(36) NOT NULL,
  `DESCRIPTION` varchar(200) NOT NULL,
  `OPTION_1` varchar(100) DEFAULT NULL,
  `OPTION_2` varchar(100) DEFAULT NULL,
  `OPTION_3` varchar(100) DEFAULT NULL,
  `OPTION_4` varchar(100) DEFAULT NULL,
  `ANSWER` varchar(100) NOT NULL,
  `MEDIA_UUID` varchar(36) DEFAULT NULL,
  `ROUND_UUID` varchar(36) NOT NULL,
  `SEQUENCE_NUM` int NOT NULL,
  `TARGET_TEAM_UUID` varchar(36) DEFAULT NULL,
  `ACTUAL_TEAM_UUID` varchar(36) DEFAULT NULL,
  `ACTUAL_MARK_GIVEN` int DEFAULT NULL,
  `ANSWER_GIVEN` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`UUID`),
  KEY `ROUND_idx` (`ROUND_UUID`),
  KEY `ACTUAL_TEAM_idx` (`ACTUAL_TEAM_UUID`),
  KEY `TARGET_TEAM_idx` (`TARGET_TEAM_UUID`),
  CONSTRAINT `ACTUAL_TEAM` FOREIGN KEY (`ACTUAL_TEAM_UUID`) REFERENCES `team` (`UUID`),
  CONSTRAINT `ROUND` FOREIGN KEY (`ROUND_UUID`) REFERENCES `round` (`UUID`),
  CONSTRAINT `TARGET_TEAM` FOREIGN KEY (`TARGET_TEAM_UUID`) REFERENCES `team` (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `EVENT_NAME` varchar(45) NOT NULL,
  `START_DATE_TIME` datetime DEFAULT NULL,
  `END_DATE_TIME` datetime DEFAULT NULL,
  `LIFECYCLE_STATUS` int NOT NULL,
  `NUM_OF_ROUNDS` int NOT NULL,
  `NUM_OF_TEAMS` int NOT NULL,
  `CURR_ROUND_SEQ_NUM` int DEFAULT NULL,
  `CURR_QUESTION_SEQ_NUM` int DEFAULT NULL,
  `TEAM_1_UUID` varchar(36) DEFAULT NULL,
  `TEAM_2_UUID` varchar(36) DEFAULT NULL,
  `TEAM_3_UUID` varchar(36) DEFAULT NULL,
  `TEAM_4_UUID` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `TEAM_1_idx` (`TEAM_1_UUID`),
  KEY `TEAM_1_idx1` (`TEAM_2_UUID`),
  KEY `TEAM_1_idx2` (`TEAM_3_UUID`),
  KEY `TEAM_1_idx3` (`TEAM_4_UUID`),
  CONSTRAINT `TEAM_1` FOREIGN KEY (`TEAM_1_UUID`) REFERENCES `team` (`UUID`),
  CONSTRAINT `TEAM_2` FOREIGN KEY (`TEAM_2_UUID`) REFERENCES `team` (`UUID`),
  CONSTRAINT `TEAM_3` FOREIGN KEY (`TEAM_3_UUID`) REFERENCES `team` (`UUID`),
  CONSTRAINT `TEAM_4` FOREIGN KEY (`TEAM_4_UUID`) REFERENCES `team` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `round`
--

DROP TABLE IF EXISTS `round`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `round` (
  `UUID` varchar(36) NOT NULL,
  `ROUND_TYPE_ID` varchar(36) NOT NULL,
  `QUIZ_ID` int NOT NULL,
  `SEQUENCE_NUM` int NOT NULL,
  PRIMARY KEY (`UUID`),
  KEY `QUIZ_idx` (`QUIZ_ID`),
  KEY `ROUND_TYPE_idx` (`ROUND_TYPE_ID`),
  CONSTRAINT `QUIZ` FOREIGN KEY (`QUIZ_ID`) REFERENCES `quiz` (`ID`),
  CONSTRAINT `ROUND_TYPE` FOREIGN KEY (`ROUND_TYPE_ID`) REFERENCES `round_type` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `round_type`
--

DROP TABLE IF EXISTS `round_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `round_type` (
  `ID` varchar(36) NOT NULL,
  `NAME` varchar(45) NOT NULL,
  `NUM_Q_EACH_TEAM` int NOT NULL,
  `FULL_MARK_EACH_Q` int NOT NULL,
  `IS_MULTIPLE_CHOICE` tinyint DEFAULT NULL,
  `IS_AUDIO_VISUAL` tinyint DEFAULT NULL,
  `TIMER_SECONDS` int DEFAULT NULL,
  `IS_PASSABLE` tinyint DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `UUID` varchar(36) NOT NULL,
  `TEAM_NAME` varchar(45) NOT NULL,
  `MEMBER_1_UUID` varchar(36) DEFAULT NULL,
  `MEMBER_2_UUID` varchar(36) DEFAULT NULL,
  `MEMBER_3_UUID` varchar(36) DEFAULT NULL,
  `MEMBER_4_UUID` varchar(36) DEFAULT NULL,
  `TOTAL_MARK` int DEFAULT NULL,
  PRIMARY KEY (`UUID`),
  KEY `MEMBER_1_idx` (`MEMBER_1_UUID`),
  KEY `MEMBER_2_idx` (`MEMBER_2_UUID`),
  KEY `MEMBER_3_idx` (`MEMBER_3_UUID`),
  KEY `MEMBER_4_idx` (`MEMBER_4_UUID`),
  CONSTRAINT `MEMBER_1` FOREIGN KEY (`MEMBER_1_UUID`) REFERENCES `member` (`UUID`),
  CONSTRAINT `MEMBER_2` FOREIGN KEY (`MEMBER_2_UUID`) REFERENCES `member` (`UUID`),
  CONSTRAINT `MEMBER_3` FOREIGN KEY (`MEMBER_3_UUID`) REFERENCES `member` (`UUID`),
  CONSTRAINT `MEMBER_4` FOREIGN KEY (`MEMBER_4_UUID`) REFERENCES `member` (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-13 22:23:06
