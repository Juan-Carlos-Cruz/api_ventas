import React from 'react';

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

interface Props {
    items: CartItem[];
    onRemove: (productId: string) => void;
    onCheckout: () => void;
}

export const Cart: React.FC<Props> = ({ items, onRemove, onCheckout }) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="cart-container card">
            <h2 className="mb-4">Resumen de Compra</h2>

            <div className="cart-items">
                {items.length === 0 ? (
                    <div className="empty-cart">
                        <span className="icon">🛒</span>
                        <p>El carrito está vacío</p>
                    </div>
                ) : (
                    <ul className="items-list">
                        {items.map((item) => (
                            <li key={item.productId} className="cart-item">
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price text-muted">
                                        ${item.price.toLocaleString()} x {item.quantity}
                                    </span>
                                </div>
                                <div className="item-actions">
                                    <span className="item-total">
                                        ${(item.price * item.quantity).toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => onRemove(item.productId)}
                                        className="remove-btn"
                                        aria-label="Eliminar"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="cart-footer">
                <div className="total-row">
                    <span>Total a Pagar</span>
                    <span className="total-amount">${total.toLocaleString()}</span>
                </div>
                <button
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className="checkout-btn"
                >
                    Confirmar Venta
                </button>
            </div>

            <style>{`
                .cart-container {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 140px);
                    position: sticky;
                    top: 20px;
                }
                .cart-items {
                    flex: 1;
                    overflow-y: auto;
                    margin: 0 -1.5rem;
                    padding: 0 1.5rem;
                }
                .empty-cart {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: var(--text-muted);
                }
                .empty-cart .icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
                
                .items-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .cart-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px solid var(--border);
                }
                .item-details {
                    display: flex;
                    flex-direction: column;
                }
                .item-name { font-weight: 500; }
                .item-price { font-size: 0.85rem; }
                
                .item-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .item-total { font-weight: 600; }
                .remove-btn {
                    background: transparent;
                    color: #ef4444;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    box-shadow: none;
                }
                .remove-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    transform: none;
                }

                .cart-footer {
                    margin-top: auto;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--border);
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    font-size: 1.2rem;
                    font-weight: 600;
                }
                .total-amount { color: var(--primary); font-size: 1.5rem; }
                .checkout-btn {
                    width: 100%;
                    padding: 1rem;
                    font-size: 1.1rem;
                }
            `}</style>
        </div>
    );
};
