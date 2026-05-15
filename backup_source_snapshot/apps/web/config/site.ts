export const SITE_CONFIG = {
  name: 'SaidonClub',
  companyName: 'SaidonClub S.A.',
  ruc: '1790000000001',
  supportEmail: 'pagos@saidon.club',
  social: {
    whatsapp: '+593900000000',
    instagram: '@saidonclub',
    facebook: 'SaidonClubOfficial',
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
        address: 'TFxyz...1234567890abcdef',
        network: 'TRON (TRC20)',
      },
      btc: {
        name: 'Bitcoin (BTC)',
        address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        network: 'Bitcoin',
      },
      binance_pay: {
        name: 'Binance Pay',
        binance_id: '123456789',
        email: 'pagos@saidon.club',
      },
    },
    bank: {
      pichincha: {
        bankName: 'Banco del Pichincha',
        accountName: 'SaidonClub S.A.',
        accountNumber: '2100000000',
        accountType: 'Corriente',
        ruc: '1790000000001',
        email: 'pagos@saidon.club',
      },
      deuna: {
        name: 'De Una (Pichincha)',
        phone: '0900000000',
        qr_image: '/images/payments/deuna-qr.png', // Placeholder
      }
    },
    online: {
      paypal: {
        name: 'PayPal',
        email: 'pagos@saidon.club',
      }
    }
  }
};

