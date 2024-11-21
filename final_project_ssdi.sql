-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 21, 2024 at 05:34 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `final_project_ssdi`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(55) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `created_date` date NOT NULL,
  `height` int(11) NOT NULL,
  `initial_weight` int(11) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `birth_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `password`, `salt`, `gender`, `created_date`, `height`, `initial_weight`, `phone_number`, `birth_date`) VALUES
(2, 'asd', 'asd', 'asdf@gm.com', 'c046f14e53ae458f412c6bb8304e184b6f5c830b7af50e91b2dfd29073f65849', '53382dfaf472c1b2876151d8dbe8d1f17cb8c4370be1a1e8754b77d8b4753911', 'male', '2024-11-07', 112, 155, '1234567890', '2024-11-08'),
(3, 'Team', '3.14', 'Team314@gmail.com', 'a2e113ee2b008600d99a0f78c82e894b29c6d1c53463f246d4499c419574517d', '8bc8bc1ce5512174fd8a0b9348ef3308c78a5075016acf01ead6c06008a56933', 'male', '2024-11-21', 155, 140, '1234567890', '2024-11-13');

-- --------------------------------------------------------

--
-- Table structure for table `user_exercise`
--

DROP TABLE IF EXISTS `user_exercise`;
CREATE TABLE IF NOT EXISTS `user_exercise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `calories_burnt` int(11) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `workout_date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_exercise`
--

INSERT INTO `user_exercise` (`id`, `user_id`, `name`, `time`, `calories_burnt`, `description`, `workout_date`) VALUES
(3, 2, 'asdsdasd', '112', 123, 'dSDS', '2024-11-13'),
(4, 2, 'asd', '12', 14, 'asdfghi', '2024-11-13'),
(5, 3, 'chest flies', '10', 100, 'Done with support', '2024-11-16'),
(6, 3, 'chest pullups', '10', 100, 'Done with support', '2024-11-16');

-- --------------------------------------------------------

--
-- Table structure for table `user_food`
--

DROP TABLE IF EXISTS `user_food`;
CREATE TABLE IF NOT EXISTS `user_food` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `calories` int(11) DEFAULT NULL,
  `protein` int(11) DEFAULT NULL,
  `intake_date` date NOT NULL,
  `serving_quantity` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_food`
--

INSERT INTO `user_food` (`id`, `user_id`, `name`, `calories`, `protein`, `intake_date`, `serving_quantity`) VALUES
(4, 2, 'asd', 123, 123, '2024-11-14', '15'),
(8, 2, 'asd', 123, 10, '2024-11-13', '1 spoon'),
(7, 2, 'asdad', 12, 123, '2024-11-13', '1 ounce'),
(9, 3, 'rice bowl', 500, 40, '2024-11-16', '1 bowl'),
(10, 3, 'protein powder', 0, 40, '2024-11-16', '1 ounce');

-- --------------------------------------------------------

--
-- Table structure for table `user_weight`
--

DROP TABLE IF EXISTS `user_weight`;
CREATE TABLE IF NOT EXISTS `user_weight` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `weight` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_weight`
--

INSERT INTO `user_weight` (`id`, `weight`, `user_id`, `date`) VALUES
(4, 122, 2, '2024-11-11'),
(3, 14, 2, '2024-11-10'),
(5, 110, 2, '2024-11-13'),
(11, 170, 3, '2024-11-17'),
(7, 160, 3, '2024-11-16');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
