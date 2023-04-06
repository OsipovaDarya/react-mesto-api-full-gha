
import { useState } from 'react';
import React from 'react';
import '../index.css';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import { useEffect } from 'react';
import api from '../utils/api'
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';



function App() {
  const [isEditAvatarPopupOpend, setIsEditAvatarOpend] = useState(false);
  const [isEditProfilePopupOpend, setIsEditProfileOpend] = useState(false);
  const [isEditAddPlacePopupOpend, setIsEditAddPlaceOpend] = useState(false);
  const [isEditInfoTooltip, setIsEditInfoTooltip] = useState(false);


  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});

  const [loggedIn, setloggedIn] = useState(false);
  const [emailInfo, setEmailInfo] = useState("")
  const [registrForm, setRegistrForm] = useState({ status: false, text: "" });


  const navigate = useNavigate();

  function handelLoginClick({ password, email }) {
    auth.login(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token)
        setloggedIn(true)
        setEmailInfo(email);
        navigate("/", { replace: true })
      })
      .catch((err) => {
        console.log(err);
      })
  }


  function handelRegistrClick({ email, password }) {
    auth.register(email, password)
      .then((res) => {
        if (res) {
          setRegistrForm({
            status: true,
            text: 'Вы успешно зарегистрировались!',
          })
          navigate('/sign-in', { replace: true })
        }
      })
      .catch(() => {
        setRegistrForm({
          status: false,
          text: 'Что-то пошло не так! Попробуйте ещё раз.',

        })
      })
      .finally(() => setIsEditInfoTooltip(true))
  }


  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.checkToken(jwt)
        .then(({ email }) => {
          setloggedIn(true);

          setEmailInfo(email);

          navigate("/");

        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [navigate]);

  function exit() {
    localStorage.removeItem('jwt');
    navigate('/sign-in');
    setloggedIn(false);
  }



  useEffect(() => {
    Promise.all([api.getInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    if (!isLiked) {
      // Отправляем запрос в API и получаем обновлённые данные карточки
      api.addNewlike(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        })

    } else {
      api.deletelikes(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  function handleCardDelete(card) {
    api.deleteCards(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateUser({ name, about }) {
    api
      .editProfile(name, about)
      .then((user) => {
        setCurrentUser(user);
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar({ avatar }) {
    api.changeAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }

  function handleAddPlaceSubmit(name, link) {
    console.log(name, link)
    api.addNewCard(name, link)

      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }


  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard)
  }

  function handleEditAvatarClick() {
    setIsEditAvatarOpend(true)
  }

  function handleEditProfileClick() {
    setIsEditProfileOpend(true)
  }

  function handleAddPlaceClick() {
    setIsEditAddPlaceOpend(true)
  }
  function closeAllPopups() {
    setIsEditAvatarOpend(false);
    setIsEditProfileOpend(false);
    setIsEditAddPlaceOpend(false);
    setSelectedCard(null);
    setIsEditInfoTooltip(false);
  }



  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header
            emailInfo={emailInfo}
            exit={exit}
          />
          <Routes>
            <Route path='/' element={

              <ProtectedRoute
                component={Main}
                loggedIn={loggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}

                cards={cards}
                onCardClick={handleCardClick}

                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />}>
            </Route>
            <Route path="/sign-up" element={
              <Register handleRegisterClick={handelRegistrClick} />}></Route>
            <Route path="/sign-in" element={
              <Login handleLogin={handelLoginClick} />}></Route>

          </Routes>
          <Footer />
          <InfoTooltip
            onClose={closeAllPopups}
            isOpen={isEditInfoTooltip}
            registrForm={registrForm}
          ></InfoTooltip>
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={setSelectedCard}>
          </ImagePopup>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpend}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          ></EditProfilePopup>

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpend}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}>

          </EditAvatarPopup>
          <AddPlacePopup
            isOpen={isEditAddPlacePopupOpend}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          ></AddPlacePopup>

        </div>
      </div>
    </CurrentUserContext.Provider >
  );
}

export default App;
