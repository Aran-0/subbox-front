import i18n from "../common/components/LangConfig";
import { Link } from "react-router-dom";

const Row1 = () => {
  return (
    <div className="flex flex-row ">
      {/* Left Sidebar */}
      <div className=" text-gray-700 w-64 flex-shrink-0 hidden xl:block">
        <nav className="py-6">
          <ul>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.0") }}>
                {i18n.t("homeSections.row1.col1.0")}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.1") }}>
                {i18n.t("homeSections.row1.col1.1")}{" "}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.2") }}>
                {i18n.t("homeSections.row1.col1.2")}{" "}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.3") }}>
                {i18n.t("homeSections.row1.col1.3")}{" "}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.4") }}>
                {i18n.t("homeSections.row1.col1.4")}{" "}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.5") }}>
                {i18n.t("homeSections.row1.col1.5")}{" "}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.6") }}>
                {i18n.t("homeSections.row1.col1.6")}{" "}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.7") }}>
                {i18n.t("homeSections.row1.col1.7")}{" "}
              </Link>
            </li>
            <li className="px-4 py-2 cursor-pointer hover:underline hover:underline-offset-8   ease-in-out  duration-300 transform hover:translate-x-4">
              <Link to="/category" state={{ category: i18n.t("homeSections.row1.col1.8") }}>
                {i18n.t("homeSections.row1.col1.8")}{" "}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

    </div>
  );
};

export default Row1;
