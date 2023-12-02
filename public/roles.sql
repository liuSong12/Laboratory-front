CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roleName VARCHAR(20) NOT NULL,
    roleType INT NOT NULL,
    rights JSON NOT NULL
);
INSERT INTO
    roles (roleName, roleType, rights)
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
            "/book-manage/booklist"
        ]'
    );

INSERT INTO
    roles (roleName, roleType, rights)
VALUES
    (
        '教师',
        2,
        '[
             "/index",
            "/book-manage",
            "/book-manage/booklist",
            "/book-manage/addbook"
        ]'
    );