export interface Product {
    id: string;
    name: string;
    description?: string;
    sku: string;
    price: number;
    stockQuantity: number;
    availabilityType: 'STOCK' | 'MANUFACTURING' | 'MADE_TO_ORDER';
    estimatedDays?: number;
}

export interface AvailabilityType {
    quantity?: number;
    estimatedDays?: number;
}

export interface CartItem {
    productId: string;
    productName: string;
    productSku: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    availabilityType: 'STOCK' | 'MANUFACTURING' | 'MADE_TO_ORDER';
    availability?: AvailabilityType;
    reservation?: {
        expiresAt: string;
    };
}
