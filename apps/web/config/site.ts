export const SITE_CONFIG = {
  name: 'SaidonClub',
  companyName: 'SaidonClub',
  ruc: '1790000000001', // Update if found
  supportEmail: 'saidonclub@gmail.com',
  social: {
    whatsapp: '+593987958337',
    instagram: '@saidonclub',
    facebook: 'SaidonClubOfficial',
    tiktok: '@saidonclub',
    youtube: 'SaidonClub',
  },
  contact: {
    whatsappLabel: '+593 98 795 8337',
    whatsappUrl: 'https://wa.me/593987958337',
    hours: 'Lunes a Viernes 09:00 - 18:00',
    email: 'saidonclub@gmail.com',
    address: 'Hernán Cortés 563, 170104 Quito entre Alarcón y Luis Robalino',
    googleMaps: 'https://maps.app.goo.gl/ifkFV7PNYTUkcZev7',
  },
  memberships: {
    preferente: {
      id: 'preferente',
      name: 'Socio Preferente',
      price: 29,
      points: 29,
      period: 'anual',
    },
    pionero: {
      id: 'pionero',
      name: 'Socio Pionero',
      price: 97,
      points: 97,
      period: 'anual',
    },
  },
  pointsSystem: {
    conversionRate: '$1 = 1 Punto',
    activities: {
      welcome_preferente: 29,
      welcome_pionero: 97,
      marketplace_cashback_preferente: '1%',
      marketplace_cashback_pionero: '3%',
      referral_preferente: 5,
      referral_pionero: 15,
      event_participation: 5,
      annual_renewal_preferente: 10,
      annual_renewal_pionero: 50,
    }
  },
  payments: {
    crypto: {
      usdt_trc20: {
        name: 'USDT (TRC20)',
        address: 'TGN3nEcBTtuhWUoBDPAJ68Ca12jzJfB7Gy',
        network: 'TRON (TRC20)',
      },
      btc: {
        name: 'Bitcoin (BTC)',
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        network: 'Bitcoin',
      },
      binance_pay: {
        name: 'Binance Pay',
        binance_id: '42245642',
        email: 'tiendamcc@gmail.com',
      },
    },
    bank: {
      pichincha: {
        bankName: 'Banco del Pichincha',
        accountName: 'SaidonClub',
        accountNumber: '2100000000',
        accountType: 'Corriente',
        ruc: '1790000000001',
        email: 'saidonclub@gmail.com',
      },
      deuna: {
        name: 'De Una (Pichincha)',
        phone: '0987958337',
        qr_image: '/images/payments/deuna-qr.png',
      }
    },
    online: {
      paypal: {
        name: 'PayPal',
        email: 'saidonclub@gmail.com',
      }
    }
  }
};

