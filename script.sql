create database wa_db;

use wa_db;

CREATE TABLE Image (
    id INT PRIMARY KEY  AUTO_INCREMENT,
    image BLOB NOT NULL
);

ALTER TABLE Image
MODIFY COLUMN image BLOB NOT NULL;

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    pass TEXT NOT NULL,
    pfp_id INT,
    FOREIGN KEY (pfp_id) REFERENCES  Image(id)
);

CREATE TABLE  Post (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    image_id INT NOT NULL,
    like_count INT NOT NULL CHECK(like_count >= 0),
    dislike_count INT NOT NULL CHECK(dislike_count >= 0),
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (image_id) REFERENCES  Image(id)
);

ALTER TABLE Post 
ADD COLUMN description TEXT;

CREATE TABLE Comment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (post_id) REFERENCES Post(id)
);

select * from image;
select * from post;

DELETE FROM Post WHERE image_id = (image_id);
DELETE FROM Image;