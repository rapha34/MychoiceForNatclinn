# Déploiement MyChoice sur Debian (Docker + Compose + Caddy)

Ce guide publie l'application sur `raphaelcs.fr` avec :
- `mychoice-app` (Spring Boot + frontend intégré)
- `mychoice-db` (MariaDB)
- Caddy en reverse proxy HTTPS

## 1) Pré-requis serveur

- Docker + plugin Compose installés
- Caddy déjà opérationnel sur le serveur
- DNS `raphaelcs.fr` pointant sur l'IP du serveur

## 2) Déployer l'application

```bash
git clone https://github.com/rapha34/MychoiceForNatclinn.git
cd MychoiceForNatclinn
```

Édite `docker-compose.prod.yml` et remplace :
- `change-me-db-password`
- `change-me-root-password`

Puis lance :

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Vérifie que l'app répond en local :

```bash
curl -I http://127.0.0.1:9090
```

## 3) Configuration Caddy

Ajoute ce bloc dans ta configuration Caddy (ex: `/etc/caddy/Caddyfile`) :

```caddyfile
raphaelcs.fr {
    encode zstd gzip
    reverse_proxy 127.0.0.1:9090
}

www.raphaelcs.fr {
    redir https://raphaelcs.fr{uri}
}
```

Recharge Caddy :

```bash
sudo systemctl reload caddy
```

## 4) Vérifications

- Frontend : `https://raphaelcs.fr`
- API : `https://raphaelcs.fr/api/project?name=<id>`

## 5) Mises à jour futures

Après un `git pull` :

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Notes

- Le backend écoute en interne sur le port `9090`.
- Le mapping `127.0.0.1:9090:9090` évite d'exposer directement l'app sur Internet ; seul Caddy est exposé.
- Le schéma SQL est injecté automatiquement à la première initialisation de la base via `mychoice-backend/db/sql/schema.sql`.
