CREATE TABLE IF NOT EXISTS Customer (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    address VARCHAR(250) NOT NULL,
                    contact VARCHAR(20) NOT NULL
);