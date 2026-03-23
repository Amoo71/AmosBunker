# Branch-Update-Fehler (GitHub "Update branch" → Error 500)

Wenn GitHub beim Klick auf **Update branch** dauerhaft mit **Error 500** scheitert, kann man den Branch lokal sauber synchronisieren und wieder pushen.

## Schnelllösung (empfohlen)

```bash
git fetch origin
git checkout work
git rebase origin/main
# Falls Konflikte kommen: lösen, dann
git add <dateien>
git rebase --continue
# Danach aktualisierten Branch pushen
git push --force-with-lease origin work
```

## Alternative ohne Rebase (Merge statt Rebase)

```bash
git fetch origin
git checkout work
git merge origin/main
git push origin work
```

## Wenn GitHub weiter 500 zeigt

1. PR schließen (nicht löschen),
2. neuen Branch aus aktuellem `main` erzeugen,
3. Änderungen per `cherry-pick` übernehmen,
4. neue PR öffnen.

Beispiel:

```bash
git fetch origin
git checkout -b work-refresh origin/main
git cherry-pick <dein_commit_hash>
git push -u origin work-refresh
```

Danach mit `work-refresh` eine frische PR aufmachen.

## Hinweis

Ein GitHub-`500` ist typischerweise ein Server-/PR-Metadatenproblem bei GitHub selbst (oder ein kaputter PR-Merge-Job), nicht ein Fehler im Frontend-Code.
