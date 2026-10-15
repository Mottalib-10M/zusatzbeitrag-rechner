#!/usr/bin/env bash
# Ping IndexNow (Bing/Yandex) avec toutes les URLs du sitemap après déploiement.
# Usage : scripts/indexnow.sh [https://zusatzbeitragrechner.de]
set -euo pipefail
SITE="${1:-https://zusatzbeitragrechner.de}"
KEY="f20dab53194fe5404096a1727ba38eb1"
URLS=$(curl -s "$SITE/sitemap-0.xml" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | jq -R . | jq -s .)
HOST=$(echo "$SITE" | sed -E 's#https?://##')
curl -s -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"$SITE/$KEY.txt\",\"urlList\":$URLS}" -w "\nHTTP %{http_code}\n"
