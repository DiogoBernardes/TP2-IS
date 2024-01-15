"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
export default function CountriesPage() {
  const [countries, setCountries] = useState([]);

  const fetchCountries = async (countryId) => {
    try {
      const response = await fetch("http://localhost:20002/api/countries");
      const data = await response.json();
      const sortedCountries = data.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(sortedCountries);
    } catch (error) {
      console.error("Erro ao buscar modelos para o país:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <main>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell>{country.id}</TableCell>
                <TableCell>{country.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </main>
  );
}
