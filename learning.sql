-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost
-- Üretim Zamanı: 02 May 2018, 15:41:19
-- Sunucu sürümü: 10.1.31-MariaDB
-- PHP Sürümü: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `learning`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `courses`
--

CREATE TABLE `courses` (
  `cid` varchar(11) NOT NULL,
  `uniid` int(11) NOT NULL,
  `ecid` varchar(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `ename` varchar(200) NOT NULL,
  `credit` float NOT NULL,
  `ectscredit` float NOT NULL,
  `area` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Tablo döküm verisi `courses`
--

INSERT INTO `courses` (`cid`, `uniid`, `ecid`, `name`, `ename`, `credit`, `ectscredit`, `area`) VALUES
('CS2100', 9, 'CS401', 'Computer Organisation', 'Computer Architectures', 4, 6, 'ALL'),
('CS324112', 17, 'CS40112', 'INTELLIGENCE112', 'Intelligence112', 3, 6, 'CS'),
('CS3242', 9, 'CS403', 'INTRODUCTION TO STH', 'Artificial STH', 3, 10, 'CS');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `universities`
--

CREATE TABLE `universities` (
  `uniid` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `country` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Tablo döküm verisi `universities`
--

INSERT INTO `universities` (`uniid`, `name`, `country`) VALUES
(9, 'NUS', 'Singapore'),
(17, 'PolyU', 'Hong Kong'),
(18, 'SabancÄ±', 'Turkey'),
(19, 'Harvard', 'USA'),
(20, 'NatJapanUni', 'Japan'),
(21, 'Koc', 'Turkey'),
(22, 'Bogazici', 'Turkey'),
(23, 'Yeditepe Uni', 'Turkey');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`userid`, `email`, `name`, `password`, `type`) VALUES
(2, 'a@gmai.com', 'a', '$2a$10$3946f0d20f6657698aa76uEJdTV7wSN3mFN03mQ2xthZDsUYjzoh6', 'user'),
(11, 'c@gmail.com', 'c', '14124', 'user'),
(33, 'b@gmail.com', 'b', '123444', 'user'),
(44, 'z@gmail.com', 'z', '14124', 'user'),
(55, 'd@gmai.com', 'd', '$2a$10$7714135b2f03ca4063e6aum2WErd812dk7F2wm81sWesXWXvCaWAC', 'user'),
(66, 'e@gmai.com', 'e', '$2a$10$530ede507c8e70b0b9745OM712Wj8tQ47wEqcuIfuSSzwaKQAJSUG', 'user'),
(67, 'umit@gmail.com', 'umit', '$2a$10$7568679fa068aac445d2culXFbM4vkLedATsUEBsPKlBiZ1ZdK1zG', 'admin'),
(68, 'a', 'a', '$2a$10$5e67e41f1d476c2ced3cfuLNMC1/abeAteUnBmmrdbRigZnIwbD.y', 'admin'),
(69, 'b', 'b', '$2a$10$c330229ed1fbce190e422uAH.miWEZu2WKf2x9OWDZjFhJc84fw7C', 'user');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `courses`
--
ALTER TABLE `courses`
  ADD KEY `uniid` (`uniid`);

--
-- Tablo için indeksler `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`uniid`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `universities`
--
ALTER TABLE `universities`
  MODIFY `uniid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`uniid`) REFERENCES `universities` (`uniid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
