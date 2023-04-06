import React from "react";

import { useState } from "react";




function Login({ handleLogin }) {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState("")

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
      return false
        .then(() => {
          setMessage("");
        })

    }

    handleLogin(userInfo)

    setUserInfo({ email: "", password: "" });

  }



  return (
    <div className="login" onSubmit={handleSubmit}>
      <p className="login__welcome">
        Вход
      </p>
      <p className="login__error">{message}</p>
      <form className="login__form">
        <input
          className="login__input"
          id="username"
          required
          name="username"
          type="text"
          value={userInfo.email}
          onChange={handleEmailChange}
          minLength={2}
          maxLength={30}
          placeholder="Email"
        />
        <input
          className="login__input"
          id="password"
          required
          name="password"
          type="password"
          value={userInfo.password}
          onChange={handlePasswordChange}
          placeholder="Пароль"
        />
        <div className="login__button-container">
          <button type="submit" className="login__link">
            Войти
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;


