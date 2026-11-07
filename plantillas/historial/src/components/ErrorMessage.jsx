// components/ErrorMessage.jsx — recibe el texto por la prop "message"
// (si el esqueleto lo trae vacío: es poner {message} adentro del div)
function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}

export default ErrorMessage;
