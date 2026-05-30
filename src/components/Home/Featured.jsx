import RedTitle from "../common/components/RedTitle";
import i18n from "../common/components/LangConfig";
import { Link } from "react-router-dom";
import { ITEMS } from "../common/functions/items";

const Featured = () => {
  const ShopNow = () => (
    <button className="mb-4 md:mb-0 flex gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200 py-2 ease-in-out transform hover:translate-x-2">
      <span>{i18n.t("featured.shopNow")}</span>
      <svg
        className="mt-1"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.5 12H20M20 12L13 5M20 12L13 19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  const playstationItem = ITEMS && ITEMS.length > 0 ? ITEMS[18] || ITEMS[0] : null;
  const womenCollectionsItem = ITEMS && ITEMS.length > 0 ? ITEMS[20] || ITEMS[1] : null;
  const speakersItem = ITEMS && ITEMS.length > 0 ? ITEMS[19] || ITEMS[2] : null;
  const perfumesItem = ITEMS && ITEMS.length > 0 ? ITEMS[16] || ITEMS[3] : null;

  return (
    <div className="flex flex-col my-24 mx-auto">
      <div className="mx-2">
        <RedTitle title={i18n.t("featured.redTitle")} />
        <h2 className="text-2xl md:text-3xl font-semibold mb-14">
          {i18n.t("featured.title")}
        </h2>
      </div>

      {(!playstationItem || !womenCollectionsItem || !speakersItem || !perfumesItem) ? (
        <div className="p-8 text-center text-gray-500">Loading featured items...</div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg md:pt-12 md:px-8 md:h-[600px] md:w-[570px]">
            <div className="text-white relative flex gap-10 md:mt-10 items-center justify-center flex-col-reverse md:flex-row md:w-[511px] md:h-[511px] sm:h-[500px] h-[380px]">
              <div className="absolute inset-0 z-0 bg-no-repeat bg-center bg-cover rounded-lg">
                <Link to={{ pathname: `/allProducts/${playstationItem.title}` }} key={playstationItem.id}>
                  <img
                    loading="lazy"
                    className="w-full h-full transition-transform duration-300 transform hover:-translate-y-4 hover:scale-101 hover:motion-safe:animate-pulse opacity-60 hover:opacity-100 rounded-lg"
                    src={playstationItem.imageSrc}
                    alt={playstationItem.title}
                  />
                </Link>
              </div>
              <div className="flex transform flex-col gap-1 md:gap-4 mt-auto md:mr-auto w-[270px] md:mb-8 items-center md:items-start justify-end z-10">
                <h2 className="text-center md:text-start text-lg md:text-2xl font-semibold font-inter">
                  {i18n.t("featured.playStation.title")}
                </h2>
                <p className="text-center md:text-start text-sm">
                  {i18n.t("featured.playStation.description")}
                </p>
                <Link to={{ pathname: `/allProducts/${playstationItem.title}` }} key={playstationItem.id}>
                  <ShopNow />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg h-[284px] md:w-[570px]">
              <div className="text-white relative flex items-center justify-center flex-col-reverse md:flex-row w-full h-full rounded-lg">
                <div className="overflow-hidden absolute bg-no-repeat bg-center bg-cover transition-transform duration-300 transform hover:scale-105 p-10 rounded-lg">
                  <Link to={{ pathname: `/allProducts/${womenCollectionsItem.title}` }} key={womenCollectionsItem.id}>
                    <img
                      loading="lazy"
                      className="w-full h-full max-w-[400px] transition-transform duration-300 transform hover:-translate-y-1 hover:scale-102 hover:motion-safe:animate-pulse object-cover opacity-60 hover:opacity-100 rounded-lg"
                      src={womenCollectionsItem.imageSrc}
                      alt={womenCollectionsItem.title}
                    />
                  </Link>
                </div>
                <div className="flex transform flex-col gap-1 md:gap-4 mt-auto md:mr-auto md:pl-8 md:pb-4 items-center w-[300px]">
                  <h2 className="text-center md:text-start text-lg md:text-2xl font-semibold font-inter">
                    {i18n.t("featured.WomenCollections.title")}
                  </h2>
                  <p className="text-center md:text-start text-sm">
                    {i18n.t("featured.WomenCollections.description")}
                  </p>
                  <Link to={{ pathname: `/allProducts/${womenCollectionsItem.title}` }} key={womenCollectionsItem.id}>
                    <ShopNow />
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg md:px-6 h-[284px] min-[400px]:max-sm:h-[450px] md:w-[270px]">
                <div className="text-white relative flex md:gap-10 md:mt-10 items-center justify-center flex-col-reverse md:flex-row w-full h-full md:h-[221px] rounded-lg">
                  <div className="px-16 py-4 min-[400px]:px-auto sm:p-0 overflow-hidden absolute inset-0 z-0 bg-no-repeat bg-center bg-cover transition-transform duration-300 transform hover:scale-105 rounded-lg">
                    <Link to={{ pathname: `/allProducts/${speakersItem.title}` }} key={speakersItem.id}>
                      <img
                        loading="lazy"
                        className="w-full h-full max-w-[400px] transition-transform duration-300 transform hover:-translate-y-1 hover:scale-102 hover:motion-safe:animate-pulse object-cover opacity-60 hover:opacity-100 rounded-lg"
                        src={speakersItem.imageSrc}
                        alt={speakersItem.title}
                      />
                    </Link>
                  </div>
                  <div className="flex transform flex-col gap-1 md:gap-2 mt-auto md:mr-auto md:pl-4 w-[270px] items-center md:items-start md:justify-end z-10">
                    <h2 className="text-center md:text-start text-lg md:text-2xl font-semibold font-inter">
                      {i18n.t("featured.speakers.title")}
                    </h2>
                    <p className="text-center md:text-start text-sm">
                      {i18n.t("featured.speakers.description")}
                    </p>
                    <Link to={{ pathname: `/allProducts/${speakersItem.title}` }} key={speakersItem.id}>
                      <ShopNow />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg md:px-6 h-[284px] min-[400px]:max-sm:h-[450px] md:w-[270px]">
                <div className="text-white relative flex md:gap-10 md:mt-10 items-center justify-center flex-col-reverse md:flex-row w-full h-full md:h-[221px] rounded-lg">
                  <div className="px-16 py-8 min-[400px]:px-auto sm:p-0 overflow-hidden absolute inset-0 z-0 bg-no-repeat bg-center bg-cover transition-transform duration-300 transform hover:scale-105 rounded-lg">
                    <Link to={{ pathname: `/allProducts/${perfumesItem.title}` }} key={perfumesItem.id}>
                      <img
                        loading="lazy"
                        className="w-full h-full max-w-[400px] transition-transform duration-300 transform hover:-translate-y-1 hover:scale-102 hover:motion-safe:animate-pulse object-cover opacity-60 hover:opacity-100 rounded-lg"
                        src={perfumesItem.imageSrc}
                        alt={perfumesItem.title}
                      />
                    </Link>
                  </div>
                  <div className="flex transform flex-col gap-1 md:gap-2 mt-auto md:mr-auto md:pl-4 w-[270px] items-center md:items-start md:justify-end z-10">
                    <h2 className="text-center md:text-start text-lg md:text-2xl font-semibold font-inter">
                      {i18n.t("featured.perfume.title")}
                    </h2>
                    <p className="text-center md:text-start text-sm">
                      {i18n.t("featured.perfume.description")}
                    </p>
                    <Link to={{ pathname: `/allProducts/${perfumesItem.title}` }} key={perfumesItem.id}>
                      <ShopNow />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Featured;
