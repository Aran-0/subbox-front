import { useState, useEffect } from "react";
import { Grid, Typography, Menu, MenuItem, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import FlashSaleItem from "../components/common/components/FlashSaleItem";
import i18n from "../components/common/components/LangConfig";
import { ITEMS } from "../components/common/functions/items";
import { saveViewedCategory } from "../components/common/functions/recommendationUtils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ViewAll from "../components/common/components/ViewAll";
import WhiteButton from "../components/common/components/WhiteButton";

const Category = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.category || i18n.t("homeSections.row1.col1.0")
  );

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedCategory) {
      saveViewedCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setAnchorEl(null);
  };

  // Filter ITEMS based on the selected category
  const filteredItems = ITEMS.filter((item) => item.type === selectedCategory);

  return (
    <div className="container mx-auto mt-40 flex flex-col gap-5">
      <Typography variant="h3" align="center" gutterBottom>
        {i18n.t("allProducts.byCategory")}
      </Typography>
      <div className="flex justify-center mb-4">
        <Button
          style={{
            backgroundColor: "rgba(219, 68, 68, 1)",
            color: "white",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "5px",
            textTransform: "capitalize",
            boxShadow: "0 2px 4px rgba(0, 0, 0, .2)",
          }}
          variant="contained"
          startIcon={<ArrowDropDownIcon />}
          onClick={handleMenuOpen}
        >
          {i18n.t("redButtons.chooseByCategory")}
        </Button>

        <Menu
          id="category-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-1 flex items-center justify-center mx-1"
        >
          {[
            i18n.t("homeSections.row1.col1.0"), // Women's Fashion
            i18n.t("homeSections.row1.col1.1"), // Men's Fashion
            i18n.t("homeSections.row1.col1.2"), // Technology
            i18n.t("homeSections.row1.col1.3"), // Home & Lifestyle
            i18n.t("homeSections.row1.col1.4"), // Medicine
            i18n.t("homeSections.row1.col1.5"), // Sports & Outdoor
            i18n.t("homeSections.row1.col1.6"), // Baby's & Toys
            i18n.t("homeSections.row1.col1.7"), // Groceries & Pets
            i18n.t("homeSections.row1.col1.8"), // Health & Beauty
          ].map((category) => (
            <MenuItem
              className="w-36"
              key={category}
              onClick={() => handleCategorySelect(category)}
            >
              <span className="text-xl mx-auto">{category}</span>
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className="relative mx-2 my-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform ">
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {filteredItems.map((item, index) => (
            <Grid item key={item.id}>
              <FlashSaleItem
                item={item}
                index={index}
                totalItems={filteredItems.length}
                stars={item.stars}
                rates={item.rates}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="mt-6 flex justify-center gap-5 md:gap-20 items-center md:mx-12 ">
        <Link to="..">
          <WhiteButton name={i18n.t("whiteButtons.backToHomePage")} />
        </Link>
        <ViewAll name={i18n.t("redButtons.viewAllProducts")} />
      </div>
    </div>
  );
};

export default Category;
