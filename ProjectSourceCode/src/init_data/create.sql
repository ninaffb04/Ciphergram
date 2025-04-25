DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(225) NOT NULL,
  email VARCHAR(50) NOT NULL,
  last_login DATE,
  streak INT DEFAULT 0,
  name VARCHAR(100),
  friends_count INT,
  avatar_url VARCHAR(200)
);

DROP TABLE IF EXISTS friendships CASCADE;
CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
   status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')),
  requested_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users (user_id) ON DELETE CASCADE
);

