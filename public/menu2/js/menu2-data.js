/** Yazlık Cafe — kahve menüsü (görseller: Pexels CDN) */
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
        { name: 'Espresso', desc: 'Tek shot, yoğun gövde; günlük çekirdek.', price: 55, temp: 'hot', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Double espresso', desc: 'Çift shot, daha uzun keyif.', price: 75, temp: 'hot', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Ristretto', desc: 'Kısa ekstraksiyon, yoğun aroma.', price: 55, temp: 'hot', image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Americano', desc: 'Espresso + sıcak su; dengeli içim.', price: 65, temp: 'hot', image: 'https://images.pexels.com/photos/3025220/pexels-photo-3025220.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Lungo', desc: 'Uzun çekilmiş espresso.', price: 65, temp: 'hot', image: 'https://images.pexels.com/photos/3026802/pexels-photo-3026802.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Macchiato', desc: 'Espresso üzerine az süt köpüğü.', price: 70, temp: 'hot', image: 'https://images.pexels.com/photos/3026792/pexels-photo-3026792.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Cortado', desc: 'Espresso ve eşit miktar buğulanmış süt.', price: 75, temp: 'hot', image: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Filtre kahve', desc: 'Günün çekirdeği, V60 demleme.', price: 70, temp: 'hot', image: 'https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Chemex', desc: 'Temiz gövdeli, iki kişilik paylaşım.', price: 95, temp: 'hot', image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Türk kahvesi', desc: 'Geleneksel cezve; lokum eşliğinde.', price: 60, temp: 'hot', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Red eye', desc: 'Filtre kahve + espresso shot.', price: 85, temp: 'hot', image: 'https://images.pexels.com/photos/4922886/pexels-photo-4922886.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ]
    },
    {
      id: 'sicak_sutlu',
      title: 'Sıcak sütlü & köpüklü',
      subtitle: 'Latte sanatı ve yumuşak dokular',
      items: [
        { name: 'Cappuccino', desc: 'Espresso, buğulanmış süt, kalın köpük.', price: 80, temp: 'hot', image: 'https://images.pexels.com/photos/5824246/pexels-photo-5824246.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Latte', desc: 'Bol sütlü, ince köpük; isteğe göre şeker.', price: 85, temp: 'hot', image: 'https://images.pexels.com/photos/1491934/pexels-photo-1491934.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Flat white', desc: 'Çift ristretto, mikro köpüklü süt.', price: 90, temp: 'hot', image: 'https://images.pexels.com/photos/6830337/pexels-photo-6830337.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Mocha', desc: 'Espresso, sıcak çikolata ve krema.', price: 95, temp: 'hot', image: 'https://images.pexels.com/photos/6062420/pexels-photo-6062420.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'White mocha', desc: 'Beyaz çikolata ve espresso.', price: 100, temp: 'hot', image: 'https://images.pexels.com/photos/5869582/pexels-photo-5869582.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Caramel latte', desc: 'Karamel sos ve yumuşak süt.', price: 95, temp: 'hot', image: 'https://images.pexels.com/photos/887723/pexels-photo-887723.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Vanilya latte', desc: 'Madagaskar vanilya şurubu.', price: 95, temp: 'hot', image: 'https://images.pexels.com/photos/3026806/pexels-photo-3026806.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Fındık latte', desc: 'Kavrulmuş fındık aroması.', price: 95, temp: 'hot', image: 'https://images.pexels.com/photos/1692874/pexels-photo-1692874.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Badem latte', desc: 'Şeker ilavesiz badem sütü seçeneği (+15 ₺).', price: 90, temp: 'hot', image: 'https://images.pexels.com/photos/3026802/pexels-photo-3026802.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Honey latte', desc: 'Çiçek balı ve tarçın tozu.', price: 95, temp: 'hot', image: 'https://images.pexels.com/photos/2611813/pexels-photo-2611813.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ]
    },
    {
      id: 'soguk_dem',
      title: 'Soğuk demleme & buzlu sade',
      subtitle: 'Yavaş demleme, buzla ferahlık',
      items: [
        { name: 'Cold brew', desc: '14 saat soğuk demleme; düşük asidite.', price: 90, temp: 'cold', image: 'https://images.pexels.com/photos/982150/pexels-photo-982150.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Nitro cold brew', desc: 'Azotlu, kremsi doku; buz gibi.', price: 110, temp: 'cold', image: 'https://images.pexels.com/photos/2305889/pexels-photo-2305889.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu americano', desc: 'Çift shot espresso, buz ve su.', price: 75, temp: 'cold', image: 'https://images.pexels.com/photos/5946836/pexels-photo-5946836.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu filtre', desc: 'Soğutulmuş günün filtresi.', price: 75, temp: 'cold', image: 'https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Espresso tonic', desc: 'Espresso, tonik ve limon kabuğu — yaz klasiği.', price: 95, temp: 'cold', image: 'https://images.pexels.com/photos/2673234/pexels-photo-2673234.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu red eye', desc: 'Soğuk filtre + espresso.', price: 95, temp: 'cold', image: 'https://images.pexels.com/photos/4922886/pexels-photo-4922886.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Japanese iced coffee', desc: 'Doğrudan buz üzerine demleme; parlak tat.', price: 85, temp: 'cold', image: 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ]
    },
    {
      id: 'soguk_sutlu',
      title: 'Buzlu sütlü & kremsi',
      subtitle: 'Dondurma ve süt ile serinletici',
      items: [
        { name: 'Buzlu latte', desc: 'Espresso, soğuk süt, buz.', price: 85, temp: 'cold', image: 'https://images.pexels.com/photos/982150/pexels-photo-982150.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu mocha', desc: 'Çikolata, espresso, buz ve krema.', price: 100, temp: 'cold', image: 'https://images.pexels.com/photos/5869582/pexels-photo-5869582.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu beyaz mocha', desc: 'Beyaz çikolata ve soğuk süt.', price: 105, temp: 'cold', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu karamel macchiato', desc: 'Katmanlı vanilya sütü ve espresso.', price: 105, temp: 'cold', image: 'https://images.pexels.com/photos/887723/pexels-photo-887723.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Coffee frappe', desc: 'Buz, espresso ve süt karışımı; krema.', price: 110, temp: 'cold', image: 'https://images.pexels.com/photos/1491934/pexels-photo-1491934.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Çikolatalı frappe', desc: 'Espresso ve bitter çikolata.', price: 115, temp: 'cold', image: 'https://images.pexels.com/photos/2611813/pexels-photo-2611813.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu vanilya latte', desc: 'Serin vanilya ve tam yağlı süt.', price: 95, temp: 'cold', image: 'https://images.pexels.com/photos/5946758/pexels-photo-5946758.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu flat white', desc: 'Soğuk mikroköpük ile dengeli shot.', price: 95, temp: 'cold', image: 'https://images.pexels.com/photos/5824246/pexels-photo-5824246.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Affogato', desc: 'Espresso, vanilyalı dondurma — yaz tatlısı.', price: 95, temp: 'cold', image: 'https://images.pexels.com/photos/1352279/pexels-photo-1352279.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ]
    },
    {
      id: 'yaz_ozel',
      title: 'Yaz özel & alternatif',
      subtitle: 'Limonata esintisi ve bitki notaları',
      items: [
        { name: 'Limonlu cold brew', desc: 'Cold brew, ev yapımı limonata şurubu.', price: 105, temp: 'cold', image: 'https://images.pexels.com/photos/2673234/pexels-photo-2673234.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Hindistan cevizi latte (soğuk)', desc: 'Espresso ve buzlu hindistan cevizi sütü.', price: 110, temp: 'cold', image: 'https://images.pexels.com/photos/5946820/pexels-photo-5946820.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu matcha latte', desc: 'Ceremonial matcha ve süt (kafeinsiz seçenek).', price: 115, temp: 'cold', image: 'https://images.pexels.com/photos/5946708/pexels-photo-5946708.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Portakallı tonic kahve', desc: 'Espresso, portakal ve tonik.', price: 100, temp: 'cold', image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Buzlu chai latte', desc: 'Baharatlı chai konsantre ve süt.', price: 95, temp: 'cold', image: 'https://images.pexels.com/photos/1417944/pexels-photo-1417944.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Kokos & ananas smoothie kahve', desc: 'Hafif meyve, espresso shot.', price: 120, temp: 'cold', image: 'https://images.pexels.com/photos/2611813/pexels-photo-2611813.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Yaz köpüğü', desc: 'Soğuk köpüklü latte, hindistan cevizi kreması.', price: 115, temp: 'cold', image: 'https://images.pexels.com/photos/2305889/pexels-photo-2305889.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Çilekli buzlu latte', desc: 'Çilek püresi ve hafif espresso.', price: 110, temp: 'cold', image: 'https://images.pexels.com/photos/5946722/pexels-photo-5946722.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ]
    }
  ]
};
