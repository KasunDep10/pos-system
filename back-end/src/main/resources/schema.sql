CREATE TABLE IF NOT EXISTS Customer (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    address VARCHAR(250) NOT NULL,
                    contact VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS Item (
                    code VARCHAR(50) PRIMARY KEY,
                    description VARCHAR(200) NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    qty INT NOT NULL

);

CREATE TABLE IF NOT EXISTS `order`(
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  `datetime` DATETIME NOT NULL

);

CREATE TABLE IF NOT EXISTS `order_details` (
                   order_id INT NOT NULL,
                   item_code VARCHAR(50) NOT NULL,
                   unit_price DECIMAL(10, 2) NOT NULL,
                   qty INT NOT NULL,
                   CONSTRAINT pk_order_detail PRIMARY KEY (order_id, item_code),
                   CONSTRAINT fk_order_detail_order FOREIGN KEY (order_id) REFERENCES `order`(id),
                   CONSTRAINT fk_order_detail_item FOREIGN KEY (item_code) REFERENCES Item(code)
);

CREATE TABLE IF NOT EXISTS order_customer (
                  order_id INT PRIMARY KEY ,
                  customer_id INT NOT NULL,
                  CONSTRAINT fk_order_customer_order FOREIGN KEY (order_id) REFERENCES `order`(id),
                  CONSTRAINT fk_order_customer_customer FOREIGN KEY (customer_id) REFERENCES Customer(id)
);