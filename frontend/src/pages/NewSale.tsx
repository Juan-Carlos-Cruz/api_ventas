import React, { useState } from 'react';
import { ProductSearch } from '../components/sales/ProductSearch';
import { Cart } from '../components/sales/Cart';
import { createSale } from '../services/api';
import type { Product, CartItem } from '../types';

export const NewSale: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const handleAddToCart = (product: Product, quantity: number) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.productId === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.unitPrice }
                        : item
                );
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    productName: product.name,
                    productSku: product.sku,
                    unitPrice: product.price,
                    quantity: quantity,
                    subtotal: product.price * quantity,
                    availabilityType: product.availabilityType,
                    availability: { quantity: product.stockQuantity, estimatedDays: product.estimatedDays },
                },
            ];
        });
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity, subtotal: quantity * item.unitPrice }
                    : item
            )
        );
    };

    const handleRemoveItem = (productId: string) => {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    };

    const handleCheckout = async () => {
        try {
            const saleData = {
                items: cartItems,
                deliveryMethod: 'PICKUP', // Simplified
                customer: { name: 'Guest', email: 'guest@example.com', address: 'N/A' }, // Simplified
            };
            await createSale(saleData);
            alert('¡Venta creada exitosamente!');
            setCartItems([]);
        } catch (error) {
            alert('Error al crear la venta');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Product Search & Grid */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nueva Venta</h1>
                    <p className="text-gray-600">Busca productos y agrégalos al carrito</p>
                </div>

                <ProductSearch onAddToCart={handleAddToCart} />
            </div>

            {/* Right Column: Cart */}
            <div className="lg:col-span-1">
                <div className="sticky top-24">
                    <Cart
                        items={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onProceedToCheckout={handleCheckout}
                    />
                </div>
            </div>
        </div>
    );
};
