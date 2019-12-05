CREATE TABLE IF NOT EXISTS utilisateur(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,pass TEXT);
INSERT or IGNORE INTO utilisateur VALUES (1, 'T', 't');
INSERT or IGNORE INTO utilisateur VALUES (2, 'Max', '');
INSERT or IGNORE INTO utilisateur VALUES (3, 'Ben', '');
 
CREATE TABLE IF NOT EXISTS capteur(id INTEGER PRIMARY KEY AUTOINCREMENT,matricule TEXT,emplacement TEXT);
INSERT or IGNORE INTO capteur VALUES (1, 'capt1', '2');
INSERT or IGNORE INTO capteur VALUES (2, 'capt2', '3');
INSERT or IGNORE INTO capteur VALUES (3, 'capt3', '1');