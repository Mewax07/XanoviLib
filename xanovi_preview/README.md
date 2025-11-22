Parfait ! Voici une **proposition complète de README.md** pour ton projet `xanovi_preview`, en structurant toutes les informations que tu m’as données et en gardant un style clair et professionnel. J’ai reformulé certaines parties pour que ça soit fluide et lisible.

---

# Xanovi Preview

Xanovi Preview est une application moderne conçue pour centraliser les outils éducatifs dans un seul panel. L'objectif est de faciliter l'accès aux cours, aux documents et aux fonctionnalités pédagogiques depuis n'importe quel appareil, tout en garantissant la sécurité des données des utilisateurs.

---

## Objectifs du projet

* **Centraliser les outils éducatifs** : proposer un panel unique regroupant toutes les fonctionnalités utiles à l’éducation.
* **Connexion automatique à Pronote** : accéder facilement aux notes, emplois du temps et autres informations scolaires.
* **Créer une base de données de cours** : grâce à Git, chaque utilisateur peut sauvegarder et partager des cours, accessibles sur tous ses appareils.
* **Accès contrôlé** : donner des permissions spécifiques à certaines personnes pour visualiser ou modifier le contenu.
* **Études et analyses** : fournir des outils pour analyser les cours et les données pédagogiques.
* **Cours préfabriqués et PDF en ligne** : intégration de ressources pédagogiques fiables et accessibles.
* **IA locale spécifique aux matières** : plusieurs modèles embarqués pour aider à l’apprentissage (comme Gauth).
* **Interface fluide et personnalisable** : ergonomie pensée pour une utilisation confortable et efficace.

---

## Sécurité et confidentialité

Xanovi Preview est conçu pour être sûr et respectueux de la vie privée :

* Les librairies utilisées, comme **Pawnote.js**, n’envoient **aucune donnée vers un serveur distant** entre le client et Pronote.
* Toutes les informations restent **locales** et protégées sur l’appareil de l’utilisateur.
* Aucun risque de fuite de données sensibles.

---

## Crédits et librairies utilisées

Le projet repose sur plusieurs librairies open-source :

* [Pawnote.js](https://github.com/LiterateInk/Pawnote.js) — base pour le support de **Pronote**.
* [Desero](https://github.com/Vexcited/Desero) — gestion de modèles pour sérialisation/désérialisation.
* [Schwi](https://github.com/Vexcited/Schwi) — gestion de requêtes HTTP/HTTPS.
* [MAQueue](https://github.com/Vexcited/maqueue) — gestion de queues asynchrones.

Tout le mérite revient aux auteurs originaux de ces librairies.

---

## Installation

1. Ce déplacer dans le projet :

```bash
cd xanovi_preview
```

2. Installer les dépendances :

```bash
bun install
```

3. Lancer l'application en développement :

```bash
bun run tauri dev
```

---

## Utilisation

* Accéder au panel centralisé et naviguer entre les fonctionnalités.
* Connexion automatique à Pronote pour récupérer les informations scolaires.
* Sauvegarder et partager des cours via la base de données Git.
* Exploiter les outils d'analyse et les modèles d'IA intégrés.
* Personnaliser l'interface selon ses préférences.

---