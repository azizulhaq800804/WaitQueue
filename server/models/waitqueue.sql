
drop database if exists waitqueue;
create database waitqueue;
USE waitqueue;  
DROP TABLE IF EXISTS user;

CREATE TABLE user 
                    (
                        id INT NOT NULL AUTO_INCREMENT,
                        name VARCHAR(100) NOT NULL,
                        email VARCHAR(50)  NOT NULL,
                        password text NOT NULL,
                        phone_number VARCHAR(30) NOT NULL,
                        sex VARCHAR(2) NOT NULL,
                        role int NOT NULL,
                        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY(id)
                    );

CREATE INDEX idx_user on user(email, name, phone_number); 

DROP TABLE IF EXISTS role;

CREATE TABLE role
            (
              id int NOT NULL,
              name VARCHAR(20) NOT NULL,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY(id)      
            );

INSERT INTO role(id, name) VALUES(1,'Super Admin');
INSERT INTO role(id, name) VALUES(2,'Admin');
INSERT INTO role(id, name) VALUES(3,'User');


DROP TABLE IF EXISTS category;

CREATE TABLE category
        (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(200) NOT NULL,
          PRIMARY KEY(id)      
        );

CREATE INDEX idx_category on category(name);

INSERT INTO category VALUES(1, 'Dental');
INSERT INTO category VALUES(2, 'General Medicine');
INSERT INTO category VALUES(3, 'Skin Specialists');



DROP TABLE IF EXISTS country;

CREATE TABLE country
        (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(200) NOT NULL,
          PRIMARY KEY(id)      
        );

CREATE INDEX idx_country on category(name);
INSERT INTO country VALUES(1, 'Bangladesh');
INSERT INTO country VALUES(2, 'India');
INSERT INTO country VALUES(3, 'Pakistan');
INSERT INTO country VALUES(4, 'Srilanka');
INSERT INTO country VALUES(5, 'Nepal');
INSERT INTO country VALUES(6, 'Bhutan');

DROP TABLE IF EXISTS city;

CREATE TABLE city
        (
          id INT NOT NULL AUTO_INCREMENT,
          country_id INT NOT NULL,
          name VARCHAR(200) NOT NULL,
          PRIMARY KEY(id)      
        );

CREATE INDEX idx_city on category(name);

INSERT INTO `city` (`id`, `country_id`, `name`) VALUES
(1, 1, 'Dhaka'),
(2, 1, 'Comilla'),
(3, 1, 'Narayanganj'),
(4, 1, 'Dhaka'),
(5, 1, 'Barisal'),
(6, 1, 'Khulna'),
(7, 1, 'Rajshahi');



DROP TABLE IF EXISTS chamber;

CREATE TABLE chamber
            (
              id INT NOT NULL AUTO_INCREMENT,
              user_id INT NOT NULL,
              category_id INT NOT NULL,  
              name VARCHAR(100) NOT NULL,
              doctor_name VARCHAR(100),
              phone_number VARCHAR(50) NOT NULL,
              address VARCHAR(200) NULL,
              city_id INT NOT NULL,
              country_id INT NOT NULL,  
              latitude DOUBLE DEFAULT 0,
              longitude DOUBLE DEFAULT 0,
              accuracy DOUBLE,
              altidude DOUBLE,
              heading DOUBLE,
              speed DOUBLE,
              start_time VARCHAR(50) NOT NULL,
              end_time VARCHAR(50) NOT NULL,
              holiday VARCHAR(10) NOT NULL,
              picture_url VARCHAR(200),
              thumbnail VARCHAR(200),
              number_of_person INT DEFAULT 0,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY(id),
              FOREIGN KEY (category_id) REFERENCES category(id),
              FOREIGN KEY (user_id) REFERENCES user(id)    
            );     

CREATE INDEX idx_chamber on chamber(name, address, phone_number); 

DROP TABLE IF EXISTS booking;

CREATE TABLE booking
            (
               id INT NOT NULL AUTO_INCREMENT,
               chamber_id INT NOT NULL,
               customer_name VARCHAR(100) NOT NULL,
               phone_number VARCHAR(50),
               serial INT NOT NULL,
               appoint_time DATETIME NOT NULL,
               createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
               updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
               PRIMARY KEY(id), 
               FOREIGN KEY(chamber_id) REFERENCES chamber(id)
            );

CREATE INDEX idx_booking on booking(customer_name);


