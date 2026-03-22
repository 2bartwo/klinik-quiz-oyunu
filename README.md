# Klinik Eğitim Quiz Oyunu

Web üzerinden oynanabilen, takım tabanlı çoktan seçmeli quiz oyunu. QR kod ile katılım, gerçek zamanlı skor grafiği.

## Kurulum

```bash
npm install
npm start
```

## Kullanım

1. **Tahtayı aç** (projektör/ekran için): http://localhost:3000/tahta
   - Bu sayfada QR kod görünür
   - Oyuncular bu QR kodu okutarak siteye girer
   - Canlı skor grafiği burada gösterilir
   - "Sonraki" ile soruyu ilerlet, "Yeniden Başlat" ile oyunu sıfırla

2. **Oyuncu girişi**: http://localhost:3000 (veya QR kod)
   - Takım adını gir (örn: Takım 1, Kırmızı Takım)
   - Soruyu gör, cevabı seç
   - Doğru cevaplar tahtadaki grafikte anında artar

## Aynı ağda kullanım

Diğer cihazlardan erişim için bilgisayarın IP adresini kullanın:
- `http://192.168.x.x:3000` (IP adresinizi yazın)
- Tahta sayfasındaki QR kod otomatik olarak mevcut adresi kullanır

## Özellikler

- 17 klinik eğitim sorusu
- Takım bazlı yarışma
- Gerçek zamanlı bar grafik (Socket.io)
- Mobil uyumlu arayüz
- QR kod ile kolay katılım
