/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

const RedButton = ({ name, disabled = false }) => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`motion-safe:hover:animate-pulse text-sm md:text-base md:px-12 py-3 rounded px-6 font-semibold
    ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white hover:shadow-xl transition-all duration-200 transform hover:translate-y-[-4px] hover:scale-105"
    }
    `}
    >
      {name}
    </button>
  );
};

RedButton.propTypes = {
  name: PropTypes.string.isRequired,
};
export default RedButton;
