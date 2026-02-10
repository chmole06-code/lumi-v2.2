# Mon Petit Allié - Prototype Web 🌈✨

Bienvenue dans le prototype web de **Mon Petit Allié**, une application de compagnon virtuel magique pour enfants.

## 🎯 Concept

**Mon Petit Allié** est une application qui transforme les routines quotidiennes en aventures complices. Lumi, un petit monstre adorable en 3D, ne vit que si l'enfant prend soin de lui-même. Plus l'enfant l'aide, plus Lumi devient heureux et en bonne santé.

### La promesse "Sérénité"

- ✅ **Zéro publicité** : Aucune publicité intrusive
- ✅ **Zéro données** : Aucune donnée ne sort de l'appareil
- ✅ **Zéro achat caché** : Pas de microtransactions
- ✅ **Verrouillage parental strict** : À l'heure du dodo, l'app se verrouille automatiquement

## 🎮 Fonctionnalités du Prototype

### 1. Page d'Accueil (Welcome)
- Présentation du concept de Lumi
- Tutoriel rapide des trois routines
- Bouton pour commencer l'aventure
- Design enchanteur avec particules magiques

### 2. Jeu Principal (Game)
- **Lumi au centre** : Compagnon 3D avec aura magique changeante
- **Système de santé** : Barre de santé + cœurs pulsants (0-100)
- **Trois routines interactives** :
  - 🪥 **Brossage de dents** : +15 santé, émotion "Joie"
  - 🏃 **Bouger/Danser** : +20 santé, émotion "Fierté"
  - 🌙 **Bonne nuit** : +25 santé, émotion "Fatigue" + verrouillage
- **Émotions dynamiques** : Calme, Joie, Fatigué, Triste, Fier
- **Animations fluides** : Respiration, clignements, particules magiques
- **Sons générés** : Sons de succès, rires, bâillements (Web Audio API)

### 3. Panneau Parental
- Programmation de l'heure de verrouillage (Bonne nuit)
- Code parent pour déverrouiller : **1234**
- Vue des statistiques (santé, émotion, routines complétées)
- Bouton réinitialisation

### 4. Écran de Verrouillage
- Message "À demain! 💤"
- Lumi endormi en arrière-plan
- Accès au mode parent avec code

## 🎨 Design - Magical Storybook

### Palette de Couleurs
- **Fond** : Dégradé violet profond (#7B68EE) → rose magenta (#FF1493)
- **Accent primaire** : Or doux (#FFD700)
- **Accent secondaire** : Turquoise (#40E0D0)
- **Texte** : Blanc/crème (#F5F5DC)

### Typographie
- **Titres** : Playfair Display (dramatique, conte de fées)
- **Corps** : Quicksand (douce, lisible)

### Éléments Visuels
- Aura pulsante autour de Lumi
- Cadre décoratif animé
- Particules magiques flottantes
- Animations fluides et gratifiantes

## 📱 Utilisation

### Pour les Enfants
1. Ouvre l'app et clique sur "Commencer l'aventure"
2. Vois Lumi au centre de l'écran
3. Clique sur les boutons de routine pour aider Lumi
4. Regarde sa santé augmenter et ses émotions changer
5. À l'heure du dodo, l'app se verrouille automatiquement

### Pour les Parents
1. Clique sur le bouton 👨‍👩‍👧 en haut à droite
2. Définis l'heure de verrouillage (ex: 21:00)
3. Consulte les statistiques de l'enfant
4. Utilise le code **1234** pour déverrouiller si nécessaire

## 🔧 Architecture Technique

### Stack
- **Frontend** : React 19 + Tailwind CSS 4
- **Routing** : Wouter
- **UI Components** : shadcn/ui
- **Animations** : CSS + Framer Motion
- **Sons** : Web Audio API

### Structure des Fichiers
```
client/
├── public/
│   └── images/
│       └── lumi.png          # Image de Lumi
├── src/
│   ├── components/
│   │   ├── Lumi.tsx          # Compagnon avec animations
│   │   ├── RoutineButton.tsx # Boutons de routine
│   │   └── HealthBar.tsx     # Barre de santé
│   ├── hooks/
│   │   └── useSounds.ts      # Gestion des sons
│   ├── pages/
│   │   ├── Welcome.tsx       # Page d'accueil
│   │   └── Game.tsx          # Page principale du jeu
│   ├── App.tsx               # Routage principal
│   └── index.css             # Thème Magical Storybook
└── index.html                # Point d'entrée HTML
```

## 🚀 Fonctionnalités Futures (V2+)

- **AR réelle** : Intégration avec ARKit/ARCore pour placer Lumi dans l'environnement réel
- **Chasse aux trésors AR** : Chercher des objets virtuels dans la maison
- **Reconnaissance d'émotions** : Caméra pour détecter si l'enfant fait vraiment l'action
- **Progression et niveaux** : Débloquer de nouvelles routines et récompenses
- **Personnalisation** : Choisir l'apparence de Lumi
- **Synchronisation cloud** : Sauvegarder la progression (avec consentement parental)
- **Notifications** : Rappels doux pour les routines
- **Mode multijoueur local** : Partager Lumi avec des frères/sœurs

## 📊 Système de Santé

La santé de Lumi diminue lentement au fil du temps (1 point tous les 30 secondes). Elle augmente lors des routines :

| Routine | Gain de Santé | Émotion |
|---------|---------------|---------|
| 🪥 Dents | +15 | Joie 😊 |
| 🏃 Bouger | +20 | Fierté 🌟 |
| 🌙 Dodo | +25 | Fatigue 😴 |

La santé critique (< 30%) rend Lumi triste 😔.

## 🔐 Sécurité et Confidentialité

- ✅ **Aucune connexion internet** : Tout fonctionne localement
- ✅ **Aucune donnée personnelle** : Pas de collecte d'informations
- ✅ **Aucun tracking** : Pas d'analytics
- ✅ **Code parent simple** : 1234 (à personnaliser en production)

## 🎯 Prochaines Étapes

1. **Tester sur mobile** : Ouvrir sur un téléphone/tablette pour vérifier la responsivité
2. **Feedback enfants** : Montrer à des enfants et recueillir leurs réactions
3. **Feedback parents** : Valider que le verrouillage et les paramètres sont intuitifs
4. **Ajustements UX** : Affiner les animations et les interactions
5. **Intégration AR** : Passer à Unity/ARKit/ARCore pour la vraie AR

## 📝 Notes de Développement

### Animations Clés
- **Respiration** : Cycle de 3 secondes (scale 1 → 1.05 → 1)
- **Bounce** : Animation de 0.6s lors des actions
- **Particules** : Float de 1s avec fade-out
- **Aura** : Pulse 2s en continu, 0.6s lors des actions

### Gestion d'État
- État du jeu centralisé dans `Game.tsx`
- Émotions : calm, joy, tired, sad, proud
- Santé : 0-100
- Verrouillage : basé sur l'heure

### Sons Web Audio
- **Success** : Deux notes montantes (Do → Mi)
- **Giggle** : Note courte et rapide (800Hz)
- **Yawn** : Note grave descendante (200Hz → 100Hz)
- **Sad** : Notes descendantes (400Hz → 300Hz)

## 🤝 Contribution et Feedback

Ce prototype est une base solide pour valider le concept. N'hésitez pas à :
- Tester sur différents appareils
- Partager vos retours
- Suggérer des améliorations
- Proposer des nouvelles routines

## 📄 Licence

Prototype créé pour Mon Petit Allié. Tous droits réservés.

---

**Créé avec ❤️ pour les enfants et les parents**

*Version 1.0 - Janvier 2026*
