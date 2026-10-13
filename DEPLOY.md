# Déploiement sur GitHub Pages

Votre portfolio est configuré pour un **déploiement automatique sur GitHub Pages**.
À chaque `push` sur la branche `main`, GitHub Actions construit le site et le publie.

## 🚀 Étapes (5 min)

### 1. Créez un dépôt sur GitHub
- Allez sur https://github.com/new
- Nom du dépôt : par exemple `portfolio` (ou `junior-mbadinga`)
- **Public** (obligatoire pour GitHub Pages gratuit)
- Ne cochez PAS "Initialize with README" (le dépôt doit être vide)
- Cliquez **Create repository**

### 2. Poussez le code depuis ce projet
Dans le terminal, à la racine du projet :

```bash
git init
git add .
git commit -m "Portfolio Junior Mbadinga"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM-UTILISATEUR/VOTRE-REPO.git
git push -u origin main
```

Remplacez `VOTRE-NOM-UTILISATEUR` et `VOTRE-REPO` par vos infos.

### 3. Activez GitHub Pages
- Allez dans votre dépôt GitHub → **Settings** → **Pages**
- Section **Build and deployment** → Source : **GitHub Actions**
- (Pas besoin de choisir un dossier, le workflow gère tout)

### 4. Attendez le déploiement
- Allez dans l'onglet **Actions** de votre dépôt
- Vous verrez un workflow "Deploy to GitHub Pages" qui tourne
- ~2-3 minutes plus tard, c'est en ligne

### 5. Votre site est accessible à
```
https://VOTRE-NOM-UTILISATEUR.github.io/VOTRE-REPO/
```

## 🔧 Comment ça marche techniquement

- `next.config.ts` est configuré avec `output: "export"` → génère du HTML/CSS/JS statique dans `out/`
- `basePath` est automatiquement défini par le workflow (`BASE_PATH=/${{ github.event.repository.name }}`) pour que les assets se chargent correctement depuis `username.github.io/repo-name/`
- Le formulaire de contact utilise `mailto:` → ouvre le client mail du visiteur avec votre adresse pré-remplie (aucun serveur nécessaire)
- Les vidéos YouTube sont en embed → fonctionnent en statique
- Le workflow `.github/workflows/deploy.yml` build et déploie automatiquement à chaque push

## 📝 Mettre à jour le site

Après chaque modification :
```bash
git add .
git commit -m "description du changement"
git push
```
GitHub Actions rebuild et déploie automatiquement (~2-3 min).

## 🌐 Option : domaine personnalisé

Si vous voulez `junior-mbadinga.com` au lieu de `username.github.io/repo/` :
1. Achetez le domaine
2. Dans GitHub → Settings → Pages → Custom domain → entrez votre domaine
3. Le basePath devient inutile → modifiez le workflow pour retirer `BASE_PATH`

## ⚠️ Notes

- Les vidéos YouTube doivent rester **publiques** ou **non répertoriées** (pas privées)
- Si vous changez le nom du dépôt GitHub, le basePath change → le rebuild se fait automatiquement au prochain push
- Le formulaire de contact n'envoie pas d'email directement : il ouvre le client mail du visiteur. Pour un envoi automatique, utilisez un service comme [Formspree](https://formspree.io) (gratuit, 50 messages/mois)
