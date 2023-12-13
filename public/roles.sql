CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL,
    role_type INT NOT NULL,
    rights JSON NOT NULL,
    delete INT DEFAULT 0
);
INSERT INTO
    roles (role_name, role_type, rights)
VALUES
    (
        '管理员',
        1,
        '[
            "/index",
            "/user-manage",
            "/user-manage/list",
            "/right-manage",
            "/right-manage/rolelist",
            "/right-manage/rightlist",
            "/lab-manage",
            "/lab-manage/lablist",
            "/lab-manage/addlab",
            "/book-manage",
            "/book-manage/auditlist",
            "/book-manage/booklist",
            "/book-manage/addbook"
        ]'
    );

INSERT INTO
    roles (role_name, role_type, rights)
VALUES
    (
        '教师',
        2,
        '[
             "/index",
            "/book-manage",
            "/book-manage/booklist",
            "/book-manage/addbook",
            "/book-manage/addbook"
        ]'
    );