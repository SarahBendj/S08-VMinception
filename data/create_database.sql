-- Rappels commandes pour créer le USER et la BDD 


-- ====== CREATION DE NOTRE ADMINISTRATEUR DE BASE DE DONNEES ======

CREATE ROLE okanban WITH LOGIN PASSWORD 'okanban';
-- ALTERNATIVEMENT 
-- CREATE USER okanban WITH PASSWORD 'okanban'; -- les droits "login" sont sous entendu


-- ====== CREATION DE NOTRE BASE DE DONNEES ======

CREATE DATABASE okanban WITH OWNER okanban;
