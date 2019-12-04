CREATE TABLE IF NOT EXISTS developer(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,pass TEXT);
INSERT or IGNORE INTO developer VALUES (1, 'Simon', '');
INSERT or IGNORE INTO developer VALUES (2, 'Max', '');
INSERT or IGNORE INTO developer VALUES (3, 'Ben', '');
 
CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, creatorId INTEGER);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (1, 'Ionic Academy', 1);
INSERT or IGNORE INTO product(id, name, creatorId) VALUES (2, 'Software Startup Manual', 1);
