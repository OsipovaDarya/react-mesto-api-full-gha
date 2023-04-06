import complited from "../images/complited.svg"
import error from '../images/error.svg'


function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen ? `popup_opened` : ""} popup__tooltip`}  >
      <div className="popup__body ">
        <button className="popup__close" type="button" onClick={props.onClose} />
        <form name={`popup__tooltip`} className="popup__container popup__tooltip popup__form">
          <div className="popup__registr">
            <img className="popup__image" src={props.registrForm.status ? complited : error} alt="регистрация" />
            <div className="popup__text">{props.registrForm.text}</div>
          </div>
        </form>
      </div>
    </div>

  )
}
export default InfoTooltip
