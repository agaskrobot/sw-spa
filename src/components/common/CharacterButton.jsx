import PropTypes from 'prop-types';

export function CharacterButton({ name, active, onClick, onBlur }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleOnBlur = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBlur();
  };

  let activeClass = active ? 'text-yellow-300' : '';
  return (
    <button
      className={`flex ${activeClass} hover:text-yellow-600 focus:outline-none`}
      onClick={handleClick}
      onBlur={handleOnBlur}
    >
      {name}
    </button>
  );
}
CharacterButton.propTypes = {
  name: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onBlur: PropTypes.func
};
