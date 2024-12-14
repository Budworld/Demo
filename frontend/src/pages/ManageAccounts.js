import React from "react";
import { Link } from "react-router-dom";
import { Typography, Box, List, ListItem, ListItemText, ListItemButton } from "@mui/material";

const ProductListPage = () => {
  const products = [
    { id: 1, name: "Sản phẩm 1", price: "200.000đ" },
    { id: 2, name: "Sản phẩm 2", price: "300.000đ" },
    { id: 3, name: "Sản phẩm 3", price: "150.000đ" },
  ];

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Danh Sách Sản Phẩm
      </Typography>
      <List>
        {products.map((product) => (
          <ListItem key={product.id} disablePadding>
            <ListItemButton component={Link} to={`/products/${product.id}`} sx={{ textDecoration: "none", color: "blue", "&:hover": { backgroundColor: "#f0f0f0" } }}>
              <ListItemText
                primary={product.name}
                secondary={`Giá: ${product.price}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProductListPage;
