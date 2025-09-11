-- The password for all users is "secret".
-- The hash was generated with bcrypt (cost 10).
SET @password_hash = '$2b$10$D3MdPsrfCwCdEhxT6yGQu.xYyOzQj.R2561zFnef764R157ml031O';

-- Insert 20 Doctors
-- Doctor 1
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('carlos.sanchez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Carlos', 'Sánchez', 'Cardiología', '555-0103', @doctor_user_id);

-- Doctor 2
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('ana.gomez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Ana', 'Gómez', 'Dermatología', '555-0104', @doctor_user_id);

-- Doctor 3
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('javier.fernandez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Javier', 'Fernández', 'Pediatría', '555-0105', @doctor_user_id);

-- Doctor 4
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('laura.martinez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Laura', 'Martínez', 'Ginecología', '555-0106', @doctor_user_id);

-- Doctor 5
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('david.lopez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('David', 'López', 'Neurología', '555-0107', @doctor_user_id);

-- Doctor 6
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('sofia.perez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Sofía', 'Pérez', 'Oftalmología', '555-0108', @doctor_user_id);

-- Doctor 7
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('pablo.rodriguez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Pablo', 'Rodríguez', 'Traumatología', '555-0109', @doctor_user_id);

-- Doctor 8
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('elena.diaz@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Elena', 'Díaz', 'Endocrinología', '555-0110', @doctor_user_id);

-- Doctor 9
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('daniel.moreno@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Daniel', 'Moreno', 'Psiquiatría', '555-0111', @doctor_user_id);

-- Doctor 10
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('carmen.jimenez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Carmen', 'Jiménez', 'Urología', '555-0112', @doctor_user_id);

-- Doctor 11
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('sergio.ruiz@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Sergio', 'Ruiz', 'Cardiología', '555-0113', @doctor_user_id);

-- Doctor 12
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('raquel.hernandez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Raquel', 'Hernández', 'Dermatología', '555-0114', @doctor_user_id);

-- Doctor 13
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('ivan.garcia@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Iván', 'García', 'Pediatría', '555-0115', @doctor_user_id);

-- Doctor 14
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('marina.alonso@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Marina', 'Alonso', 'Ginecología', '555-0116', @doctor_user_id);

-- Doctor 15
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('alberto.santos@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Alberto', 'Santos', 'Neurología', '555-0117', @doctor_user_id);

-- Doctor 16
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('natalia.castillo@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Natalia', 'Castillo', 'Oftalmología', '555-0118', @doctor_user_id);

-- Doctor 17
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('ricardo.vargas@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Ricardo', 'Vargas', 'Traumatología', '555-0119', @doctor_user_id);

-- Doctor 18
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('beatriz.ramos@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Beatriz', 'Ramos', 'Endocrinología', '555-0120', @doctor_user_id);

-- Doctor 19
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('oscar.mendez@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Óscar', 'Méndez', 'Psiquiatría', '555-0121', @doctor_user_id);

-- Doctor 20
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('veronica.flores@example.com', @password_hash, 'doctor');
SET @doctor_user_id = LAST_INSERT_ID();
INSERT INTO `doctors` (`name`, `last_name`, `specialty`, `phone`, `user_id`) VALUES ('Verónica', 'Flores', 'Urología', '555-0122', @doctor_user_id);


-- Insert Patients
-- Patient 1
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('juan.perez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Juan', 'Pérez', '1990-05-15', '555-1001', @patient_user_id);

-- Patient 2
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('maria.gonzalez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('María', 'González', '1985-08-22', '555-1002', @patient_user_id);

-- Patient 3
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('jose.rodriguez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('José', 'Rodríguez', '1992-01-30', '555-1003', @patient_user_id);

-- Patient 4
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('ana.martinez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Ana', 'Martínez', '1978-11-11', '555-1004', @patient_user_id);

-- Patient 5
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('luis.hernandez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Luis', 'Hernández', '2000-03-25', '555-1005', @patient_user_id);

-- Patient 6
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('sofia.lopez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Sofía', 'López', '1995-07-19', '555-1006', @patient_user_id);

-- Patient 7
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('miguel.diaz@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Miguel', 'Díaz', '1988-09-05', '555-1007', @patient_user_id);

-- Patient 8
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('elena.sanchez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Elena', 'Sánchez', '1993-04-12', '555-1008', @patient_user_id);

-- Patient 9
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('francisco.gomez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Francisco', 'Gómez', '1976-02-28', '555-1009', @patient_user_id);

-- Patient 10
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('isabel.fernandez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Isabel', 'Fernández', '1998-06-17', '555-1010', @patient_user_id);

-- Patient 11
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('adriana.cruz@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Adriana', 'Cruz', '1991-08-01', '555-1066', @patient_user_id);

-- Patient 12
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('roberto.ortiz@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Roberto', 'Ortiz', '1983-12-24', '555-1067', @patient_user_id);

-- Patient 13
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('patricia.reyes@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Patricia', 'Reyes', '1996-10-03', '555-1068', @patient_user_id);

-- Patient 14
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('fernando.gutierrez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Fernando', 'Gutiérrez', '1979-05-20', '555-1069', @patient_user_id);

-- Patient 15
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('laura.mendoza@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Laura', 'Mendoza', '1994-02-14', '555-1070', @patient_user_id);

-- Patient 16
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('carlos.ruiz@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Carlos', 'Ruiz', '1982-03-10', '555-1071', @patient_user_id);

-- Patient 17
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('lucia.diaz@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Lucía', 'Díaz', '1991-07-21', '555-1072', @patient_user_id);

-- Patient 18
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('daniel.soto@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Daniel', 'Soto', '1975-12-01', '555-1073', @patient_user_id);

-- Patient 19
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('elena.castro@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Elena', 'Castro', '1988-11-05', '555-1074', @patient_user_id);

-- Patient 20
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('javier.ortega@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Javier', 'Ortega', '1993-01-18', '555-1075', @patient_user_id);

-- Patient 21
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('sara.gimenez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Sara', 'Giménez', '1999-09-30', '555-1076', @patient_user_id);

-- Patient 22
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('pablo.marin@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Pablo', 'Marín', '1984-04-25', '555-1077', @patient_user_id);

-- Patient 23
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('claudia.serrano@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Claudia', 'Serrano', '1996-08-12', '555-1078', @patient_user_id);

-- Patient 24
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('sergio.blanco@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Sergio', 'Blanco', '1979-06-07', '555-1079', @patient_user_id);

-- Patient 25
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('andrea.molina@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Andrea', 'Molina', '2001-02-22', '555-1080', @patient_user_id);

-- Patient 26
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('alvaro.cano@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Álvaro', 'Cano', '1980-10-15', '555-1081', @patient_user_id);

-- Patient 27
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('rocio.prieto@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Rocío', 'Prieto', '1992-05-09', '555-1082', @patient_user_id);

-- Patient 28
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('adrian.pascual@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Adrián', 'Pascual', '1987-07-14', '555-1083', @patient_user_id);

-- Patient 29
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('cristina.herrera@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Cristina', 'Herrera', '1994-11-28', '555-1084', @patient_user_id);

-- Patient 30
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('diego.garrido@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Diego', 'Garrido', '1983-01-03', '555-1085', @patient_user_id);

-- Patient 31
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('natalia.calvo@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Natalia', 'Calvo', '1990-08-19', '555-1086', @patient_user_id);

-- Patient 32
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('ivan.vidal@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Iván', 'Vidal', '1986-02-11', '555-1087', @patient_user_id);

-- Patient 33
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('irene.iglesias@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Irene', 'Iglesias', '1997-06-24', '555-1088', @patient_user_id);

-- Patient 34
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('ruben.vega@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Rubén', 'Vega', '1981-09-02', '555-1089', @patient_user_id);

-- Patient 35
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('marta.campos@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Marta', 'Campos', '1995-04-08', '555-1090', @patient_user_id);

-- Patient 36
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('jorge.navarro@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Jorge', 'Navarro', '1985-11-23', '555-1091', @patient_user_id);

-- Patient 37
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('laura.vazquez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Laura', 'Vázquez', '1993-03-15', '555-1092', @patient_user_id);

-- Patient 38
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('alberto.gil@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Alberto', 'Gil', '1978-07-01', '555-1093', @patient_user_id);

-- Patient 39
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('silvia.morales@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Silvia', 'Morales', '1999-01-29', '555-1094', @patient_user_id);

-- Patient 40
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('francisco.romero@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Francisco', 'Romero', '1982-09-18', '555-1095', @patient_user_id);

-- Patient 41
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('paula.suarez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Paula', 'Suárez', '2000-05-05', '555-1096', @patient_user_id);

-- Patient 42
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('marcos.ortega@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Marcos', 'Ortega', '1986-12-12', '555-1097', @patient_user_id);

-- Patient 43
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('irene.dominguez@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Irene', 'Domínguez', '1994-08-30', '555-1098', @patient_user_id);

-- Patient 44
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('alejandro.bravo@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Alejandro', 'Bravo', '1981-04-21', '555-1099', @patient_user_id);

-- Patient 45
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('sandra.pascual@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Sandra', 'Pascual', '1997-02-07', '555-1100', @patient_user_id);

-- Patient 46
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('victor.medina@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Víctor', 'Medina', '1989-06-11', '555-1101', @patient_user_id);

-- Patient 47
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('eva.santos@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Eva', 'Santos', '1990-11-01', '555-1102', @patient_user_id);

-- Patient 48
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('raul.castillo@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Raúl', 'Castillo', '1984-01-16', '555-1103', @patient_user_id);

-- Patient 49
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('nuria.vargas@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Nuria', 'Vargas', '1995-09-25', '555-1104', @patient_user_id);

-- Patient 50
INSERT INTO `users` (`email`, `password`, `role`) VALUES ('hector.ramos@example.com', @password_hash, 'patient');
SET @patient_user_id = LAST_INSERT_ID();
INSERT INTO `patients` (`name`, `last_name`, `birth_date`, `phone`, `user_id`) VALUES ('Héctor', 'Ramos', '1987-03-08', '555-1105', @patient_user_id);
