-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: vspo_dp
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `_order`
--

DROP TABLE IF EXISTS `_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_order` (
  `Order_Id` int NOT NULL,
  `Ship_date` datetime NOT NULL,
  `Order_date` datetime NOT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Address` varchar(100) NOT NULL,
  `Payment_method` varchar(50) NOT NULL,
  `Takeing_method` varchar(50) NOT NULL,
  `Fee` int NOT NULL,
  `Member_Id` int NOT NULL,
  `Coupon_Id` int DEFAULT NULL,
  PRIMARY KEY (`Order_Id`),
  KEY `Member_Id` (`Member_Id`),
  KEY `Coupon_Id` (`Coupon_Id`),
  CONSTRAINT `_order_ibfk_1` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_order_ibfk_2` FOREIGN KEY (`Coupon_Id`) REFERENCES `coupon` (`Coupon_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_order`
--

LOCK TABLES `_order` WRITE;
/*!40000 ALTER TABLE `_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `Member_Id` int NOT NULL,
  PRIMARY KEY (`Member_Id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
  `Coupon_Id` int NOT NULL,
  `Start_date` datetime NOT NULL,
  `End_date` datetime NOT NULL,
  `Discound` int NOT NULL,
  `Limit_money` int NOT NULL,
  `Type` varchar(50) NOT NULL,
  `Member_Id` int NOT NULL,
  PRIMARY KEY (`Coupon_Id`),
  KEY `Member_Id` (`Member_Id`),
  CONSTRAINT `coupon_ibfk_1` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `Order_Id` int NOT NULL,
  `Product_Id` int NOT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`Order_Id`,`Product_Id`),
  KEY `Product_Id` (`Product_Id`),
  CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`Order_Id`) REFERENCES `_order` (`Order_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lists_ibfk_2` FOREIGN KEY (`Product_Id`) REFERENCES `product` (`Product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lists`
--

LOCK TABLES `lists` WRITE;
/*!40000 ALTER TABLE `lists` DISABLE KEYS */;
/*!40000 ALTER TABLE `lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturer`
--

DROP TABLE IF EXISTS `manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturer` (
  `Member_Id` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Descreption` varchar(100) DEFAULT NULL,
  KEY `Member_Id` (`Member_Id`),
  CONSTRAINT `manufacturer_ibfk_1` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturer`
--

LOCK TABLES `manufacturer` WRITE;
/*!40000 ALTER TABLE `manufacturer` DISABLE KEYS */;
/*!40000 ALTER TABLE `manufacturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `Member_Id` int NOT NULL,
  `Phone` varchar(10) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Username` varchar(20) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Member_state` varchar(20) NOT NULL,
  `Authority` varchar(10) NOT NULL,
  PRIMARY KEY (`Member_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'0983631915','a2685744@gmail.com','Yihss','1234','verification','admin'),(2,'0931245354','a856974@gmail.com','fuik','5678','notverificaton','user');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `Product_id` int NOT NULL,
  `Product_name` varchar(50) DEFAULT NULL,
  `Quantity` int NOT NULL,
  `Price` int NOT NULL,
  `Descrip` varchar(2000) DEFAULT NULL,
  `Image_path` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`Product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'橘ひなの　誕生日記念2024',100,200,'test','../assets/test1.png'),(2,'千燈ゆうひ　誕生日記念2024',50,1000,'千燈ゆうひ（@yuuhi_sendo）の誕生日を記念したグッズの受注販売が決定！\n\n※必ず下記の「注意事項」をお読みください。\n\n【受注期間】\n12月3日（火）19:00頃～12月17日（火）23:59まで\n\n【お届け予定】\n2025年3月下旬頃\n\n※注意事項\n本商品は受注生産のため発送が遅くなります。\n発送予定時期が早い他の商品と同一カートでご注文された場合、最もお届け時期の遅い商品に合わせての発送となります。\nお急ぎの場合、別決済にてご注文いただきますようお願いいたします。\n詳しくは「商品の発送について」も併せてご確認ください。','千燈.png'),(3,'紡木こかげ　誕生日記念2024',42,6969,'紡木こかげ（@kokage_tsumugi）の誕生日を記念したグッズの受注販売が決定！\n※必ず下記の「注意事項」をお読みください。\n\n\n\n【受注期間】\n10月26日（土）20:00頃～11月9日（土）23:59まで\n\n【お届け予定】\n2025年2月上旬頃\n\n\n\n※注意事項\n本商品は受注生産のため発送が遅くなります。\n発送予定時期が早い他の商品と同一カートでご注文された場合、最もお届け時期の遅い商品に合わせての発送となります。\nお急ぎの場合、別決済にてご注文いただきますようお願いいたします。\n\n詳しくは「商品の発送について」も併せてご確認ください。','紡木.png');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specified`
--

DROP TABLE IF EXISTS `specified`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specified` (
  `Product_Id` int NOT NULL,
  `Coupon_Id` int NOT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`Product_Id`,`Coupon_Id`),
  KEY `Coupon_Id` (`Coupon_Id`),
  CONSTRAINT `specified_ibfk_1` FOREIGN KEY (`Product_Id`) REFERENCES `product` (`Product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `specified_ibfk_2` FOREIGN KEY (`Coupon_Id`) REFERENCES `coupon` (`Coupon_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specified`
--

LOCK TABLES `specified` WRITE;
/*!40000 ALTER TABLE `specified` DISABLE KEYS */;
/*!40000 ALTER TABLE `specified` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uses`
--

DROP TABLE IF EXISTS `uses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uses` (
  `Member_Id` int NOT NULL,
  `Coupon_id` int NOT NULL,
  `Date` datetime NOT NULL,
  PRIMARY KEY (`Member_Id`),
  CONSTRAINT `uses_ibfk_1` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uses`
--

LOCK TABLES `uses` WRITE;
/*!40000 ALTER TABLE `uses` DISABLE KEYS */;
/*!40000 ALTER TABLE `uses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-17 16:41:34
