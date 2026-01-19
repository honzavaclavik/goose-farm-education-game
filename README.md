# Chytej Husy! 🪿

Jednoduchá PWA hra pro děti - chytej padající husy do hnízda.

## Spuštění

```bash
# Instalace závislostí
bun install

# Development server
bun run dev

# Build pro produkci
bun run build

# Spuštění produkční verze
bun run preview
```

## Instalace na tablet (iOS)

### Varianta 1: Přes lokální síť (stejná WiFi)

```bash
bun run build
bun run preview
```

Otevři na tabletu v Safari: `http://<IP_POCITACE>:4173`

Zjištění IP:
```bash
ipconfig getifaddr en0
```

### Varianta 2: Přes HTTPS tunel (doporučeno pro PWA)

```bash
# 1. Spusť preview server
bun run preview &

# 2. Spusť cloudflare tunel
npx cloudflared tunnel --url http://localhost:4173
```

Získáš HTTPS adresu typu: `https://xxx-xxx-xxx.trycloudflare.com`

### Přidání na plochu (iOS Safari)

1. Otevři HTTPS adresu v Safari
2. Klepni na ikonu **Sdílet** (čtvereček se šipkou)
3. Vyber **Přidat na plochu**
4. Potvrď název a klepni **Přidat**

Po instalaci hra funguje offline.

## Jak hrát

- Táhni prstem po obrazovce pro pohyb hnízda
- Chytej padající husy:
  - 🪿 Husa = 10 bodů
  - 🦢 Labuť = 15 bodů
  - 🐣 Housátko = 20 bodů
  - 🥚 Zlaté vejce = 50 bodů
  - 🦆 Kachna = 25 bodů
  - 🐤 Kuře = 5 bodů
- Máš 3 životy (🥚)
- Každých 100 bodů = nový level (rychlejší hra)

## Zastavení serverů

```bash
pkill -f cloudflared
pkill -f "vite preview"
```
