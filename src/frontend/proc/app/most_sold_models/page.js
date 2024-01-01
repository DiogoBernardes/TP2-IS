// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Grid
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function MostSoldModels() {
  const { GET } = useAPI();
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [sortOrder, setSortOrder] = useState('ASC');
  const [pageInput, setPageInput] = useState('');

  useEffect(() => {
    setLoading(true);
    GET('/mostSoldModels')
      .then((result) => {
        if (result.data) {
          const sortedData = Object.entries(result.data)
            .map(([model, sales]) => ({ model, sales }))
            .sort((a, b) => sortOrder === 'ASC' ? a.sales - b.sales : b.sales - a.sales);
          setCarData(sortedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sortOrder, currentPage, itemsPerPage]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePageInput = (event) => {
    setPageInput(event.target.value);
  };

  const goToPage = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber - 1);
    }
  };

  const clearSortOrder = () => {
    setSortOrder('');
  };

  const totalPages = Math.ceil(carData.length / itemsPerPage);
  const currentData = carData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Most Sold Models
      </Typography>
      
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="sort-order-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-label"
              id="sort-order-select"
              value={sortOrder}
              label="Sort Order"
              onChange={handleSortChange}
            >
              <MenuItem value="ASC">Ascending</MenuItem>
              <MenuItem value="DESC">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Go to page"
            type="number"
            value={pageInput}
            onChange={handlePageInput}
            InputProps={{ inputProps: { min: 1, max: totalPages } }}
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <Button fullWidth variant="contained" onClick={goToPage}>
            Go
          </Button>
        </Grid>
      </Grid>
  
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
          Previous
        </Button>
        <Typography sx={{ mx: 2 }}>
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages - 1}>
          Next
        </Button>
      </Box>
  
      {loading ? (
        <CircularProgress />
      ) : (
        <Card raised sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            {currentData.map((item, index) => (
              <Typography key={index}>
                {item.model}: {item.sales}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default MostSoldModels;