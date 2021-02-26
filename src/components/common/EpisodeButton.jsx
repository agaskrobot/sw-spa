import PropTypes from 'prop-types';

export function EpisodeButton({ id, active, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  let activeClass = active ? 'text-yellow-300' : '';
  return (
    <button
      className={`${activeClass} text-xxl px-4 mr-5 font-semibold flex focus:outline-none hover:text-yellow-600`}
      onClick={handleClick}
    >
      Episode {id}
    </button>
  );
}
EpisodeButton.propTypes = {
  id: PropTypes.number,
  active: PropTypes.bool,
  onClick: PropTypes.func
};
