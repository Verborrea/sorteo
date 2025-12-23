DROP TABLE IF EXISTS regalos;

CREATE TABLE regalos (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	de_numero INTEGER NOT NULL,
	para_numero INTEGER NOT NULL,
	asignado_a TEXT DEFAULT NULL -- LocalStorage UUID
);

INSERT INTO regalos (de_numero, para_numero) VALUES 
(1, 4),
(2, 7),
(3, 10),
(4, 2),
(5, 9), 
(6, 1),
(7, 8),
(8, 5),
(9, 3),
(10, 6);