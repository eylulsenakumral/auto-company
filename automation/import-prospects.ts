// Supabase Prospects Import Script
// Auto Company Cycle #37 — Day 1 Build
// Imports 48 Bursa automotive suppliers from CSV to Supabase

const prospects = [
  {
    company_name: 'AKMETAL SAC VE İMALAT SANAYİ VE TİCARET A.Ş.',
    tier: 'tier-2',
    contact_name: null,
    contact_email: 'info@akmetalas.com',
    contact_phone: '+90 224 242 02 02',
    status: 'cold',
    notes: 'Templates prepared - awaiting execution',
    phase: 'Phase 1'
  },
  {
    company_name: 'Coşkunöz Metal Form Makina Endüstri ve Ticaret A.Ş.',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '1773 employees - Major supplier',
    phase: 'Phase 1'
  },
  {
    company_name: 'Ototrim Panel Sanayi ve Ticaret A.Ş.',
    tier: 'tier-1',
    contact_name: null,
    contact_email: 'info@ototrim.com',
    contact_phone: '+90 224 243 81 40',
    status: 'cold',
    notes: '501-1000 employees - Phone-first priority',
    phase: 'Phase 1'
  },
  {
    company_name: 'Borçelik Çelik Sanayii Ticaret A.Ş.',
    tier: 'tier-1',
    contact_name: null,
    contact_email: 'infobrc@borcelik.com',
    contact_phone: '+90 224 280 40 00',
    status: 'cold',
    notes: 'Steel service center - Phone-first priority',
    phase: 'Phase 1'
  },
  {
    company_name: 'Martur Automotive Seating Systems',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Seating systems',
    phase: 'Phase 1'
  },
  {
    company_name: 'AKWEL Bursa Turkey Otomotiv A.Ş.',
    tier: 'tier-2',
    contact_name: null,
    contact_email: 'info@akwel-automotive.com',
    contact_phone: '+90 224 280 68 00',
    status: 'cold',
    notes: 'Fluid management - Phase 1 priority',
    phase: 'Phase 1'
  },
  {
    company_name: 'BOURBON BURSA OTOMOTİV PLASTİK A.Ş.',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Plastic parts',
    phase: 'Phase 2'
  },
  {
    company_name: 'A-PLAS Genel Otomotiv Mamülleri San. ve Tic. Ltd. Şti.',
    tier: 'tier-2',
    contact_name: null,
    contact_email: 'info@a-plasltd.com.tr',
    contact_phone: '+90 224 707 00 77',
    status: 'cold',
    notes: '3 locations - 54914 m² - Phase 1 priority',
    phase: 'Phase 1'
  },
  {
    company_name: 'Bosch Rexroth',
    tier: 'tier-1',
    contact_name: null,
    contact_email: 'info@boschrexroth.com.tr',
    contact_phone: '+90 224 275 00 00',
    status: 'cold',
    notes: 'Global supplier - Phone-first priority',
    phase: 'Phase 1'
  },
  {
    company_name: 'Toyotetsu Otomotiv Parçaları San. ve Tic. A.Ş.',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Toyota supplier',
    phase: 'Phase 1'
  },
  {
    company_name: 'SVB Grup Otomotiv',
    tier: 'tier-2',
    contact_name: null,
    contact_email: 'satis@svbotomotiv.com.tr',
    contact_phone: '+90 224 411 04 01',
    status: 'cold',
    notes: 'Phase 1 priority',
    phase: 'Phase 1'
  },
  {
    company_name: 'Toksan Otomotiv',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'KAS Otomotiv',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'Hattat Otomotiv Pazarlama A.Ş.',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'Magna Otomotiv Sanayi ve Ticaret A.Ş.',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Global automotive supplier',
    phase: 'Phase 1'
  },
  {
    company_name: 'Yazaki Otomotiv Yan Sanayi ve Ticaret A.Ş.',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Japanese supplier',
    phase: 'Phase 1'
  },
  {
    company_name: 'Bursa Çelik Servis Merkezi (Borçelik)',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Steel service',
    phase: 'Phase 1'
  },
  {
    company_name: 'Bosch Rexroth',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Hydraulics',
    phase: 'Phase 1'
  },
  {
    company_name: 'AGOSAN Otomotiv Mobilya Tekstil İnşaat',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'Kayapa OSB Yönetimi',
    tier: 'tier-3',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'OSB management referral',
    phase: 'Backup'
  },
  {
    company_name: 'NOSAB Yönetimi',
    tier: 'tier-3',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Extensive automotive list',
    phase: 'Backup'
  },
  {
    company_name: 'DOSAB Yönetimi',
    tier: 'tier-3',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'OSB management referral',
    phase: 'Backup'
  },
  {
    company_name: 'Uludağ OSB Yönetimi',
    tier: 'tier-3',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '500+ companies',
    phase: 'Backup'
  },
  {
    company_name: 'BEM Bosch',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 1'
  },
  {
    company_name: 'FAW Automotive',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Chinese manufacturer',
    phase: 'Phase 1'
  },
  {
    company_name: 'Birlik Çelik',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'Faurecia',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'French supplier',
    phase: 'Phase 1'
  },
  {
    company_name: 'Delphi',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Global supplier',
    phase: 'Phase 1'
  },
  {
    company_name: 'CT Otomotiv Yan San.ve Metal Kaplama A.Ş.',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'CONTITECH',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Continental division',
    phase: 'Phase 2'
  },
  {
    company_name: 'BOY TEKNİK METAL OTOMOTİV',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'BURÇAK METAL OTO YAN SAN',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'AKIRMAK OTO AYNA',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'TAYSAD Member Companies (Multiple)',
    tier: 'tier-3',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '250+ members association',
    phase: 'Backup'
  },
  {
    company_name: 'Oyak Renault',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Car manufacturing',
    phase: 'Phase 1'
  },
  {
    company_name: 'TOFAŞ Tofaş Otomotiv Fabrikası',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Stellantis partnership',
    phase: 'Phase 1'
  },
  {
    company_name: 'Bursel Bursa Çelik',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Steel manufacturing',
    phase: 'Phase 1'
  },
  {
    company_name: 'Tofaş Fiat Automobiles',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'FIAT partnership',
    phase: 'Phase 1'
  },
  {
    company_name: 'Coşkunöz Otomotiv',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '60000 m² closed area',
    phase: 'Phase 1'
  },
  {
    company_name: 'Bentek Automotive',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Search NOSAB directory',
    phase: 'Phase 2'
  },
  {
    company_name: 'Karma Automotive',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'Uludağ Automotive',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'BEM Bosch Turkey',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Bosch division',
    phase: 'Phase 1'
  },
  {
    company_name: 'Magna Turkey',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Canadian supplier',
    phase: 'Phase 1'
  },
  {
    company_name: 'Yutaka Automotive',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Japanese supplier',
    phase: 'Phase 2'
  },
  {
    company_name: 'Yıldız Automotive',
    tier: 'tier-2',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: '',
    phase: 'Phase 2'
  },
  {
    company_name: 'Hattat Holding',
    tier: 'tier-1',
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    status: 'cold',
    notes: 'Conglomerate',
    phase: 'Phase 1'
  }
];

// Export for use in import script
export default prospects;
