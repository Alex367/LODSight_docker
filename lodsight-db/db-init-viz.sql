SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Table structure for table `dibi_log`
--

CREATE TABLE `dibi_log` (
  `id` int(11) NOT NULL,
  `query` text COLLATE utf8_czech_ci NOT NULL,
  `message` text COLLATE utf8_czech_ci NOT NULL,
  `method` int(11) NOT NULL,
  `ip` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

-- --------------------------------------------------------

--
-- Table structure for table `request_log`
--

CREATE TABLE `request_log` (
  `id` int(11) NOT NULL,
  `request` varchar(255) COLLATE utf8_czech_ci DEFAULT NULL,
  `message` varchar(255) COLLATE utf8_czech_ci DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8_czech_ci NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dibi_log`
--
ALTER TABLE `dibi_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `request_log`
--
ALTER TABLE `request_log`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dibi_log`
--
ALTER TABLE `dibi_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `request_log`
--
ALTER TABLE `request_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2869;