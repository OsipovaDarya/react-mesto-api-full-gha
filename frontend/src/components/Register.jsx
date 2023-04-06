import React, { useState } from "react";
import { Link, } from "react-router-dom";


function Register({ handleRegisterClick }) {


  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });


  function handleEmailChange(e) {
    const email = e.target.value;
    setUserInfo({
      ...userInfo,
      email,
    })
  }

  function handlePasswordChange(e) {
    const password = e.target.value;

    setUserInfo({
      ...userInfo,
      password
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!userInfo.email || !userInfo.password) {
      return false;
    }
    handleRegisterClick(userInfo)

    setUserInfo({
      email: '',
      password: '',
    })

  }

  return (
    <div className="register" onSubmit={handleSubmit}>
      <p className="register__welcome">
        Регистрация
      </p>
      <p className="register__error"></p>
      <form className="register__form">
        <input className="register__input" id="email" name="email" type="email"
          value={userInfo.email} onChange={handleEmailChange} placeholder="Email" />
        <input className="register__input" id="password" name="password" type="password"
          value={userInfo.password || ''} onChange={handlePasswordChange} placeholder="Пароль" />
        <div className="register__button-container">
          <button type="submit" className="register__link">Зарегистрироваться</button>
        </div>
      </form>
      <div className="register__signin">
        <p>Уже зарегистрированы?</p>
        <Link to="/" className="register__login-link">Войти</Link>
      </div>
    </div >
  );


}

export default Register;
