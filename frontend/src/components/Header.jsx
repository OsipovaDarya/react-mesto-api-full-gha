import logo from '../images/logo.svg'
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

function Header(props) {
  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="логотип место"
      />
      <Routes>
        <Route path='/sign-in' element={
          <Link to={'/sign-up'} className="header__register">Регистрация</Link>
        } />
        <Route path='/sign-up' element={
          <Link to={'/sign-in'} className="header__entrance">Войти</Link>
        } />
        <Route path='/' element={
          <>
            <div className='header__container'>
              <div className='header__email'>{props.emailInfo}</div>
              <div className='header__exit'
                onClick={props.exit}>Выйти</div>
            </div>
          </>
        } />

      </Routes>
    </header>
  )
}

export default Header;
