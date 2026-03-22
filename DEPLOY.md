# Deploy Talimatları – Kendi Domainine Aktarma

## 1. GitHub'a Yükle

```bash
# GitHub'da yeni repo oluştur: https://github.com/new
# Repo adı: klinik-quiz-oyunu (veya istediğin isim)
# Public seç, README ekleme (zaten var)

# Sonra bu komutları çalıştır:
git remote add origin https://github.com/KULLANICI_ADIN/klinik-quiz-oyunu.git
git branch -M main
git push -u origin main
```

## 2. Railway ile Deploy (Öğrenci – Ücretsiz)

1. **Railway'e git:** https://railway.app
2. **"Login"** → **"Login with GitHub"**
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Reponu seç: `klinik-quiz-oyunu`
5. Deploy otomatik başlar (2-3 dk)
6. **"Settings"** → **"Networking"** → **"Generate Domain"**  
   → `klinik-quiz-xxx.up.railway.app` gibi bir URL alırsın

## 3. Kendi Domainini Bağla (Railway)

1. Railway'de projenin **Settings** → **Networking** → **Custom Domain**
2. **"Add Custom Domain"** → Domainini yaz (örn: `quiz.senindomain.com`)
3. Railway sana DNS ayarlarını gösterir:
   - **CNAME:** `quiz` → `klinik-quiz-xxx.up.railway.app
   - veya **A kaydı** (IP adresi)
4. Domain sağlayıcında (GoDaddy, Namecheap, Cloudflare vb.) DNS ayarlarına git
5. Yeni kayıt ekle:
   - **Tip:** CNAME
   - **Name/Host:** quiz (veya @ ana domain için)
   - **Value/Points to:** `klinik-quiz-xxx.up.railway.app`

6. 5-30 dakika bekle, SSL otomatik aktif olur.

## Alternatif: Render (Ücretsiz)

1. https://render.com → GitHub ile giriş
2. **New** → **Web Service**
3. Reponu bağla
4. **Start Command:** `npm start`
5. **Deploy**
6. Settings → Custom Domain ekle

## Sonuç

- **Oyuncu girişi:** `https://quiz.senindomain.com`
- **Tahta:** `https://quiz.senindomain.com/tahta`
- QR kod tahta sayfasında otomatik güncellenir.
