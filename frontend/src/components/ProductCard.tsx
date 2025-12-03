import React from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

interface Props {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
    return (
        <div className="product-card card">
            <div className="product-image-placeholder">
                <span className="emoji-icon">🛍️</span>
            </div>
            <div className="product-info">
                <div className="flex-row justify-between">
                    <h3 className="product-title">{product.name}</h3>
                    <span className="stock-badge">{product.stock} en stock</span>
                </div>
                <p className="product-price">${product.price.toLocaleString()}</p>

                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className="add-btn"
                >
                    {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
            </div>

            <style>{`
                .product-card {
                    padding: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .product-image-placeholder {
                    height: 150px;
                    background: linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .emoji-icon { font-size: 3rem; opacity: 0.5; }
                .product-info {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .product-title {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }
                .product-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0.5rem 0 1.5rem;
                }
                .stock-badge {
                    font-size: 0.75rem;
                    padding: 0.2rem 0.5rem;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    color: var(--text-muted);
                }
                .add-btn {
                    width: 100%;
                    margin-top: auto;
                }
            `}</style>
        </div>
    );
};
