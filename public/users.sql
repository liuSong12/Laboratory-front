CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    role_id INT NOT NULL,
    is_default INT DEFAULT '0',
    FOREIGN KEY (roleId) REFERENCES roles(id)
);

INSERT INTO users (username, password,role_id, is_default) VALUES ('admin', '123456',1,1);

INSERT INTO users (username, password,role_id) VALUES ('ggxn', '123456',2);