// CarsPage.js
"use client";
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import useApi from "../Hooks/useAPI";

export default function CarsPage() {
  const api = useApi();
  const [cars, setCars] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCars = async (pageNumber) => {
    try {
      const response = await api.GET(`/cars?page=${pageNumber}`);
      setCars(response.data);
      setMaxDataSize(response.headers["x-total-count"]);
    } catch (error) {
      console.error("Error fetching brand cars:", error);
    }
  };

  const fetchModelDetails = async (modelId) => {
    try {
      const modelDetails = await api.GET(`/models/${modelId}`);
      const brandId = modelDetails.data.brand_id;
      const brandName = await fetchBrandName(brandId);
      return {
        modelName: modelDetails.data.name,
        brandName,
      };
    } catch (error) {
      console.error("Error fetching model details:", error);
      return {
        modelName: "N/A",
        brandName: "N/A",
      };
    }
  };

  const fetchBrandName = async (brandId) => {
    try {
      const brandDetails = await api.GET(`/brands/${brandId}`);
      return brandDetails.data.name;
    } catch (error) {
      console.error("Error fetching brand name:", error);
      return "N/A";
    }
  };

  const fetchModelsForCars = async () => {
    const carsWithModelDetails = await Promise.all(
      cars.map(async (car) => {
        const modelDetails = await fetchModelDetails(car.model_id);
        return {
          ...car,
          ...modelDetails,
        };
      })
    );
    setCars(carsWithModelDetails);
  };

  useEffect(() => {
    fetchCars(page);
  }, [page]);

  useEffect(() => {
    fetchModelsForCars();
  }, [cars]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderBrandCarRows = () => {
    const filteredCars = cars.filter(
      (car) =>
        car.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.year.toString().includes(searchTerm) ||
        car.model_id.toString().includes(searchTerm) ||
        car.modelName.toLowerCase().includes(searchTerm) ||
        car.brandName.toLowerCase().includes(searchTerm)
    );

    return filteredCars.map((car) => (
      <TableRow key={car.id}>
        <TableCell component="td" align="center">
          {car.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {car.color}
        </TableCell>
        <TableCell component="td" align="center">
          {car.year}
        </TableCell>
        <TableCell component="td" align="center">
          {car.model_id}
        </TableCell>
        <TableCell component="td" align="center">
          {car.modelName}
        </TableCell>
        <TableCell component="td" align="center">
          {car.brandName}
        </TableCell>
        {/* Adicione mais colunas conforme necessário */}
      </TableRow>
    ));
  };

  return (
    <main>
      <h1>
        <b>Cars Page</b>
      </h1>
      <TextField
        label="Search"
        variant="outlined"
        margin="normal"
        onChange={handleSearchChange}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "lightgray" }}>
              <TableCell component="th" width={"1px"} align="center">
                ID
              </TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="center">Year</TableCell>
              <TableCell align="center">Model ID</TableCell>
              <TableCell align="center">Model Name</TableCell>
              <TableCell align="center">Brand Name</TableCell>
              {/* Adicione mais cabeçalhos conforme necessário */}
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.length > 0 ? (
              renderBrandCarRows()
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {maxDataSize && (
        <Pagination
          style={{ color: "black", marginTop: 8 }}
          variant="outlined"
          shape="rounded"
          color={"primary"}
          onChange={handlePageChange}
          page={page}
          count={Math.ceil(maxDataSize / 10)} // PAGE_SIZE
        />
      )}
    </main>
  );
}
