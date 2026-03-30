/** Ateşten Lezzetler — menü (görseller: Pexels CDN, stabil erişim) */
window.MENU_DATA = {
  restaurant: {
    name: 'Ateşten Lezzetler',
    tagline: 'Mangal ve ocakta pişen, günlük taze lezzetler.',
    phone: '+90 (212) 555 01 23',
    address: 'Moda Cad. No: 42, Kadıköy / İstanbul',
    hours: 'Her gün 12:00 — 24:00',
    social: '@atestenlezzetler'
  },
  categories: [
    {
      id: 'mezeler',
      title: 'Soğuk & sıcak mezeler',
      subtitle: 'Paylaşımlık başlangıçlar',
      items: [
        {
          id: 'mezeler-atom',
          name: 'Atom',
          desc: 'Yoğurt, köz biber ve sarımsakla harmanlanmış klasik lezzet.',
          price: 145,
          image: 'https://images.pexels.com/photos/5945563/pexels-photo-5945563.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Süt ve süt ürünleri']
        },
        {
          id: 'mezeler-humus',
          name: 'Humus',
          desc: 'Tahin ve nohut püresi, zeytinyağı ve sumak ile.',
          price: 130,
          image: 'https://images.pexels.com/photos/4207654/pexels-photo-4207654.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Susam (tahin)', 'Baklagiller (nohut)']
        },
        {
          id: 'mezeler-patlican',
          name: 'Patlıcan közlemesi',
          desc: 'Sarımsaklı yoğurt ve domates sosu eşliğinde.',
          price: 155,
          image: 'https://images.pexels.com/photos/5945562/pexels-photo-5945562.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Süt ve süt ürünleri']
        },
        {
          id: 'mezeler-cigkofte',
          name: 'Çiğ köfte tabağı',
          desc: 'Marul, limon ve nar ekşisi; acı seviyesi isteğe göre.',
          price: 165,
          image: 'https://images.pexels.com/photos/6549930/pexels-photo-6549930.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Glüten içeren tahıllar (bulgur)', 'Susam (kullanılan markaya göre değişebilir)']
        }
      ]
    },
    {
      id: 'izgara',
      title: 'Ateşten ızgaralar',
      subtitle: 'Özel marine ve odun kömürü',
      items: [
        {
          id: 'izgara-kuzu-sis',
          name: 'Kuzu şiş',
          desc: 'Günlük kuzu eti, közlenmiş domates ve biber.',
          price: 420,
          badge: 'Çok satan',
          image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Hardal (marine sosunda olabilir)', 'Yanında servis edilen pilav veya ekmek glüten içerebilir']
        },
        {
          id: 'izgara-tavuk-kanat',
          name: 'Tavuk kanat',
          desc: 'Baharatlı marine, çıtır deri.',
          price: 320,
          image: 'https://images.pexels.com/photos/6066056/pexels-photo-6066056.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Glüten (unlu kaplama veya marine çeşidine göre)', 'Hardal (marine)']
        },
        {
          id: 'izgara-adana',
          name: 'Adana kebap',
          desc: 'Acılı kıyma, lavaş ve sumaklı soğan.',
          price: 395,
          image: 'https://images.pexels.com/photos/5638245/pexels-photo-5638245.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Glüten içeren tahıllar (lavaş)', 'İsteğe bağlı yoğurt ile serviste süt ürünleri']
        },
        {
          id: 'izgara-karisik',
          name: 'Karışık ızgara',
          desc: 'Kuzu, tavuk ve köfte; pilav ve salata ile.',
          price: 650,
          image: 'https://images.pexels.com/photos/3611843/pexels-photo-3611843.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Glüten içeren tahıllar', 'Yumurta (köfte tarifinde)', 'Süt ve süt ürünleri (garnitürde)', 'Hardal (marine)']
        }
      ]
    },
    {
      id: 'ana',
      title: 'Ana yemekler',
      subtitle: 'Yanında pilav veya patates',
      items: [
        {
          id: 'ana-testi',
          name: 'Testi kebabı',
          desc: 'Kuzu güveç, kırılarak servis; misafirlerimize gösteri.',
          price: 480,
          image: 'https://images.pexels.com/photos/6542288/pexels-photo-6542288.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Glüten (yanında ekmek)', 'Süt ve süt ürünleri (tereyağı veya yoğurt ile serviste)']
        },
        {
          id: 'ana-iskender',
          name: 'İskender',
          desc: 'Döner, tereyağlı domates sosu ve yoğurt.',
          price: 385,
          image: 'https://images.pexels.com/photos/6205761/pexels-photo-6205761.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Süt ve süt ürünleri (yoğurt, tereyağı)', 'Glüten içeren tahıllar (pide)', 'Yumurta (bazı sos tariflerinde)']
        },
        {
          id: 'ana-kuzu-tandir',
          name: 'Kuzu tandır',
          desc: 'Yavaş pişmiş incik, fırın patates ve mevsim salata.',
          price: 520,
          image: 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Glüten (yanında ekmek)', 'Süt ve süt ürünleri (tereyağı kullanımına göre)']
        }
      ]
    },
    {
      id: 'tatli',
      title: 'Tatlılar',
      subtitle: 'Günün taze fırını',
      items: [
        {
          id: 'tatli-kunefe',
          name: 'Künefe',
          desc: 'Hatay peyniri, hafif şerbet; kaymak ile.',
          price: 220,
          image: 'https://images.pexels.com/photos/1510692/pexels-photo-1510692.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Süt ve süt ürünleri', 'Glüten içeren tahıllar (kadayıf)', 'Kuruyemiş (üzerinde fıstık kullanımı)']
        },
        {
          id: 'tatli-sutlac',
          name: 'Sütlaç',
          desc: 'Fırınlanmış, tarçınlı klasik.',
          price: 95,
          image: 'https://images.pexels.com/photos/1346151/pexels-photo-1346151.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Süt ve süt ürünleri', 'Yumurta (bazı tariflerde)']
        },
        {
          id: 'tatli-baklava',
          name: 'Baklava',
          desc: 'Günlük açılmış, cevizli tepsi.',
          price: 185,
          image: 'https://images.pexels.com/photos/3992137/pexels-photo-3992137.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Glüten içeren tahıllar', 'Süt ve süt ürünleri (şerbet/tereyağı)', 'Kuruyemiş (ceviz)', 'Yumurta (hamur)']
        }
      ]
    },
    {
      id: 'icecek',
      title: 'İçecekler',
      subtitle: 'Serinleten ve sıcak içecekler',
      items: [
        {
          id: 'icecek-ayran',
          name: 'Ayran',
          desc: 'Ev yapımı, buzlu.',
          price: 45,
          image: 'https://images.pexels.com/photos/5946758/pexels-photo-5946758.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Süt ve süt ürünleri']
        },
        {
          id: 'icecek-portakal',
          name: 'Taze sıkılmış portakal',
          desc: 'Mevsim portakalı.',
          price: 95,
          image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: []
        },
        {
          id: 'icecek-kahve',
          name: 'Türk kahvesi',
          desc: 'Geleneksel cezve; yanında lokum.',
          price: 75,
          image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: ['Kuruyemiş (lokumda fıstık/badem olabilir)', 'Glüten (bazı lokum çeşitlerinde)']
        },
        {
          id: 'icecek-cay',
          name: 'Çay',
          desc: 'İnce belli bardakta.',
          price: 25,
          image: 'https://images.pexels.com/photos/1417944/pexels-photo-1417944.jpeg?auto=compress&cs=tinysrgb&w=800',
          allergens: []
        }
      ]
    }
  ]
};
