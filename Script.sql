CREATE DATABASE tienda_demo;
USE tienda_demo;
CREATE TABLE tipos (
 id INT IDENTITY(1,1) PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL
);
CREATE TABLE productos (
 id INT IDENTITY(1,1) PRIMARY KEY,
 nombre VARCHAR(150) NOT NULL,
 precio DECIMAL(10,2) NOT NULL,
 tipos_id INT NOT NULL,
 FOREIGN KEY (tipos_id) REFERENCES tipos(id)
);
INSERT INTO tipos (nombre) VALUES
('Bebidas'),('Alimentos'),('Limpieza');
INSERT INTO productos (nombre, precio, tipos_id) VALUES
('Coca Cola 2.25L', 2500.00, 1),
('Fernet 0.75L', 16000.00, 1),
('Arroz 1Kg', 1200.50, 2),
('Fideos 500g', 950.00, 2),
('Detergente 750ml', 2100.00, 3),
('Lavandina 1L', 1600.00, 3);