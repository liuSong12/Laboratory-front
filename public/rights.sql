CREATE TABLE rights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(20) NOT NULL,
    path VARCHAR(100) NOT NULL,

    icon VARCHAR(100) NOT NULL,
    parent_id INT DEFAULT '0',
    -- 父级菜单ID
    is_leaf TINYINT DEFAULT '0' -- 是否是叶子菜单。0-否；1-是
);
INSERT INTO rights (title, path,icon) VALUES ('首页', '/index','HomeFilled');

INSERT INTO rights (title, path,icon) VALUES ('用户管理', '/user-manage','User');

INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('用户列表', '/user-manage/list','List', 2, 1);

INSERT INTO rights (title, path,icon) VALUES ('权限管理', '/right-manage','Key');

INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('角色列表', '/right-manage/rolelist','List', 4, 1);
INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('权限列表', '/right-manage/rightlist', 'List',4, 1);


INSERT INTO rights (title, path,icon) VALUES ('实验室管理', '/lab-manage','OfficeBuilding');

INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('实验室列表', '/lab-manage/lablist','List', 7, 1);
INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('添加实验室', '/lab-manage/addlab','List', 7, 1);


INSERT INTO rights (title, path,icon) VALUES ('预约管理', '/book-manage','UploadFilled');

INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('审核列表', '/book-manage/auditlist','List', 10, 1);
INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('预约列表', '/book-manage/booklist','List', 10, 1);
INSERT INTO rights (title, path,icon, parent_id, is_leaf) VALUES ('预约实验室', '/book-manage/addbook','List', 10, 1);
