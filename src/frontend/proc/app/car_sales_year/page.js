// ./app/top_teams/page.js
"use client";
import React, { useState } from "react";
import {
  Container,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function CarsPerYear() {
  const { GET } = useAPI();
  const [yearInput, setYearInput] = useState('');
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchCarDetails = () => {
    setLoading(true);
    GET(`/carYear?year=${encodeURIComponent(yearInput)}`)
      .then((result) => {
        setCarData(Array.isArray(result.data) ? result.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching car details:", error);
        setCarData([]);
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, carData.length - page * rowsPerPage);


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Car Sales Per Year
      </Typography>
      <TextField
        fullWidth
        label="Year"
        value={yearInput}
        onChange={(e) => setYearInput(e.target.value)}
        type="number"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchCarDetails}
        disabled={!yearInput}
        sx={{ mb: 4 }}
      >
        Fetch Sales on This Year
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <Card raised sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table aria-label="car sales table">
                <TableHead>
                  <TableRow>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Customer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? carData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : carData
                  ).map((car, index) => (
                    <TableRow key={index}>
                      <TableCell>{car.Brand}</TableCell>
                      <TableCell>{car.Model}</TableCell>
                      <TableCell>{car.Color}</TableCell>
                      <TableCell>{car.Customer}</TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={carData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {carData.length === 0 && <Typography>No data available for the selected year.</Typography>}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default CarsPerYear;
