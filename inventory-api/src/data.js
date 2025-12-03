// Mock Product Database
const products = [
  {
    id: 'prod-001',
    sku: 'HP-PB450-001',
    name: 'Laptop HP ProBook 450',
    description: 'Laptop corporativa 15.6" Intel i5, 8GB RAM, 256GB SSD',
    price: 899990,
    category: 'Computadores',
    brand: 'HP',
    availabilityType: 'STOCK',
    stockQuantity: 15,
    estimatedDays: null,
    images: ['https://picsum.photos/400/300?random=1'],
    specifications: {
      processor: 'Intel Core i5-1135G7',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      screen: '15.6" FHD'
    },
    weight: 1.8,
    dimensions: { length: 36, width: 24, height: 2 },
    active: true,
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-11-20T15:45:00Z')
  },
  {
    id: 'prod-002',
    sku: 'DELL-XPS13-002',
    name: 'Dell XPS 13',
    description: 'Ultrabook premium 13.3" Intel i7, 16GB RAM, 512GB SSD',
    price: 1299990,
    category: 'Computadores',
    brand: 'Dell',
    availabilityType: 'MANUFACTURING',
    stockQuantity: 0,
    estimatedDays: 7,
    images: ['https://picsum.photos/400/300?random=2'],
    specifications: {
      processor: 'Intel Core i7-1165G7',
      ram: '16GB LPDDR4',
      storage: '512GB SSD',
      screen: '13.3" 4K'
    },
    weight: 1.2,
    dimensions: { length: 30, width: 20, height: 1.5 },
    active: true,
    createdAt: new Date('2024-02-10T10:30:00Z'),
    updatedAt: new Date('2024-11-22T10:00:00Z')
  },
  {
    id: 'prod-003',
    sku: 'LG-MX3-001',
    name: 'Mouse Logitech MX Master 3',
    description: 'Mouse inalámbrico ergonómico para profesionales',
    price: 89990,
    category: 'Accesorios',
    brand: 'Logitech',
    availabilityType: 'STOCK',
    stockQuantity: 45,
    estimatedDays: null,
    images: ['https://picsum.photos/400/300?random=3'],
    specifications: {
      connectivity: 'Bluetooth + USB',
      battery: '70 días',
      dpi: '4000'
    },
    weight: 0.14,
    dimensions: { length: 12, width: 8, height: 5 },
    active: true,
    createdAt: new Date('2024-01-20T10:30:00Z'),
    updatedAt: new Date('2024-11-23T08:15:00Z')
  },
  {
    id: 'prod-004',
    sku: 'APPLE-MBA-M2',
    name: 'MacBook Air M2',
    description: 'Laptop Apple con chip M2, 8GB RAM, 256GB SSD',
    price: 1499990,
    category: 'Computadores',
    brand: 'Apple',
    availabilityType: 'MADE_TO_ORDER',
    stockQuantity: 0,
    estimatedDays: 14,
    images: ['https://picsum.photos/400/300?random=4'],
    specifications: {
      processor: 'Apple M2',
      ram: '8GB',
      storage: '256GB SSD',
      screen: '13.6" Liquid Retina'
    },
    weight: 1.24,
    dimensions: { length: 30, width: 21, height: 1.1 },
    active: true,
    createdAt: new Date('2024-03-01T10:30:00Z'),
    updatedAt: new Date('2024-11-21T14:20:00Z')
  },
  {
    id: 'prod-005',
    sku: 'KB-MX-KEYS',
    name: 'Teclado Logitech MX Keys',
    description: 'Teclado inalámbrico retroiluminado',
    price: 129990,
    category: 'Accesorios',
    brand: 'Logitech',
    availabilityType: 'STOCK',
    stockQuantity: 28,
    estimatedDays: null,
    images: ['https://picsum.photos/400/300?random=5'],
    specifications: {
      connectivity: 'Bluetooth + USB',
      battery: '10 días con retroiluminación',
      layout: 'Español'
    },
    weight: 0.81,
    dimensions: { length: 43, width: 13, height: 2 },
    active: true,
    createdAt: new Date('2024-01-25T10:30:00Z'),
    updatedAt: new Date('2024-11-23T09:00:00Z')
  },
  {
    id: 'prod-006',
    sku: 'MON-DELL-27',
    name: 'Monitor Dell 27" 4K',
    description: 'Monitor profesional 27" UHD 4K, IPS',
    price: 449990,
    category: 'Monitores',
    brand: 'Dell',
    availabilityType: 'STOCK',
    stockQuantity: 8,
    estimatedDays: null,
    images: ['https://picsum.photos/400/300?random=6'],
    specifications: {
      resolution: '3840x2160',
      panel: 'IPS',
      refreshRate: '60Hz',
      ports: 'HDMI, DisplayPort, USB-C'
    },
    weight: 5.2,
    dimensions: { length: 61, width: 52, height: 18 },
    active: true,
    createdAt: new Date('2024-02-05T10:30:00Z'),
    updatedAt: new Date('2024-11-22T16:30:00Z')
  },
  {
    id: 'prod-007',
    sku: 'HP-LASER-PRO',
    name: 'Impresora HP LaserJet Pro',
    description: 'Impresora láser monocromática profesional',
    price: 249990,
    category: 'Impresoras',
    brand: 'HP',
    availabilityType: 'MANUFACTURING',
    stockQuantity: 0,
    estimatedDays: 5,
    images: ['https://picsum.photos/400/300?random=7'],
    specifications: {
      type: 'Láser Monocromática',
      speed: '40 ppm',
      connectivity: 'WiFi, Ethernet, USB'
    },
    weight: 8.5,
    dimensions: { length: 38, width: 36, height: 25 },
    active: true,
    createdAt: new Date('2024-02-15T10:30:00Z'),
    updatedAt: new Date('2024-11-23T11:45:00Z')
  },
  {
    id: 'prod-008',
    sku: 'WEB-LOGI-C920',
    name: 'Webcam Logitech C920',
    description: 'Cámara web Full HD 1080p con micrófonos estéreo',
    price: 79990,
    category: 'Accesorios',
    brand: 'Logitech',
    availabilityType: 'STOCK',
    stockQuantity: 32,
    estimatedDays: null,
    images: ['https://picsum.photos/400/300?random=8'],
    specifications: {
      resolution: '1080p 30fps',
      microphone: 'Estéreo',
      autofocus: 'Sí'
    },
    weight: 0.16,
    dimensions: { length: 9, width: 4, height: 4 },
    active: true,
    createdAt: new Date('2024-01-30T10:30:00Z'),
    updatedAt: new Date('2024-11-23T13:20:00Z')
  }
];

// Reservations storage (in-memory)
const reservations = new Map();

module.exports = {
  products,
  reservations
};
