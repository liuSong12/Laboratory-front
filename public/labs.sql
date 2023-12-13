CREATE TABLE labs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lab_name VARCHAR(20) NOT NULL,
    capacity INT DEFAULT '0',
    lab_type INT DEFAULT '0',
    lab_college INT DEFAULT '0',
    lat INT DEFAULT '0',
    lng INT DEFAULT '0'
);
