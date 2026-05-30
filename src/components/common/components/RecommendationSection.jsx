import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";
import FlashSaleItem from "./FlashSaleItem";

const RecommendationSection = ({ title, items }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="font-bold">
          {title}
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          {items.length} suggestions
        </Typography>
      </div>
      {items.length > 0 ? (
        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {items.map((item) => (
            <Grid item key={item.id}>
              <FlashSaleItem item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" className="text-gray-500">
          No recommendations available yet. Try searching or viewing a product to populate suggestions.
        </Typography>
      )}
    </div>
  );
};

RecommendationSection.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RecommendationSection;
