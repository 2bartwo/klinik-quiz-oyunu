/** Ateşten Lezzetler — menü verisi (fiyat ve metinleri buradan güncelleyin) */
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
          name: 'Atom',
          desc: 'Yoğurt, köz biber ve sarımsakla harmanlanmış klasik lezzet.',
          price: 145,
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80'
        },
        {
          name: 'Humus',
          desc: 'Tahin ve nohut püresi, zeytinyağı ve sumak ile.',
          price: 130,
          image: 'https://images.unsplash.com/photo-1577803650713-4e430ef866cd?w=800&q=80'
        },
        {
          name: 'Patlıcan közlemesi',
          desc: 'Sarımsaklı yoğurt ve domates sosu eşliğinde.',
          price: 155,
          image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80'
        },
        {
          name: 'Çiğ köfte tabağı',
          desc: 'Marul, limon ve nar ekşisi; acı seviyesi isteğe göre.',
          price: 165,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80'
        }
      ]
    },
    {
      id: 'izgara',
      title: 'Ateşten ızgaralar',
      subtitle: 'Özel marine ve odun kömürü',
      items: [
        {
          name: 'Kuzu şiş',
          desc: 'Günlük kuzu eti, közlenmiş domates ve biber.',
          price: 420,
          badge: 'Çok satan',
          image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'
        },
        {
          name: 'Tavuk kanat',
          desc: 'Baharatlı marine, çıtır deri.',
          price: 320,
          image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80'
        },
        {
          name: 'Adana kebap',
          desc: 'Acılı kıyma, lavaş ve sumaklı soğan.',
          price: 395,
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80'
        },
        {
          name: 'Karışık ızgara',
          desc: 'Kuzu, tavuk ve köfte; pilav ve salata ile.',
          price: 650,
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'
        }
      ]
    },
    {
      id: 'ana',
      title: 'Ana yemekler',
      subtitle: 'Yanında pilav veya patates',
      items: [
        {
          name: 'Testi kebabı',
          desc: 'Kuzu güveç, kırılarak servis; misafirlerimize gösteri.',
          price: 480,
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80'
        },
        {
          name: 'İskender',
          desc: 'Döner, tereyağlı domates sosu ve yoğurt.',
          price: 385,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80'
        },
        {
          name: 'Kuzu tandır',
          desc: 'Yavaş pişmiş incik, fırın patates ve mevsim salata.',
          price: 520,
          image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80'
        }
      ]
    },
    {
      id: 'tatli',
      title: 'Tatlılar',
      subtitle: 'Günün taze fırını',
      items: [
        {
          name: 'Künefe',
          desc: 'Hatay peyniri, hafif şerbet; kaymak ile.',
          price: 220,
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'
        },
        {
          name: 'Sütlaç',
          desc: 'Fırınlanmış, tarçınlı klasik.',
          price: 95,
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80'
        },
        {
          name: 'Baklava',
          desc: 'Günlük açılmış, cevizli tepsi.',
          price: 185,
          image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80'
        }
      ]
    },
    {
      id: 'icecek',
      title: 'İçecekler',
      subtitle: 'Serinleten ve sıcak içecekler',
      items: [
        {
          name: 'Ayran',
          desc: 'Ev yapımı, buzlu.',
          price: 45,
          image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80'
        },
        {
          name: 'Taze sıkılmış portakal',
          desc: 'Mevsim portakalı.',
          price: 95,
          image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80'
        },
        {
          name: 'Türk kahvesi',
          desc: 'Geleneksel cezve; yanında lokum.',
          price: 75,
          image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80'
        },
        {
          name: 'Çay',
          desc: 'İnce belli bardakta.',
          price: 25,
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80'
        }
      ]
    }
  ]
};
