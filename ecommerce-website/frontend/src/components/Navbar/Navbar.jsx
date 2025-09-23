import React from 'react';
import {Link} from 'react-router-dom';
import './Navbar.css';

const Navbar = ({cartItems}) => {
  return (
    <header>
      <nav>
        <div>
          <Link to="/">
            <i className="fa-solid fa-shirt"></i>
            <h2>Busy Bees</h2>
          </Link>
        </div>

         <div className='nav-child'>
          <Link to="/Cart">
          {cartItems.length >0 && <p className='item-count'>{cartItems.length}</p>}
            <i className="fa-solid fa-cart-shopping"></i>
          </Link>
        </div>
      </nav>
    </header>
    
  );
};

export default Navbar;
