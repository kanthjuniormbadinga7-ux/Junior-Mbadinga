# Dossier des vidéos — Portfolio Junior Mbadinga

Ce dossier contient les vidéos affichées dans la section **Vidéos** du portfolio.

## Fichiers attendus

| Fichier | Titre affiché |
|---|---|
| `spot-agl.mp4` | Spot Institutionnel AGL |
| `ecole-sante.mp4` | École de Santé de Libreville |
| `regie-live.mp4` | Régie Live & Streaming |

## Comment remplacer les placeholders par vos vraies vidéos

1. **Compressez vos vidéos** (voir réglages ci-dessous).
2. **Nommez-les exactement** comme ci-dessus (`spot-agl.mp4`, etc.).
3. **Remplacez les fichiers** dans ce dossier `public/videos/`.
4. C'est fini — le site les prend en charge automatiquement.

## Réglages d'encodage recommandés

Pour un portfolio web fluide (qualité nette + fichier léger) :

- **Format** : `.mp4` (conteneur)
- **Codec vidéo** : H.264 (x264) — compatible tous navigateurs
- **Codec audio** : AAC, 128 kbps
- **Résolution** : 1280×720 (720p) ou 1920×1080 (1080p)
- **Bitrate vidéo** : 2 à 4 Mbps pour 1080p, 1 à 2 Mbps pour 720p
- **Framerate** : 24, 25 ou 30 fps
- **Faststart** : activé (permet la lecture avant la fin du téléchargement)

### Avec HandBrake (gratuit, logiciel desktop)
1. Glissez votre vidéo dedans
2. Preset : **Fast 1080p30** (ou Fast 720p30)
3. Onglet Video → décochez "Web Optimized" → cochez plutôt... laissez par défaut
4. Format de sortie : MP4
5. Lancez l'encodage

### Avec ffmpeg (ligne de commande)
```bash
ffmpeg -i video_source.mov \
  -c:v libx264 -preset slow -crf 23 \
  -vf "scale=1280:720" \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  spot-agl.mp4
```

## Notes

- Les fichiers placeholder actuels (5 secondes, image fixe) ne sont là que pour
  tester l'affichage. Remplacez-les par vos vrais montages.
- Si une vidéo est absente, le lecteur affiche juste le poster (image fixe).
- Pour ajouter une 4ᵉ vidéo : ajoutez un objet au tableau `VIDEOS` dans
  `src/app/page.tsx` et déposez le fichier `.mp4` ici.
