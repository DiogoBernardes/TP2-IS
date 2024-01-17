"use client";
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import useApi from "../Hooks/useAPI";

export default function CountriesPage() {
  const api = useApi();
  const [countries, setCountries] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const fetchCountries = async (pageNumber) => {
    try {
      const response = await api.GET(
        `/countries?page=${pageNumber}&pageSize=${itemsPerPage}`
      );
      const totalItems = response.data.totalCount;
      setMaxDataSize(totalItems);
      const countriesList = response.data.data;
      setCountries(countriesList);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderCountryRows = () => {
    return countries.map((country) => (
      <TableRow key={country.id}>
        <TableCell component="td" align="center">
          {country.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {country.name}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <main>
      <h1>
        <b>Countries Page</b>
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "lightgray" }}>
              <TableCell component="th" width={"1px"} align="center">
                ID
              </TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.length > 0 ? (
              renderCountryRows()
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <CircularProgress />
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
    </main>
  );
}
