import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function LoginMenu() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to the login page
  };

  return (
    <>
    <div className="site-mobile-menu">
      <div className="site-mobile-menu-header">
        <div className="site-mobile-menu-close mt-3">
          <span className="icon-close2 js-menu-toggle"></span>
        </div>
      </div>
      <div className="site-mobile-menu-body"></div>
    </div>
    <div className="site-navbar-wrap js-site-navbar" style={{ backgroundColor: 'lightblue' }}>  
      <div className="container">
        <div className="site-navbar">
          <div className="row align-items-center" style={{ backgroundColor: 'lightblue' }}>
            <div className="col-2">
              <h2 className="mb-0 site-logo"><Link itemProp='url' to="/loginhomepage" className="font-weight-bold">CalorEase</Link></h2>
            </div>
            <div className="col-10">
              <nav className="site-navigation text-right" role="navigation">
                <div className="container">
                  <div className="d-inline-block d-lg-none ml-md-0 mr-auto py-3"><a href="#" className="site-menu-toggle js-menu-toggle text-black"><span className="icon-menu h3"></span></a></div>
                  <ul className="site-menu js-clone-nav d-none d-lg-block">
                        <li><Link itemProp='url' to="/loginhomepage">Home</Link></li>
                        <li><Link itemProp='url' to="/user">User</Link></li>
                        <li><Link itemProp='url' to="/workouts">Workouts</Link></li>
                        <li><Link itemProp='url' to="/dietaryinfo">DietaryInfo</Link></li>
                        <li><Link itemProp='url' to="/visualizations">Visualizations</Link></li>
                        <li><button onClick={handleLogout} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#00000099' }}>LOGOUT</button></li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    );
}

export default LoginMenu;
