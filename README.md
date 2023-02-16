# Saison 8 - O'Kanban - Monorepo - RED

## DevOps

DevOps = une philosophie qui vise à rendre opérationnel (= production) les developpements des devs : 
  - CI/CD = continuous integration (= lancer les tests automatisés avant de merger) / continuous deployment (= à chaque git push sur master, on re-deploie le projet automatiquement)
  - Déploiement

## Serveurs (physique)

Serveur = une machine. Généralement, sans l'écran. Mais connecté à internet. 

Généralement, rangés dans des **DataCenters**, dans des **rack**.

On peut bien sûr s'acheter son propre serveur physique pour jouer avec (le connecter à internet, installer son linux, ...). Exemple avec un [Rasberry Pi](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/).


## Hébergements

- **Serveur dédié physique** : j'achète un Rack complet / Rasberry  dans mon placard 

- **Serveur dédié virtuel** (VPS = Virtual **Private** Server) : sur une même machine physique, on peut installer plusieurs système d'exploitation indépendant (grâce notamment à un Hyperviseur). C'est l'hébergeur qui gère le serveur initial, sa connection à internet, et vous fourni l'accès au VPS. Peut très bien être dans le `Cloud`

- **Serveur mutualisé** : on partage aussi une même machine avec d'autres utilisateurs, mais avec des droits d'accès limités. Généralement, on ne peut pas se connecter au terminal du serveur (en SSH). On peut généralement y déposer des fichiers (ex : un fichier HTML pour qu'il soit servi au monde extérieur). Exemple, on s'y connecte en **FTP** (avec FileZilla) pour y glisser des fichiers HTML/CSS à servir. 

**Hebergeurs Cloud** : 
- AWS (Amazon Web Service)
- GCP (Google Cloud Platform)
- MA (Microsoft Azure)
- OVH
- Heroku
- Gandi
- PlanetHoster 
- Alibaba Cloud


## Glossaire

| Terme | Definition | Exemple |
| -- | -- | -- | 
| **IaaS** | Infrastructure as a Service | ex: VPS. L'hebergeur nous donne accès à une infrastructure complete (mais brute !) pour nos déploiement | 
| **PaaS** | Platform as a Service | ex: Heroku. La plateforme est fournie par l'hébergeur (avec Node, ...). Tu git push et ton code se déploie automatiquement |
| **DBaaS** | Database as a Service | ex: MongoAtlas. L'hebergeur me fourni un SGBD et me permet de m'y connecter |


## Les 7 travaux de l'AdminSys

- Choisir le bon type d'hébergement : 
  - critères : localisation, prix, scalabilité (= montée en charge)

- Installer le serveur
  - Installer système d'exploitation (si pas fait !)
  - Installer Node ! 
  - Installer Postgres...

- Configurer le serveur
  - Vérifier sa connection à internet
  - Mettre à jour Linux quand il faut...

- Sécuriser le serveur
  - Eviter les attaques DDoS

- Mettre en production le site
  - Cloner notre dépôt et le lancer

- Maintenir et surveiller le serveur
  - Monitoring : des performances, des logs d'erreurs. 


## Créer un mono-repo

- Partir du backend. 
- Idée : le backend doit servir statiquement (`app.use(express.static(""))`) le dossier `dist`. 
- On inclue le code du client dans un dossier et on fait en sorte d'ajouter un script `npm run build` pour bundler le code client dans le fameux dossier `dist` qui sera servi statiquement.
- On lance le backend.

## Déploiement 

- [x] Se connecter à son VPS (VM Cloud)
- [x] Mettre à jour le Linux (voir si tout baigne)
  - [x] Installer git ?
- [x] Installer la Base de Données Postgres
  - [x] Installer Postgres
  - [x] Créer un user/mot de passe
  - [x] Créer la BDD okanban
  - [x] Créer les tables
- [x] Cloner le mono-repo
- [x] Installer Node via NVM
- [x] Lancer l'application avec Node : 
  - [x] Installer les dépendances du projet 
  - [x] Créer et ajuster le .env
  - [x] Créer le bundle dist
  - [x] npm start

- [ ] (bonus) rediriger les requêtes du PORT 80 vers le port 3000


## Etapes

- Lancer votre VM.

- Démarrer votre VM Cloud : 
  - https://kourou.oclock.io/ressources/vm-cloud/
  - accessible depuis Kourou sur sa VM pour des raisons de sécurité VPN

- Depuis ma VM, j'ouvre un terminal pour me connecter en SSH vers ma VM Cloud : 
  - on trouve la commande de connection sur l'addresse https://kourou.oclock.io/ressources/vm-cloud/
  - ex : `ssh student@enzoclock-server.eddi.cloud`

- Créer votre monorepo via un Ochallenge Kourou  
  - https://kourou.oclock.io/o-challenge/?ref=Ty1jbG9jay1NYXlhL1MwOC1va2FuYmFuLW1vbm9yZXBvLVJFRC1lbnpvY2xvY2t8Ty1jbG9jay1NYXlhfFMwOC1va2FuYmFuLW1vbm9yZXBvLVJFRHwyMDIzLTAxLTAzVDA5OjAwfG1haW4=
  - ou via `Use this template` [ici](https://github.com/O-clock-Maya/S08-okanban-monorepo-RED-enzoclock)

- On vérifie un peu noter système : 
  - `whoiam` : donne le nom d'utilisateur avec lequel on est connecté
  - `uname -a` : donne des infos sur le système d'exploitation et architecture machine
  
- On met à jour les packages Linux : 
  - `sudo apt-get update`
  - mot de passe de votre VM : `par dessus les nuages`
    - Oui ! c'est normal de pas voir quand on tape les lettres du mot de passe. 

- On vérifie que git est déjà installé 
  - `git --version`

- On regarde si un serveur Postgresql ne tournerait pas déjà : 
  - `sudo systemctl status postgresql` => a priori non

- On installe Postgresql : 
  - `sudo apt-get install postgresql`
  
- On vérifie qu'il tourne : 
  - `sudo systemctl status postgresql` => a priori good 

- On regarde si on peut se connecter à notre SGBD Postgresql via le client `psql` ??
  - `psql` fonctionne mais ne nous laisse pas entré car il n'y a pas d'utilisateur `student` dans notre SGBD.
  - On ruse : `sudo -i -u postgres psql` en se faisant passer pour l'utilisateur `postgres`.

- On en profite pour changer le mot de passe de cet utilisateur `postgres`: 
  - `\password`
  - puis entrer le mot de passe de votre choix (je recommande `postgres` pour pas l'oublier)

- On créer un user `okanban` en production : 
  - `CREATE ROLE okanban WITH LOGIN PASSWORD 'okanban';`

- On créer la base de données de production : 
  - `CREATE DATABASE okanban WITH OWNER okanban;`

- On confirme la bonne création des users et table : 
  - `\du` : liste les utilisateurs
  - `\l` : liste les databases

- On quitte `psql` : 
  - `exit`

- On essaie de se (re)connecter avec l'utilisateur `okanban` sur la base via `psql` : 
  - Essai 1 : `psql -U okanban -d okanban`. 
    - Oupsy, ça ne marche pas avec l'erreur : `psql: error: FATAL:  Peer authentication failed for user "okanban"`
  - Essai 2 : `psql -U okanban -d okanban -h localhost`.
    - Ca marche !! 
  - Autre solution possible pour que l'essai 1 fonctionne : 
    - suivre les recommandations de [ce gist](https://gist.github.com/AtulKsol/4470d377b448e56468baef85af7fd614) en allant modifier le ficher `pg_hba`

- On vérifie qu'on est bien connecté : 
  - `\conninfo` : `You are connected to database "okanban" as user "okanban" on host "localhost"`

- Objectif : dire à Github de faire confiance en ma VM Cloud.
  - J'accède à mon `dépôt` (⚠️ pas les settings globaux) sur `Github` > `Settings` > `Deploy Keys` > `Add deploy key`
  - Nom de la clé de déploiement : `VM Cloud` (par exemple, info indicative)
  - Clé : voir l'étape suivante !
  - Wright access ?? Pas besoin, on va rien push depuis la VM Cloud (manquerait plus que ça 🤭)

- Depuis la VM, créer une clé SSH
  - `ssh-keygen -t ed25519 -C "mon-mail-ici"`
  - `ENTRER` 3 fois. : 
  - Vérifier qu'elle a bien été créée :
    - `ls -a` 
    - puis on entre dans le dossier `.ssh` : `cd .ssh`
    - `ls` : on y voit la clé SSH publique dans le fichier `id_ed25519.pub`
    - on lit le contenu du fichier : `cat id_ed25519.pub`
    - que l'on colle (en entier !!) dans les settings github du `Add deploy key`

- Toujours depuis le terminal de la VM, on ajoute la clé SSH au "agent de service SSH" : 
  - `eval "$(ssh-agent -s)"`
  - `ssh-add ~/.ssh/id_ed25519`

- On retourne sur la home pour cloner le dépot
  - `cd ~`
  - `git clone URL_DU_DEPOT_GITHUB_A_CLONER`


- On créer les tables et on les remplis dans la BDD de la VM Cloud : 
  - `cd LE_DEPOT_CLONÉ` (entre guillemet si le chemin est chelou)
  - `psql -U okanban -d okanban -h localhost -f data/create_tables.sql`
  - `psql -U okanban -d okanban -h localhost -f data/seed_database.sql`

- On installe Node à l'aide d'un **gestionnaire de version de node** = NVM = Node Version Manager ! On commence donc par installer nvm en global (depuis n'importe quel folder): 
  - `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
  - Executer les commandes indiqué dans le message d'installation
  - `nvm -v` pour vérifier l'installation. Si on a une version, c'est good (peut importe laquelle)

- On installe Node via NVM : 
  - `nvm install 18`
  - `nvm use 18` (pour utiliser cette version)
  - `nvm alias default 18` (pour définir la version 18 par défaut pour tous les nouveaux terminaux)

- On installe les dépendances NPM du projet
  - on retourne dans le projet avec `cd <projet>`
  - `npm install`

- On créer le fichier des variables d'environnement
  - `cp .env.example .env`

- On lance le backend : 
  - `npm run start`

- Depuis mon hôte, sur Chrome, on accede au port 3000 de notre serveur cloud : 
  - `http://enzoclock-server.eddi.cloud:3000/lists`


- C'était trop tôt ! Car le front n'est pas encore build !!

- On modifie le .env avec Nano : 
  - `nano .env`. On met l'adresse HTTP de son serveur cloud (sans le `/` final) pour l'adresse de l'API : 
    - on la trouve ici sur [Adresse de la machine](https://kourou.oclock.io/ressources/vm-cloud/)
  - On enregistre (`CTLR + O` puis `ENTRER`), on quitte (`CTRL + X`)
  - On rebuild le front (`npm run build`)
  - On relance le back (`npm run start`)


- (Bonus) pour masquer le PORT. 
  - Le port HTTP par défaut est le port : `80`
  - On peut rediriger les requêtes du port 80 vers le port 3000 : 
  - `sudo iptables -tnat -A PREROUTING -p tcp -m tcp --dport 80 -j REDIRECT --to-ports 3000` 
  - on peut même persister cette redirection entre les reboot via `iptables-persistants` : 
    - `sudo apt-get install iptables-persistent`
    - `sudo netfilter-persistent save`

- (Bonus) pour lancer node en tant que deamon via `pm2` : 
  - `npm install -g pm2`
  - `pm2 start index.js`


🔥🎉 BRAVO 🔥🎉


## Notes sur un déploiement sur un PaaS (ex : Heroku)

- on nous file une adresse remote git
- on l'ajoute à notre dépot
- on git push vers heroku
- heroku va automatiquement lancer : 
  - 0. npm install
  - 1. npm run build
  - 2. npm run start


Fin => déploiement sur un PaaS est généralement plus direct 

PBL : avec ça on a pas la BDD, mais on peut le gérer avec des pluging ou une BDaaS :) 
