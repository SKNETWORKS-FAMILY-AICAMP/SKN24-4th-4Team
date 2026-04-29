-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: dacaredb
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add tbl file',8,'add_tblfile'),(26,'Can change tbl file',8,'change_tblfile'),(27,'Can delete tbl file',8,'delete_tblfile'),(28,'Can view tbl file',8,'view_tblfile'),(29,'Can add tbl user',9,'add_tbluser'),(30,'Can change tbl user',9,'change_tbluser'),(31,'Can delete tbl user',9,'delete_tbluser'),(32,'Can view tbl user',9,'view_tbluser'),(33,'Can add tbl user chat history',11,'add_tbluserchathistory'),(34,'Can change tbl user chat history',11,'change_tbluserchathistory'),(35,'Can delete tbl user chat history',11,'delete_tbluserchathistory'),(36,'Can view tbl user chat history',11,'view_tbluserchathistory'),(37,'Can add tbl user chat hist dtl',10,'add_tbluserchathistdtl'),(38,'Can change tbl user chat hist dtl',10,'change_tbluserchathistdtl'),(39,'Can delete tbl user chat hist dtl',10,'delete_tbluserchathistdtl'),(40,'Can view tbl user chat hist dtl',10,'view_tbluserchathistdtl'),(41,'Can add tbl verify code',12,'add_tblverifycode'),(42,'Can change tbl verify code',12,'change_tblverifycode'),(43,'Can delete tbl verify code',12,'delete_tblverifycode'),(44,'Can view tbl verify code',12,'view_tblverifycode'),(45,'Can add tbl feedback',7,'add_tblfeedback'),(46,'Can change tbl feedback',7,'change_tblfeedback'),(47,'Can delete tbl feedback',7,'delete_tblfeedback'),(48,'Can view tbl feedback',7,'view_tblfeedback');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(7,'dacare','tblfeedback'),(8,'dacare','tblfile'),(9,'dacare','tbluser'),(10,'dacare','tbluserchathistdtl'),(11,'dacare','tbluserchathistory'),(12,'dacare','tblverifycode'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-04-28 14:56:38.628372'),(2,'auth','0001_initial','2026-04-28 14:56:39.131014'),(3,'admin','0001_initial','2026-04-28 14:56:39.246355'),(4,'admin','0002_logentry_remove_auto_add','2026-04-28 14:56:39.246355'),(5,'admin','0003_logentry_add_action_flag_choices','2026-04-28 14:56:39.257280'),(6,'contenttypes','0002_remove_content_type_name','2026-04-28 14:56:39.331767'),(7,'auth','0002_alter_permission_name_max_length','2026-04-28 14:56:39.381671'),(8,'auth','0003_alter_user_email_max_length','2026-04-28 14:56:39.398516'),(9,'auth','0004_alter_user_username_opts','2026-04-28 14:56:39.410338'),(10,'auth','0005_alter_user_last_login_null','2026-04-28 14:56:39.447719'),(11,'auth','0006_require_contenttypes_0002','2026-04-28 14:56:39.447719'),(12,'auth','0007_alter_validators_add_error_messages','2026-04-28 14:56:39.447719'),(13,'auth','0008_alter_user_username_max_length','2026-04-28 14:56:39.513711'),(14,'auth','0009_alter_user_last_name_max_length','2026-04-28 14:56:39.564275'),(15,'auth','0010_alter_group_name_max_length','2026-04-28 14:56:39.576765'),(16,'auth','0011_update_proxy_permissions','2026-04-28 14:56:39.584232'),(17,'auth','0012_alter_user_first_name_max_length','2026-04-28 14:56:39.630953'),(18,'dacare','0001_initial','2026-04-28 14:56:39.958801'),(19,'sessions','0001_initial','2026-04-28 14:56:39.989233');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('ou69ygx1m1q42c84sof7kcmzo2rc4gdu','.eJxVy8sKwjAQheF3ma22TMaYpln1CVy5D0WDTGsuNJUo4rsb0Y27w8f5n3DLbrF8BkPb73Z-5CsYmKfSE3Z6r-Rw-Vh7ih5-pzDXx8Qlhiqc7ep8sqlUPFTILmeOwbp74sXZca1OSKpB2ZA-is4gGSnaXkm1kxtEg1gz-9c9wAiN-HoDpC4yNw:1wHlMX:JE1j1B4B91CSUTjlXmBJSQAu8MDmDET-vy8lDPk3LnY','2026-04-28 17:02:41.968636'),('y8fhz6zqckq47kco77f178mb8jykhc3p','.eJxVy0EOgjAQheG7dKuQYexgmRUncOW-IdqYAUsbiqnGeHdrdOPu5cv7n-qW3GLlrBi33-38IFfFahpzh7A31Or-8rH6FLz6neapPEbJYS4iya7ORxtzwUOB5FKSMFt3j7I4O6zFEbCtQFdojg0xEWusDWG3ow0AA5TM_nUPxY0BeL0BpUcyPg:1wHkJi:PG8YF-YwJxy3-YjDhwhcAFWiZXigp325_z9xpyQd5jM','2026-04-28 15:55:42.856354'),('ymixp95ne0zk323dvr18ncjinhqy5gf7','.eJxVy0EOwiAUhOG7sNU2U6SUsvIErtyTRol5rRRSatAY7-4zunE3-TL_U9yyXxydhZXb7_ZhoKuwYhpLL9GZVqv95WP1KQbxO80TP0YqcWah7FYfkkuF8cCQfc4UZ-fviRbvhpVdQuoKqpLm2HQWrcWuNlC90hvAApy5v-4hbGOA1xukJDI3:1wHlOp:JqM-kpSvkDFnyKd93YSBKbOT9zjtBveNAm9yjMKImg8','2026-04-28 17:05:03.807945');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_feedback`
--

DROP TABLE IF EXISTS `tbl_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feedback` (
  `FEEDBACK_ID` int NOT NULL AUTO_INCREMENT,
  `SATISFACTION_LEVEL` int NOT NULL,
  `FEEDBACK_CONTENT` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `REG_DT` datetime(6) NOT NULL,
  `USER_ID` int NOT NULL,
  PRIMARY KEY (`FEEDBACK_ID`),
  KEY `IDX_TBL_FEEDBACK_USER_ID` (`USER_ID`),
  CONSTRAINT `TBL_FEEDBACK_USER_ID_2af40bed_fk_TBL_USER_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `tbl_user` (`USER_ID`),
  CONSTRAINT `CK_TBL_FEEDBACK_SATISFACTION` CHECK ((`SATISFACTION_LEVEL` in (1,2,3,4,5)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feedback`
--

LOCK TABLES `tbl_feedback` WRITE;
/*!40000 ALTER TABLE `tbl_feedback` DISABLE KEYS */;
INSERT INTO `tbl_feedback` VALUES (1,5,'I am satisfied that you explained the plan you wanted well. Thanks to this, I was able to download and fill out the invoice form quickly.','2026-04-28 15:26:27.555271',2);
/*!40000 ALTER TABLE `tbl_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_file`
--

DROP TABLE IF EXISTS `tbl_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_file` (
  `FILE_ID` int NOT NULL AUTO_INCREMENT,
  `FILE_NAME` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FILE_EXT` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `FILE_PATH` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `INSURANCE_NAME` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`FILE_ID`),
  KEY `IDX_TBL_FILE_INSURANCE_NAME` (`INSURANCE_NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_file`
--

LOCK TABLES `tbl_file` WRITE;
/*!40000 ALTER TABLE `tbl_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user`
--

DROP TABLE IF EXISTS `tbl_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user` (
  `USER_ID` int NOT NULL AUTO_INCREMENT,
  `USER_NK` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `USER_EMAIL` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `USER_PW` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PW_WRONG_CNT` int NOT NULL,
  `IS_TEMP_PW` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `UPDT_DT` datetime(6) NOT NULL,
  `REG_DT` datetime(6) NOT NULL,
  `LAST_LOGIN_DT` datetime(6) NOT NULL,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `USER_EMAIL` (`USER_EMAIL`),
  CONSTRAINT `CK_TBL_USER_IS_TEMP_PW` CHECK ((`IS_TEMP_PW` in (_utf8mb4'Y',_utf8mb4'N')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user`
--

LOCK TABLES `tbl_user` WRITE;
/*!40000 ALTER TABLE `tbl_user` DISABLE KEYS */;
INSERT INTO `tbl_user` VALUES (2,'jiwon','kjw92078564@gmail.com','pbkdf2_sha256$1200000$stsZVwha4rfnKImnabvS9d$VX/37bl/bnnB5A2EqVmNMUlNfpajGSl5dFV2/3V/+q4=',0,'N','2026-04-28 15:19:33.432137','2026-04-28 15:19:33.432137','2026-04-28 16:35:03.798940');
/*!40000 ALTER TABLE `tbl_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_chat_hist_dtl`
--

DROP TABLE IF EXISTS `tbl_user_chat_hist_dtl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_chat_hist_dtl` (
  `CHAT_DTL_ID` int NOT NULL AUTO_INCREMENT,
  `BOT_YN` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CHAT_CONTENT` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `REG_DT` datetime(6) NOT NULL,
  `CHAT_ID` int NOT NULL,
  PRIMARY KEY (`CHAT_DTL_ID`),
  KEY `IDX_CHAT_DTL` (`CHAT_ID`),
  CONSTRAINT `TBL_USER_CHAT_HIST_D_CHAT_ID_bd24775a_fk_TBL_USER_` FOREIGN KEY (`CHAT_ID`) REFERENCES `tbl_user_chat_history` (`CHAT_ID`),
  CONSTRAINT `CK_TBL_CHAT_HIST_DTL_BOT_YN` CHECK ((`BOT_YN` in (_utf8mb4'Y',_utf8mb4'N')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_chat_hist_dtl`
--

LOCK TABLES `tbl_user_chat_hist_dtl` WRITE;
/*!40000 ALTER TABLE `tbl_user_chat_hist_dtl` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_user_chat_hist_dtl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_chat_history`
--

DROP TABLE IF EXISTS `tbl_user_chat_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_chat_history` (
  `CHAT_ID` int NOT NULL AUTO_INCREMENT,
  `CHAT_TITLE` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SESSION_ID` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `REG_DT` datetime(6) NOT NULL,
  `USER_ID` int NOT NULL,
  PRIMARY KEY (`CHAT_ID`),
  KEY `IDX_CHAT_USER` (`USER_ID`),
  CONSTRAINT `TBL_USER_CHAT_HISTORY_USER_ID_562625ac_fk_TBL_USER_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `tbl_user` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_chat_history`
--

LOCK TABLES `tbl_user_chat_history` WRITE;
/*!40000 ALTER TABLE `tbl_user_chat_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_user_chat_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_verify_code`
--

DROP TABLE IF EXISTS `tbl_verify_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_verify_code` (
  `VERIFY_CODE_ID` int NOT NULL AUTO_INCREMENT,
  `USER_EMAIL` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VERIFY_CODE` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `REG_DT` datetime(6) NOT NULL,
  `REQ_IP` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`VERIFY_CODE_ID`),
  KEY `IDX_TBL_VERIFY_CODE_USER_EMAIL` (`USER_EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_verify_code`
--

LOCK TABLES `tbl_verify_code` WRITE;
/*!40000 ALTER TABLE `tbl_verify_code` DISABLE KEYS */;
INSERT INTO `tbl_verify_code` VALUES (2,'kjw7087@naver.com','369319','2026-04-28 15:05:15.467455','127.0.0.1');
/*!40000 ALTER TABLE `tbl_verify_code` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29  2:33:27
