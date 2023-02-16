-- Populer les tables avec des données de tests (des fakes data)
-- Pratiquer pour aider les developpeurs qui reprennent le projet en local !

BEGIN;

INSERT INTO "list" 
  ("id", "position", "name")
VALUES 
  (1, 1, 'Liste des courses'),
  (2, 2, 'Todo Today'),
  (3, 3, 'Liste des anniversaires')
;

INSERT INTO "card"
  ("id", "position", "content", "color", "list_id")
VALUES 
  (1, 1, 'Oignon', '#f2f542', 1),
  (2, 2, 'Patates', '#797a36', 1),

  (3, 1, 'Atelier J3', NULL, 2),
  (4, 2, 'Netflix', NULL, 2),

  (5, 1, 'Mamie le 12/12/1900', '#F0F', 3)
;

INSERT INTO "label"
  ("id", "name", "color")
VALUES 
  (1, 'Urgent', '#F0F'),
  (2, 'En retard', '#FF0'),
  (3, 'Oclock', '#0FF')
;

INSERT INTO "card_has_label"
  ("card_id", "label_id")
VALUES 
  (5, 2),
  (1, 1),
  (3, 2),
  (3, 3),
  (4, 1)
;

-- Initialiser la séquence des ID pour les GENERATED AS IDENTITY
-- Autrement, il commencera à l'ID 1 au prochain insert. 
SELECT setval('list_id_seq', (SELECT MAX(id) from "list"));
SELECT setval('card_id_seq', (SELECT MAX(id) from "card"));
SELECT setval('label_id_seq', (SELECT MAX(id) from "label"));


COMMIT;
