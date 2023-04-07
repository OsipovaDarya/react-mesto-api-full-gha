class Api {
  constructor({ baseUrl }) {

    this._baseUrl = baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  };

  getInfo() {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(this._checkResponse);
  }

  getInitialCards() {
    const token = localStorage.getItem('jwt');
    return fetch(this._baseUrl + `/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(this._checkResponse);
  }

  editProfile(name, about) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        about
      })
    })
      .then(this._checkResponse);
  }

  addNewCard(name, link) {
    const token = localStorage.getItem('jwt');
    return fetch(this._baseUrl + '/cards', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link,
      })
    })
      .then(this._checkResponse);
  }

  deleteCards(cardId) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
      .then(this._checkResponse);
  }
  addNewlike(cardId) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
      .then(this._checkResponse);
  }

  deletelikes(cardId) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
      .then(this._checkResponse);
  }

  changeAvatar(avatar) {
    const token = localStorage.getItem('jwt');
    return fetch(this._baseUrl + '/users/me/avatar', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatar
      })
    })
      .then(this._checkResponse);
  }

}

const api = new Api({
  baseUrl: 'o.darya.mesto.nomoredomains.monster',
  // headers: {
  //   authorization: 'c9823303-b55f-4738-a9da-237c09a74944',
  //   'Content-Type': 'application/json'
  // }
});

export default api;
// baseUrl: 'http://localhost:3000'
