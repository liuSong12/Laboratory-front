CREATE TABLE labs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(20) NOT NULL,
    capacity INT DEFAULT '0',
    lab_type INT DEFAULT '0',
    college_type INT DEFAULT '0',
    x INT DEFAULT '0',
    y INT DEFAULT '0'
);
