/** Ateşten Lezzetler — menü (id: sepet/API için; allergens; görseller ürünle uyumlu) */
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
          image: 'https://images.unsplash.com/photo-1571212515416-edbb7b92b94c?w=800&q=80',
          allergens: ['Süt ve süt ürünleri']
        },
        {
          id: 'mezeler-humus',
          name: 'Humus',
          desc: 'Tahin ve nohut püresi, zeytinyağı ve sumak ile.',
          price: 130,
          image: 'https://images.unsplash.com/photo-1577803650713-4e430ef866cd?w=800&q=80',
          allergens: ['Susam (tahin)', 'Baklagiller (nohut)']
        },
        {
          id: 'mezeler-patlican',
          name: 'Patlıcan közlemesi',
          desc: 'Sarımsaklı yoğurt ve domates sosu eşliğinde.',
          price: 155,
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
          allergens: ['Süt ve süt ürünleri']
        },
        {
          id: 'mezeler-cigkofte',
          name: 'Çiğ köfte tabağı',
          desc: 'Marul, limon ve nar ekşisi; acı seviyesi isteğe göre.',
          price: 165,
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
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
          image: 'https://images.unsplash.com/photo-1558030137-748319fe6c9f?w=800&q=80',
          allergens: ['Hardal (marine sosunda olabilir)', 'Yanında servis edilen pilav veya ekmek glüten içerebilir']
        },
        {
          id: 'izgara-tavuk-kanat',
          name: 'Tavuk kanat',
          desc: 'Baharatlı marine, çıtır deri.',
          price: 320,
          image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80',
          allergens: ['Glüten (unlu kaplama veya marine çeşidine göre)', 'Hardal (marine)']
        },
        {
          id: 'izgara-adana',
          name: 'Adana kebap',
          desc: 'Acılı kıyma, lavaş ve sumaklı soğan.',
          price: 395,
          image: 'https://images.unsplash.com/photo-1626082927789-05c56db31e33?w=800&q=80',
          allergens: ['Glüten içeren tahıllar (lavaş)', 'İsteğe bağlı yoğurt ile serviste süt ürünleri']
        },
        {
          id: 'izgara-karisik',
          name: 'Karışık ızgara',
          desc: 'Kuzu, tavuk ve köfte; pilav ve salata ile.',
          price: 650,
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
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
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
          allergens: ['Glüten (yanında ekmek)', 'Süt ve süt ürünleri (tereyağı veya yoğurt ile serviste)']
        },
        {
          id: 'ana-iskender',
          name: 'İskender',
          desc: 'Döner, tereyağlı domates sosu ve yoğurt.',
          price: 385,
          image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80',
          allergens: ['Süt ve süt ürünleri (yoğurt, tereyağı)', 'Glüten içeren tahıllar (pide)', 'Yumurta (bazı sos tariflerinde)']
        },
        {
          id: 'ana-kuzu-tandir',
          name: 'Kuzu tandır',
          desc: 'Yavaş pişmiş incik, fırın patates ve mevsim salata.',
          price: 520,
          image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80',
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
          image: 'https://images.unsplash.com/photo-1612196318222-6efb3162eda2?w=800&q=80',
          allergens: ['Süt ve süt ürünleri', 'Glüten içeren tahıllar (kadayıf)', 'Kuruyemiş (üzerinde fıstık kullanımı)']
        },
        {
          id: 'tatli-sutlac',
          name: 'Sütlaç',
          desc: 'Fırınlanmış, tarçınlı klasik.',
          price: 95,
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
          allergens: ['Süt ve süt ürünleri', 'Yumurta (bazı tariflerde)']
        },
        {
          id: 'tatli-baklava',
          name: 'Baklava',
          desc: 'Günlük açılmış, cevizli tepsi.',
          price: 185,
          image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80',
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
          image: 'https://images.unsplash.com/photo-1571349937195-d80cf3e29415?w=800&q=80',
          allergens: ['Süt ve süt ürünleri']
        },
        {
          id: 'icecek-portakal',
          name: 'Taze sıkılmış portakal',
          desc: 'Mevsim portakalı.',
          price: 95,
          image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
          allergens: []
        },
        {
          id: 'icecek-kahve',
          name: 'Türk kahvesi',
          desc: 'Geleneksel cezve; yanında lokum.',
          price: 75,
          image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80',
          allergens: ['Kuruyemiş (lokumda fıstık/badem olabilir)', 'Glüten (bazı lokum çeşitlerinde)']
        },
        {
          id: 'icecek-cay',
          name: 'Çay',
          desc: 'İnce belli bardakta.',
          price: 25,
          image: 'https://images.unsplash.com/photo-1564890369479-c1f66badf310?w=800&q=80',
          allergens: []
        }
      ]
    }
  ]
};
