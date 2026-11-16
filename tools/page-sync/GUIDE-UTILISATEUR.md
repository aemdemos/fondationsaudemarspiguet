# Page Sync — Guide utilisateur

Page Sync aide à créer et à maintenir la version française et anglaise d’un article **News** ou **Projects** dans DA. L’outil travaille sur le site de la page ouverte et ne remplace jamais une page existante par une copie complète.

## Avant de commencer

- Ouvrez dans DA l’article News ou Projects que vous souhaitez utiliser.
- Attendez que DA ait enregistré vos dernières modifications.
- Ouvrez **Page Sync** depuis la Library.
- Vérifiez toujours les chemins source et cible affichés avant de confirmer une action.

Page Sync fonctionne entre le français et l’anglais, sur le même site. Il ne sert pas à synchroniser les pages de listing.

## Si la page dans l’autre langue n’existe pas

Page Sync propose de créer une copie de la page ouverte dans l’autre langue.

1. Vérifiez le chemin de destination proposé et confirmez qu’il correspond au bon article.
2. Cliquez sur **Analyse**. Cette étape vérifie la page et prépare la copie ; elle ne modifie rien.
3. Vérifiez le résultat, puis cliquez sur **Apply changes…**.
4. Dans la confirmation, choisissez **Write in DA** pour créer la page, ou **Cancel** pour annuler.
5. Lorsque la page est créée, ouvrez son lien dans les résultats pour la modifier dans DA.
6. Traduisez et relisez la page avant de la prévisualiser et de la publier.

La copie est identique au contenu source enregistré : texte, blocs, images, liens et metadata sont repris tels quels. **Page Sync ne traduit pas la page.** Vérifiez notamment le titre, le texte, les alternatives des images, les liens, les noms et valeurs des metadata et la ligne `Language`, si elle existe. Les fichiers associés sont référencés, pas dupliqués.

La destination est déterminée automatiquement à partir de la correspondance des langues du site. Si aucune correspondance précise n’est disponible, Page Sync garde le même nom d’article dans le dossier de l’autre langue. **Si le chemin affiché ne semble pas correct, annulez et demandez de l’aide avant de continuer.**

La prévisualisation et la publication sont des étapes séparées et ne sont jamais automatiques. Après avoir traduit et relu la page, utilisez **Preview** pour la vérifier, puis **Publish…** pour la publier lorsque vous êtes prêt.

## Si la page dans l’autre langue existe déjà

L’encadré **Only metadata can be synced** indique clairement ce mode :

- **Une seule ligne de metadata peut être synchronisée par opération.**
- Il n’est pas possible de copier toute la page par-dessus une page existante.
- Le texte, les images, les blocs et les autres lignes de metadata de la page cible restent inchangés.
- La page source est en lecture seule ; seule la page cible peut être mise à jour.

Les chemins **Source** et **Target** sont indiqués séparément dans l’encadré.

1. Dans **Metadata row to sync**, choisissez la ligne à transférer.
2. Cliquez sur **Analyse** et vérifiez le résultat ainsi que la valeur qui sera envoyée.
3. Cliquez sur **Apply changes…**, puis confirmez avec **Write in DA**. Choisissez **Cancel** pour ne rien modifier.
4. Si vous devez synchroniser une autre ligne, recommencez l’opération en sélectionnant cette ligne.

La valeur de la ligne est copiée sans traduction. Page Sync adapte, lorsque c’est possible, le nom de la metadata et les liens internes à la langue cible. Relisez le résultat avant de le prévisualiser ou de le publier.

## Si une erreur ou un conflit apparaît

- **Le chemin cible est incorrect :** annulez. Ne confirmez pas la création ou la mise à jour.
- **Un autre auteur crée la page pendant l’opération :** Page Sync arrête la création pour éviter de remplacer son travail. Fermez puis rouvrez le plugin afin qu’il vérifie de nouveau la situation.
- **Page Sync affiche une erreur d’accès ou de serveur :** la page n’est pas considérée comme absente et aucune création n’est lancée. Réessayez plus tard ou demandez de l’aide.
- **DA ne fournit pas de protection complète contre les modifications simultanées :** pour une mise à jour de metadata, suivez l’avertissement affiché et évitez de modifier la page cible en même temps qu’un autre auteur.

En cas de doute, choisissez **Cancel** et demandez conseil avant de réessayer.
