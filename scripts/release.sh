#!/bin/bash

# Release script pro Husí Farma PWA
# Použití: ./scripts/release.sh [patch|minor|major]

set -e

cd "$(dirname "$0")/.."

# Barvy pro výstup
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🪿 Husí Farma - Release Script${NC}"
echo ""

# 1. Ukončení předchozích procesů
echo -e "${YELLOW}[1/5] Ukončuji předchozí procesy...${NC}"
pkill -f cloudflared 2>/dev/null && echo "  ✓ Ukončen cloudflared" || echo "  - Žádný cloudflared neběžel"
pkill -f "vite preview" 2>/dev/null && echo "  ✓ Ukončen vite preview" || echo "  - Žádný vite preview neběžel"
sleep 1

# 2. Zvýšení verze
VERSION_TYPE=${1:-patch}
echo -e "${YELLOW}[2/5] Zvyšuji verzi (${VERSION_TYPE})...${NC}"

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "  Aktuální verze: $CURRENT_VERSION"

# Rozdělit verzi na části
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

case $VERSION_TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
  *)
    echo -e "${RED}Neplatný typ verze: $VERSION_TYPE (použij patch, minor nebo major)${NC}"
    exit 1
    ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
echo "  Nová verze: $NEW_VERSION"

# Aktualizovat package.json
node -e "
const fs = require('fs');
const pkg = require('./package.json');
pkg.version = '$NEW_VERSION';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Aktualizovat vite.config.ts
sed -i '' "s/__APP_VERSION__: JSON.stringify('.*')/__APP_VERSION__: JSON.stringify('$NEW_VERSION')/" vite.config.ts

echo "  ✓ Verze aktualizována"

# 3. Build
echo -e "${YELLOW}[3/5] Buildím aplikaci...${NC}"
bun run build
echo "  ✓ Build dokončen"

# 4. Spuštění preview serveru
echo -e "${YELLOW}[4/5] Spouštím preview server...${NC}"
bun run preview &
PREVIEW_PID=$!
sleep 2
echo "  ✓ Preview server běží (PID: $PREVIEW_PID)"

# 5. Spuštění cloudflare tunelu
echo -e "${YELLOW}[5/5] Spouštím cloudflare tunel...${NC}"

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || echo 'localhost')
LOG_FILE=$(mktemp)

# Spustit cloudflared na pozadí
npx cloudflared tunnel --url http://localhost:4173 > "$LOG_FILE" 2>&1 &
TUNNEL_PID=$!

# Čekat na URL (max 30 sekund)
TUNNEL_URL=""
for i in {1..30}; do
  sleep 1
  TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_FILE" 2>/dev/null | head -1)
  if [ -n "$TUNNEL_URL" ]; then
    break
  fi
done

rm -f "$LOG_FILE"

if [ -z "$TUNNEL_URL" ]; then
  echo -e "${RED}  ✗ Nepodařilo se získat URL tunelu${NC}"
  echo ""
  echo -e "  Zkus ručně: npx cloudflared tunnel --url http://localhost:4173"
  exit 1
fi

echo "  ✓ Tunel běží"
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Release v${NEW_VERSION} je připraven!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  📱 Lokální síť:  ${YELLOW}http://${LOCAL_IP}:4173${NC}"
echo -e "  🌐 HTTPS tunel:  ${YELLOW}${TUNNEL_URL}${NC}"
echo ""
echo -e "  Pro ukončení serverů spusť: ${RED}bun run stop${NC}"
echo ""
