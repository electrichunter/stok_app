-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: mysql-server
-- Üretim Zamanı: 28 Mar 2025, 15:12:40
-- Sunucu sürümü: 9.2.0
-- PHP Sürümü: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `stok`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_info` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `category_info`) VALUES
(1, 'Elektronik Ürünler', 'Telefon, bilgisayar ve diğer elektronik ürünler'),
(2, 'Moda ve Giyim', 'Erkek ve kadın giyim, ayakkabılar, aksesuarlar'),
(3, 'Yiyecek ve İçecek', 'Gıda ürünleri, içecekler, temizlik malzemeleri'),
(4, 'Ev ve Yaşam', 'Mobilya, dekorasyon ürünleri, bahçe eşyaları'),
(5, 'Sağlık ve Kişisel Bakım', 'Cilt bakım ürünleri, sağlık malzemeleri'),
(6, 'Spor ve Outdoor', 'Spor malzemeleri, dış mekan ekipmanları'),
(7, 'Oyun ve Eğlence', 'Video oyunları, hobi ürünleri'),
(8, 'Otomotiv', 'Araç parçaları, araç aksesuarları'),
(9, 'Kitap ve Eğitim', 'Kitaplar, eğitim materyalleri'),
(10, 'Çocuk ve Bebek', 'Bebek ürünleri, oyuncaklar, çocuk giyim');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `barcode` varchar(50) NOT NULL,
  `stock_quantity` bigint DEFAULT '0',
  `price_in_dollars` decimal(10,2) NOT NULL,
  `info` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `updated_by_user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `category_id`, `barcode`, `stock_quantity`, `price_in_dollars`, `info`, `created_at`, `updated_at`, `user_id`, `updated_by_user_id`) VALUES
(1, 'Test Product', 1, '123456', 100, 19.99, 'Test product info', '2025-03-24 18:29:03', '2025-03-24 18:29:03', 1, 1),
(2, 'Test Product 2', 1, '123456', 100, 19.99, 'Test product info', '2025-03-24 18:32:35', '2025-03-24 18:32:35', 1, 1),
(3, 'Test Product 2', 1, '123456', 100, 19.99, 'Test product info', '2025-03-24 19:39:39', '2025-03-24 19:39:39', 1, 1),
(4, 'Test Product 2', 1, '123456', 100, 19.99, 'Test product info', '2025-03-24 19:41:00', '2025-03-24 19:41:00', 1, 1),
(5, 'Test Product 2', 1, '123456', 100, 19.99, 'Test product info', '2025-03-24 19:41:11', '2025-03-24 19:41:11', 1, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `roles`
--

CREATE TABLE `roles` (
  `role_name` varchar(50) NOT NULL,
  `role_id` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `roles`
--

INSERT INTO `roles` (`role_name`, `role_id`) VALUES
('Admin', 'e3afed0047b08059d0fada10f400c1e5'),
('Customer', '91ec1f9324753048c0096d036a694f86'),
('Depo Görevlisi', '767f885b01a921256badb7ff2e01969d'),
('Kullanıcı', 'c86664e7f5d81e24be6283b27a31eb74'),
('Müdür', '6bd9ecfeb76640f23685c713a99d69dc'),
('MüdürYrd', '4f683ad035f8fb32ba0a0268ad65ab87'),
('Supplier', 'ec136b444eede3bc85639fac0dd06229');

--
-- Tetikleyiciler `roles`
--
DELIMITER $$
CREATE TRIGGER `before_insert_role` BEFORE INSERT ON `roles` FOR EACH ROW BEGIN
   SET NEW.role_id = MD5(NEW.role_name);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `role_id` varchar(32) NOT NULL DEFAULT 'c86664e7f5d81e24be6283b27a31eb74',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_password_change` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `previous_password_hash` varchar(255) DEFAULT NULL,
  `is_delete` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `phone_number`, `role_id`, `created_at`, `updated_at`, `last_password_change`, `previous_password_hash`, `is_delete`) VALUES
(1, 'Ahmet Yılmaz', 'ahmet@example.com', 'hashedpassword123', '555-123-4567', 'c86664e7f5d81e24be6283b27a31eb74', '2025-03-20 21:54:26', '2025-03-20 21:54:26', '2025-03-20 21:54:26', NULL, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `warehouses`
--

CREATE TABLE `warehouses` (
  `warehouse_id` int NOT NULL,
  `warehouse_name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `updated_by_user_id` (`updated_by_user_id`);

--
-- Tablo için indeksler `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Tablo için indeksler `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int NOT NULL AUTO_INCREMENT;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`user_id`);

--
-- Tablo kısıtlamaları `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
