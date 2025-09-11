-- Create if not exist
-- CREATE DATABASE IF NOT EXISTS `coppel_test`;
-- USE `coppel_test`;

-- Users table (for auth)
-- User can be doctor or a patient.
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('patient', 'doctor', 'admin') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE `patients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `birth_date` DATE,
  `phone` VARCHAR(20),
  `user_id` INT UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctors table
CREATE TABLE `doctors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `specialty` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20),
  `user_id` INT UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE `appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  `start_at` DATETIME NOT NULL,
  `end_at` DATETIME NOT NULL,
  `reason` TEXT,
  `status` ENUM('scheduled', 'pending', 'cancelled', 'completed') DEFAULT 'scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);


-- Triggers to check for collisions in a date range before inserting new appointment for doctor.
DELIMITER $$

CREATE TRIGGER check_appointment_overlap_doctor
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM appointments
    WHERE doctor_id = NEW.doctor_id
      AND NEW.start_at < end_at
      AND NEW.end_at > start_at
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The doctor already has an appointment scheduled in that date range.';
  END IF;
END$$

CREATE TRIGGER check_appointment_overlap_patient
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1
    FROM appointments
    WHERE patient_id = NEW.patient_id
      AND NEW.start_at < end_at
      AND NEW.end_at > start_at
  ) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The patient already has an appointment scheduled in that date range.';
  END IF;
END$$

DELIMITER ;


-- The password for all users is "secret".
-- The hash was generated with bcrypt (cost 10).
SET @password_hash = '$2b$10$D3MdPsrfCwCdEhxT6yGQu.xYyOzQj.R2561zFnef764R157ml031O';

-- 1. Create an Administrator user.
INSERT INTO `users` (`email`, `password`, `role`) VALUES
('admin@example.com', @password_hash, 'admin');

-- 2. Create a Doctor and their associated user.
-- First, create the user for the doctor.
INSERT INTO `users` (`email`, `password`, `role`) VALUES
('doctor.house@example.com', @password_hash, 'doctor');

-- Get the ID of the user we just created.
SET @doctor_user_id = LAST_INSERT_ID();

-- Then, create the doctor's profile and link it to the user.
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES
('Gregory', 'House', 'Diagnostics', '555-0101', @doctor_user_id);

-- 3. Create a Patient and their associated user.
-- First, create the user for the patient.
INSERT INTO `users` (`email`, `password`, `role`) VALUES
('john.doe@example.com', @password_hash, 'patient');

-- Get the ID of the user we just created.
SET @patient_user_id = LAST_INSERT_ID();

-- Then, create the patient's profile and link it to the user.
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES
('John', 'Doe', '1985-01-15', '555-0102', @patient_user_id);
