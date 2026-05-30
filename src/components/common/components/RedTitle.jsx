/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

const RedTitle = ({ title, color = "sky-600" }) => {
  return (
    <div className="mb-8 flex flex-row gap-4 items-center md:text-lg font-semibold">
      <span className="bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 h-10 w-5 rounded-lg shadow-md"></span>
      <span className={"text-" + color}>{title}</span>
    </div>
  );
};

RedTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
export default RedTitle;
