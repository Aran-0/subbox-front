// Header.jsx
import Logo from "./Logo";
import Navigations from "./Navigations";
import Profile from "./Profile";
import SearchAppBar from "./Search";
import ChangeLang from "../TopHeader/ChangeLang";
const Header = () => {
  return (
    <header
      dir="ltr"
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-br from-slate-50 via-white to-cyan-50 shadow-xl border-b-2 border-sky-200/50 backdrop-blur-sm"
    >
      <div className="flex justify-between xl:justify-around items-center sm:px-8 px-2 py-2 md:py-3">
        <Logo />
        <Navigations />
        <div className="flex justify-center items-center md:gap-3 gap-1">
          <SearchAppBar />
          <ChangeLang />
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;
