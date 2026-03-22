# Deploy Talimatları – Kendi Domainine Aktarma

## 1. GitHub'a Yükle

### Adım A: GitHub'da repo oluştur

1. https://github.com/new adresine git
2. **Repository name:** `klinik-quiz-oyunu` (veya istediğin isim)
3. **Public** seç
4. ❌ README ekleme, .gitignore ekleme – hepsi projede var
5. **Create repository** tıkla

### Adım B: Projeyi gönder

GitHub repo oluşturduktan sonra, sayfada gösterilen URL'yi kopyala. Sonra PowerShell'de:

```powershell
cd "c:\Users\Bartu\OneDrive\Desktop\Programlar\Projeler\minigame"

# KULLANICI_ADIN yerine kendi GitHub kullanıcı adını yaz:
git remote add origin https://github.com/KULLANICI_ADIN/klinik-quiz-oyunu.git

git push -u origin main
```

(GitHub kullanıcı adı/şifre veya token isteyebilir – giriş yap)

## 2. Railway ile Deploy (Öğrenci – Ücretsiz)

1. **Railway'e git:** https://railway.app
2. **"Login"** → **"Login with GitHub"**
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Reponu seç: `klinik-quiz-oyunu`
5. Deploy otomatik başlar (2-3 dk)
6. **Domain oluşturma** – Önemli: Proje değil, **servisi** (kutucuğu) seç:
   - Ana ekranda deploy edilen **servis kutusuna tıkla** (GitHub ikonlu kutucuk)
   - Sağda veya üstte **Settings** sekmesine gir
   - **"Networking"** veya **"Public Networking"** bölümünü bul
   - **"Generate Domain"** butonuna tıkla
   - Alternatif: Servis kartında "Expose" veya "Generate Domain" yazan uyarı/banner varsa oradan da tıklayabilirsin
   - Sonuç: `xxx.up.railway.app` gibi bir URL alırsın

**Hâlâ bulamıyorsan:** Railway arayüzü değişebilir. Şunları dene:
- Sol menüde **"Variables"**, **"Deployments"** yanında **"Settings"** olmalı
- Settings içinde aşağı kaydır – **"Networking"**, **"Domains"** veya **"Public"** başlığına bak
- Servis kutusunun üzerinde **"⋯" (üç nokta)** menüsüne tıkla, orada domain seçeneği olabilir

## 3. bartwo.me Domainini Bağla (Railway)

Quiz uygulaması **quiz.bartwo.me** adresinde çalışacak.

### Railway tarafı

1. Railway'de servise tıkla → **Settings** → **Networking** / **Public Networking**
2. **"+ Custom Domain"** veya **"Add Custom Domain"** tıkla
3. Şunu yaz: **`quiz.bartwo.me`**
4. Railway sana bir CNAME değeri verecek, örn: `klinik-quiz-xxxx.up.railway.app`

### DNS tarafı (bartwo.me'nin DNS ayarları)

bartwo.me'yi nereden yönetiyorsun? (GoDaddy, Namecheap, Cloudflare, Hostinger vb.)

**Yeni DNS kaydı ekle:**

| Tip   | Name/Host | Value/Points to |
|-------|-----------|-----------------|
| CNAME | quiz      | (Railway'in verdiği adres) |

- **Name:** `quiz` → adres `quiz.bartwo.me` olur
- **Value:** Railway'de yazan `xxx.up.railway.app` adresini kopyala yapıştır

### Doğrulama

5–30 dakika sonra `https://quiz.bartwo.me` açılmalı. SSL otomatik gelir.

- **Oyuncu girişi:** https://quiz.bartwo.me
- **Tahta:** https://quiz.bartwo.me/tahta

## Alternatif: Render (Ücretsiz)

1. https://render.com → GitHub ile giriş
2. **New** → **Web Service**
3. Reponu bağla
4. **Start Command:** `npm start`
5. **Deploy**
6. Settings → Custom Domain ekle

## Sonuç

- **Oyuncu girişi:** https://quiz.bartwo.me
- **Tahta:** https://quiz.bartwo.me/tahta
- QR kod tahta sayfasında otomatik olarak quiz.bartwo.me adresini gösterecek.
