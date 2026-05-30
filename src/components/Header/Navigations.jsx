import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';

const Navigations = () => {
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs 
      value={value} 
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ minHeight: '48px' }}
    >
      <Tab 
        label="Главная" 
        value="/" 
        component={Link} 
        to="/" 
      />
      <Tab 
        label="Все товары" 
        value="/allProducts" 
        component={Link} 
        to="/allProducts" 
      />
      <Tab 
        label="Категории" 
        value="/category" 
        component={Link} 
        to="/category" 
      />
      <Tab 
        label="Корзина" 
        value="/cart" 
        component={Link} 
        to="/cart" 
      />
      <Tab 
        label="Аккаунт" 
        value="/account" 
        component={Link} 
        to="/account" 
      />
    </Tabs>
  );
};

export default Navigations;