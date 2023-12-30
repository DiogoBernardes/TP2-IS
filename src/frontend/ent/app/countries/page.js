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
} from "@mui/material";
import useApi from "../Hooks/useAPI";

export default function CountriesPage() {
  const api = useApi();
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await api.GET("/countries");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

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
    </main>
  );
}
