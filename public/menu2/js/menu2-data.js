/** Yazlık Cafe — kahve menüsü (fiyatları menu2-data.js üzerinden güncelleyin) */
window.COFFEE_MENU = {
  cafe: {
    name: 'Yazlık Cafe',
    tagline: 'Deniz esintisi, taze kavrum',
    blurb: 'Açık alanda servis; sıcak ve soğuk kahve çeşitlerimiz yaz boyunca sizinle.',
    hours: 'Yaz sezonu · 08:00 — 23:00',
    location: 'Sahil şeridi · yazlık alan'
  },
  categories: [
    {
      id: 'sicak_klasik',
      title: 'Sıcak klasikler',
      subtitle: 'Espresso temelli, geleneksel demleme',
      items: [
        { name: 'Espresso', desc: 'Tek shot, yoğun gövde; günlük çekirdek.', price: 55, temp: 'hot', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80' },
        { name: 'Double espresso', desc: 'Çift shot, daha uzun keyif.', price: 75, temp: 'hot', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80' },
        { name: 'Ristretto', desc: 'Kısa ekstraksiyon, yoğun aroma.', price: 55, temp: 'hot', image: 'https://images.unsplash.com/photo-1610889556528-9a770e26cb06?w=800&q=80' },
        { name: 'Americano', desc: 'Espresso + sıcak su; dengeli içim.', price: 65, temp: 'hot', image: 'https://images.unsplash.com/photo-1551030173-122aabc4569a?w=800&q=80' },
        { name: 'Lungo', desc: 'Uzun çekilmiş espresso.', price: 65, temp: 'hot', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
        { name: 'Macchiato', desc: 'Espresso üzerine az süt köpüğü.', price: 70, temp: 'hot', image: 'https://images.unsplash.com/photo-1572442388796-9caf804938c4?w=800&q=80' },
        { name: 'Cortado', desc: 'Espresso ve eşit miktar buğulanmış süt.', price: 75, temp: 'hot', image: 'https://images.unsplash.com/photo-1570968915862-07b9-ecb942a?w=800&q=80' },
        { name: 'Filtre kahve', desc: 'Günün çekirdeği, V60 demleme.', price: 70, temp: 'hot', image: 'https://images.unsplash.com/photo-1497935586351-67a276559faa?w=800&q=80' },
        { name: 'Chemex', desc: 'Temiz gövdeli, iki kişilik paylaşım.', price: 95, temp: 'hot', image: 'https://images.unsplash.com/photo-1447933601403-0c6688cb94f1?w=800&q=80' },
        { name: 'Türk kahvesi', desc: 'Geleneksel cezve; lokum eşliğinde.', price: 60, temp: 'hot', image: 'https://images.unsplash.com/photo-1514432359962-1e6f668b504c?w=800&q=80' },
        { name: 'Red eye', desc: 'Filtre kahve + espresso shot.', price: 85, temp: 'hot', image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f2?w=800&q=80' }
      ]
    },
    {
      id: 'sicak_sutlu',
      title: 'Sıcak sütlü & köpüklü',
      subtitle: 'Latte sanatı ve yumuşak dokular',
      items: [
        { name: 'Cappuccino', desc: 'Espresso, buğulanmış süt, kalın köpük.', price: 80, temp: 'hot', image: 'https://images.unsplash.com/photo-1578314675249-a6910f97ab4c?w=800&q=80' },
        { name: 'Latte', desc: 'Bol sütlü, ince köpük; isteğe göre şeker.', price: 85, temp: 'hot', image: 'https://images.unsplash.com/photo-1561882468-9110e03fa0b6?w=800&q=80' },
        { name: 'Flat white', desc: 'Çift ristretto, mikro köpüklü süt.', price: 90, temp: 'hot', image: 'https://images.unsplash.com/photo-1534778101976-62847782c72b?w=800&q=80' },
        { name: 'Mocha', desc: 'Espresso, sıcak çikolata ve krema.', price: 95, temp: 'hot', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80' },
        { name: 'White mocha', desc: 'Beyaz çikolata ve espresso.', price: 100, temp: 'hot', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80' },
        { name: 'Caramel latte', desc: 'Karamel sos ve yumuşak süt.', price: 95, temp: 'hot', image: 'https://images.unsplash.com/photo-1462917758480-4ac7f0a1b0e0?w=800&q=80' },
        { name: 'Vanilya latte', desc: 'Madagaskar vanilya şurubu.', price: 95, temp: 'hot', image: 'https://images.unsplash.com/photo-1570968915862-07b9-ecb942a?w=800&q=80' },
        { name: 'Fındık latte', desc: 'Kavrulmuş fındık aroması.', price: 95, temp: 'hot', image: 'https://images.unsplash.com/photo-1503481766315-7a586b20f66d?w=800&q=80' },
        { name: 'Badem latte', desc: 'Şeker ilavesiz badem sütü seçeneği (+15 ₺).', price: 90, temp: 'hot', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80' },
        { name: 'Honey latte', desc: 'Çiçek balı ve tarçın tozu.', price: 95, temp: 'hot', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80' }
      ]
    },
    {
      id: 'soguk_dem',
      title: 'Soğuk demleme & buzlu sade',
      subtitle: 'Yavaş demleme, buzla ferahlık',
      items: [
        { name: 'Cold brew', desc: '14 saat soğuk demleme; düşük asidite.', price: 90, temp: 'cold', image: 'https://images.unsplash.com/photo-1461023058941-07fd78416cc9?w=800&q=80' },
        { name: 'Nitro cold brew', desc: 'Azotlu, kremsi doku; buz gibi.', price: 110, temp: 'cold', image: 'https://images.unsplash.com/photo-1517701554697-adb57b160566?w=800&q=80' },
        { name: 'Buzlu americano', desc: 'Çift shot espresso, buz ve su.', price: 75, temp: 'cold', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80' },
        { name: 'Buzlu filtre', desc: 'Soğutulmuş günün filtresi.', price: 75, temp: 'cold', image: 'https://images.unsplash.com/photo-1497935586351-67a276559faa?w=800&q=80' },
        { name: 'Espresso tonic', desc: 'Espresso, tonik ve limon kabuğu — yaz klasiği.', price: 95, temp: 'cold', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80' },
        { name: 'Buzlu red eye', desc: 'Soğuk filtre + espresso.', price: 95, temp: 'cold', image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f2?w=800&q=80' },
        { name: 'Japanese iced coffee', desc: 'Doğrudan buz üzerine demleme; parlak tat.', price: 85, temp: 'cold', image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&q=80' }
      ]
    },
    {
      id: 'soguk_sutlu',
      title: 'Buzlu sütlü & kremsi',
      subtitle: 'Dondurma ve süt ile serinletici',
      items: [
        { name: 'Buzlu latte', desc: 'Espresso, soğuk süt, buz.', price: 85, temp: 'cold', image: 'https://images.unsplash.com/photo-1517701554697-adb57b160566?w=800&q=80' },
        { name: 'Buzlu mocha', desc: 'Çikolata, espresso, buz ve krema.', price: 100, temp: 'cold', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80' },
        { name: 'Buzlu beyaz mocha', desc: 'Beyaz çikolata ve soğuk süt.', price: 105, temp: 'cold', image: 'https://images.unsplash.com/photo-1462917758480-4ac7f0a1b0e0?w=800&q=80' },
        { name: 'Buzlu karamel macchiato', desc: 'Katmanlı vanilya sütü ve espresso.', price: 105, temp: 'cold', image: 'https://images.unsplash.com/photo-1572442388796-9caf804938c4?w=800&q=80' },
        { name: 'Coffee frappe', desc: 'Buz, espresso ve süt karışımı; krema.', price: 110, temp: 'cold', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80' },
        { name: 'Çikolatalı frappe', desc: 'Espresso ve bitter çikolata.', price: 115, temp: 'cold', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80' },
        { name: 'Buzlu vanilya latte', desc: 'Serin vanilya ve tam yağlı süt.', price: 95, temp: 'cold', image: 'https://images.unsplash.com/photo-1561882468-9110e03fa0b6?w=800&q=80' },
        { name: 'Buzlu flat white', desc: 'Soğuk mikroköpük ile dengeli shot.', price: 95, temp: 'cold', image: 'https://images.unsplash.com/photo-1534778101976-62847782c72b?w=800&q=80' },
        { name: 'Affogato', desc: 'Espresso, vanilyalı dondurma — yaz tatlısı.', price: 95, temp: 'cold', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80' }
      ]
    },
    {
      id: 'yaz_ozel',
      title: 'Yaz özel & alternatif',
      subtitle: 'Limonata esintisi ve bitki notaları',
      items: [
        { name: 'Limonlu cold brew', desc: 'Cold brew, ev yapımı limonata şurubu.', price: 105, temp: 'cold', image: 'https://images.unsplash.com/photo-1523677018908-5b2a7fb42c6f?w=800&q=80' },
        { name: 'Hindistan cevizi latte (soğuk)', desc: 'Espresso ve buzlu hindistan cevizi sütü.', price: 110, temp: 'cold', image: 'https://images.unsplash.com/photo-1533777326410-61b6151d44a8?w=800&q=80' },
        { name: 'Buzlu matcha latte', desc: 'Ceremonial matcha ve süt (kafeinsiz seçenek).', price: 115, temp: 'cold', image: 'https://images.unsplash.com/photo-1515825838458-f2a894b420cd?w=800&q=80' },
        { name: 'Portakallı tonic kahve', desc: 'Espresso, portakal ve tonik.', price: 100, temp: 'cold', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80' },
        { name: 'Buzlu chai latte', desc: 'Baharatlı chai konsantre ve süt.', price: 95, temp: 'cold', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80' },
        { name: 'Kokos & ananas smoothie kahve', desc: 'Hafif meyve, espresso shot.', price: 120, temp: 'cold', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80' },
        { name: 'Yaz köpüğü', desc: 'Soğuk köpüklü latte, hindistan cevizi kreması.', price: 115, temp: 'cold', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80' },
        { name: 'Çilekli buzlu latte', desc: 'Çilek püresi ve hafif espresso.', price: 110, temp: 'cold', image: 'https://images.unsplash.com/photo-1497534444932-cbebf974bab2?w=800&q=80' }
      ]
    }
  ]
};
