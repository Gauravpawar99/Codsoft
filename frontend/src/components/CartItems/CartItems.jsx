import React from 'react';
import './CartItems.css';

const CartItems = ({ cart, removeFromCart, handleQuantityChange }) => {
  return (
    <div className="cart-items">
      {cart.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        cart.map((item, index) => (
          <div className="product-in-cart" key={index}>
            <div className="product-in-cart-left">
              <img src={item.imageUrl} alt={item.alt} />
              <div className="product-info">
                <p><strong>{item.name}</strong></p>
                <p>SKU: {item.sku}</p>
              </div>
            </div>
            <div className="product-in-cart-right">
              <div>
                <p>Each</p>
                <div className="price">₹{item.price.toFixed(2)}</div>
              </div>

              <div className="quantity">
                <label htmlFor={`quantity-${item._id}`}>Qty</label>
                <select
                  id={`quantity-${item._id}`}
                  value={item.qty}
                  onChange={(e) =>
                    handleQuantityChange(item._id, parseInt(e.target.value))
                  }
                  className="quantity-select"
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <i
                className="fa-solid fa-x"
                onClick={() => removeFromCart(item._id)}
                title="Remove item"
              ></i>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartItems;
