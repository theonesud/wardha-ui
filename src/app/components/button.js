import PropTypes from 'prop-types';

const Button = ({ text, onClick, type = 'button', color = 'bg-blue-500', textColor = 'text-white', size = 'md', additionalClasses = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${color} ${textColor} ${sizeClasses[size]} rounded-[8px] font-normal ${additionalClasses} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2`}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  color: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  additionalClasses: PropTypes.string,
};

export default Button;
