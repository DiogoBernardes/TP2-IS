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
} from "@mui/material";
import useApi from "../Hooks/useAPI";

export default function CarsPage() {
  const api = useApi();
  const [cars, setCars] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const fetchCarsWithDetails = async (pageNumber) => {
    try {
      const response = await api.GET(
        `/cars?page=${pageNumber}&pageSize=${itemsPerPage}`
      );
      const totalItems = response.data.totalCount;
      setMaxDataSize(totalItems);
      const carsList = response.data.data;

      const carsWithDetails = await Promise.all(
        carsList.map(async (car) => {
          try {
            const modelDetails = await api.GET(`/models/${car.model_id}`);
            const brandId = modelDetails.data.brand_id;
            const brandDetails = brandId
              ? await api.GET(`/brands/${brandId}`)
              : { data: { name: "N/A" } };

            return {
              ...car,
              modelName: modelDetails.data.name,
              brandName: brandDetails.data.name,
            };
          } catch (error) {
            console.error("Error fetching model and brand details:", error);
            return {
              ...car,
              modelName: "N/A",
              brandName: "N/A",
            };
          }
        })
      );

      setCars(carsWithDetails);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching cars...");
    fetchCarsWithDetails(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderBrandRows = () => {
    return cars.map((car) => (
      <TableRow key={car.id}>
        <TableCell component="td" align="center">
          {car.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {car.color}
        </TableCell>
        <TableCell component="td" scope="row">
          {car.year}
        </TableCell>
        <TableCell component="td" scope="row">
          {car.model_id}
        </TableCell>
        <TableCell component="td" scope="row">
          {car.modelName || "N/A"}
        </TableCell>
        <TableCell component="td" scope="row">
          {car.brandName || "N/A"}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <h1>
        <b>Cars Page</b>
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "lightgray" }}>
              <TableCell component="th" width={"1px"} align="center">
                ID
              </TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Model ID</TableCell>
              <TableCell>Model Name</TableCell>
              <TableCell>Brand Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.length > 0 ? (
              renderBrandRows()
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {cars.length === 0 && maxDataSize > 0 ? (
                    <CircularProgress />
                  ) : (
                    "No data available"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {maxDataSize > 0 && (
        <Pagination
          style={{ color: "black", marginTop: 8 }}
          variant="outlined"
          shape="rounded"
          color={"primary"}
          onChange={handlePageChange}
          page={page}
          count={Math.ceil(maxDataSize / itemsPerPage)}
        />
      )}
    </>
  );
}
