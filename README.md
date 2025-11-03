# Xanovi

Xanovi. Une application moderne utilisant des librairies personnalisée basée sur les différentes libraires de [Literate](https://github.com/LiterateInk/).

## Crédits

Ce projet utilise du code provenant de [Literate](https://github.com/LiterateInk/), mais aussi de [Vexcited](https://github.com/Vexcited). Tout le mérite revient à l'auteur original (je précise mais si je ne me trompe pas c'est la même personne).

J'utilise donc :

- [Pawnote.js](https://github.com/LiterateInk/Pawnote.js) — Base principale pour le support de **Pronote**.
- [Desero](https://github.com/Vexcited/Desero) — Librairie de gestion de model pour serializer et deserializer le structure des réponses.
- [Schwi](https://github.com/Vexcited/Schwi) — Librairie de gestion de requête Http/Https dans le but d'uniformiser la structure des différents projets.
- [MAQueue](https://github.com/Vexcited/maqueue) — Librairie de gestion de queue asynchrone.

---

## Installation

Installer les dépendances :

```bash
bun install
```

Lancer le build :

```bash
bun run build
```

Pour rendre le code lisible automatiquement et générer les liens

```bash
bun run parse
```

---

## Utilisation

Basé sur le code de Vexited :

- Projet Pawnote (réécriture basé sur [Pawnote r2.0](https://github.com/LiterateInk/Pawnote.js/tree/rewrite-2.0/src-new))

---

## Contribuer

Pour contribuer, merci de suivre ces étapes :

1. Forker ce dépôt
2. Créer une branche pour votre fonctionnalité/correction (`git checkout -b feature/NouvelleFonctionnalité`)
3. Faire vos modifications
4. Committer vos changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
5. Pousser votre branche (`git push origin feature/NouvelleFonctionnalité`)
6. Ouvrir une Pull Request

---

## Problèmes & Demandes de fonctionnalité

- Ouvrir une [issue](https://github.com/Mewax07/Xanovi/issues) pour signaler un bug ou demander une nouvelle fonctionnalité.
- Décrire clairement votre problème ou suggestion.

---

## Contributing à Xanovi

Merci de considérer une contribution ! Suivez ces étapes :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité/correction
3. Écrivez un code propre et testé
4. Committez avec un message clair
5. Poussez votre branche
6. Ouvrez une Pull Request

---

## Signalement de problèmes

- Utilisez les Issues de GitHub pour signaler un bug ou demander une fonctionnalité.
- Inclure :
    - Les étapes pour reproduire le problème
    - Comportement attendu vs réel
    - Captures d’écran si nécessaire

---

## Style de code

- Compatible TypeScript + Bun
- Code lisible et documenté
- Formatage cohérent (préférer Prettier)

---
