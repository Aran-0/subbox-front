import Row1 from "../components/Home/Row1";
import FlashSale from "../components/Home/FlashSale";
import BestSelling from "../components/Home/BestSelling";
import Categories from "../components/Home/Categories";
import Services from "../components/common/components/Services";
import AllProducts from "../components/Home/AllProducts";
import Featured from "../components/Home/Featured";
import AIProductAssistant from "../components/common/components/AIProductAssistant";
import { ITEMS } from "../components/common/functions/items";
const Home = () => {
  return (
    <div dir="ltr" className="flex flex-col xl:mx-32 mt-28 gap-3">
      <Row1 />
      <FlashSale />
      <Categories />
      <BestSelling items={ITEMS} />
      <AllProducts items={ITEMS} />
      <Featured />
      <AIProductAssistant />
      <Services />
    </div>
  );
};

export default Home;
