import { Product } from '../types';

const API_URL = 'http://localhost:3000/api';

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Ripit 5000',
        sku: 'RPT-5000',
        price: 150000,
        stockQuantity: 10,
        availabilityType: 'STOCK',
        description: 'High performance industrial saw'
    },
    {
        id: '2',
        name: 'Diamond Blade',
        sku: 'DMD-BLD',
        price: 80000,
        stockQuantity: 50,
        availabilityType: 'STOCK',
        description: 'Premium diamond blade for cutting concrete'
    },
    {
        id: '3',
        name: 'Safety Kit',
        sku: 'SFT-KIT',
        price: 45000,
        stockQuantity: 100,
        availabilityType: 'STOCK',
        description: 'Complete safety gear set'
    },
    {
        id: '4',
        name: 'Custom Motor',
        sku: 'CST-MTR',
        price: 500000,
        stockQuantity: 0,
        availabilityType: 'MADE_TO_ORDER',
        estimatedDays: 15,
        description: 'Custom built motor for specialized machinery'
    }
];

export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/sales/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const json = await response.json();
    return json.data || [];
};

export const searchProducts = async (query: string): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/sales/products?search=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search products');
    const json = await response.json();
    return json.data || [];
};

export const createSale = async (saleData: any) => {
    console.log('Creating sale:', saleData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: 'mock-sale-id', ...saleData, status: 'PENDING' };
};

export const fetchSales = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { id: '101', total: 230000, status: 'COMPLETED', createdAt: new Date().toISOString() },
        { id: '102', total: 45000, status: 'PENDING', createdAt: new Date().toISOString() },
    ];
};
