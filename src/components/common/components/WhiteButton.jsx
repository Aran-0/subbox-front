import PropTypes from 'prop-types';

const WhiteButton = ({ name, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`border border-gray-900 rounded py-3 px-8 text-sm font-medium hover:bg-gray-100 transition ${className}`}
    >
      {name}
    </button>
  );
};

WhiteButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,           // ← Сделали необязательным
  className: PropTypes.string
};

export default WhiteButton;