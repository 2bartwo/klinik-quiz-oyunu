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

## 4. Restoran menüsü (Ateşten Lezzetler) — bartwo.me

Menü aynı Railway servisinde; ekstra sunucu gerekmez. İki kullanım şekli var.

### Seçenek A — Mevcut quiz adresinin altında (en hızlısı)

Deploy ettiğiniz Railway URL’si veya özel alan adınız ne ise, menü yolu:

- **Menü:** `https://quiz.bartwo.me/menu`  
  (Railway’de henüz özel alan yoksa: `https://SIZIN-PROJE.up.railway.app/menu`)

QR kodda ve masadaki kartta bu tam adresi kullanın. Menü sayfasındaki “QR” butonu da yayında bu URL’yi üretir.

### Seçenek B — Sadece menü için alt alan: `menu.bartwo.me` (önerilen)

Müşteriler `menu.bartwo.me` yazınca doğrudan menüye gitsin; quiz kökü karışmasın.

**Railway**

1. Aynı servisi seçin → **Settings** → **Networking** / **Public Networking**
2. **Custom Domain** → **`menu.bartwo.me`** ekleyin
3. Size verilen hedefi not edin (genelde `xxxx.up.railway.app` CNAME)

**DNS (bartwo.me)**

| Tip   | Name/Host | Value                         |
|-------|-----------|-------------------------------|
| CNAME | menu      | Railway’in verdiği adres      |
| CNAME | menu2     | Railway’in verdiği adres (aynı servis) |

Projede varsayılan olarak `menu.bartwo.me` kökü (`/`) otomatik **`/menu`** sayfasına yönlendirilir. **Yazlık kahve menüsü** için `menu2.bartwo.me` kökü **`/menu2`** sayfasına gider.

Railway **Variables** (isteğe bağlı):

| Name | Value |
|------|--------|
| `MENU_SUBDOMAIN_HOSTS` | `menu.bartwo.me` (virgülle birden fazla host; hepsi → `/menu`) |
| `MENU2_SUBDOMAIN_HOSTS` | `menu2.bartwo.me` (→ `/menu2`) |

Boş bırakılan liste için yönlendirme yapılmaz. Menüyü sadece yol ile kullanmak için: `https://…/menu` ve `https://…/menu2`.

**Özet adresler**

- Quiz: `https://quiz.bartwo.me` (ve `/tahta`)
- Menü: `https://menu.bartwo.me` → `/menu` veya `https://quiz.bartwo.me/menu`
- Yazlık kahve: `https://menu2.bartwo.me` → `/menu2` veya `https://quiz.bartwo.me/menu2`

### GitHub Pages (bartwo.me kökü) ile karışıklık

`bartwo.me` kökünü GitHub Pages’e bağladıysanız, **aynı kökü** aynı anda Railway’e veremezsiniz. Menü için ya **`menu.bartwo.me`** gibi bir alt alan (CNAME → Railway) kullanın ya da menüyü sadece **`quiz.bartwo.me/menu`** üzerinden yayınlayın.

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
- **Restoran menüsü:** https://quiz.bartwo.me/menu veya (ayarladıysanız) https://menu.bartwo.me
- **Yazlık kahve menüsü:** https://quiz.bartwo.me/menu2 veya https://menu2.bartwo.me
- QR kod tahta sayfasında otomatik olarak quiz.bartwo.me adresini gösterecek; menü QR’ı için menü sayfasındaki kodu veya `menu.bartwo.me` kullanın.
