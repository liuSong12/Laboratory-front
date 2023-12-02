CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lab_id INT DEFAULT '0',
    book_time DATE,
    book_class INT DEFAULT '0',
    book_reason VARCHAR(100) NOT NULL,
    book_username VARCHAR(20) NOT NULL,
    book_state INT DEFAULT '0'
);

-- 0 审核中，1 审核通过  2 被驳回  

