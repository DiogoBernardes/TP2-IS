// customers.page.js
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

export default function CustomersPage() {
  const api = useApi();
  const [customers, setCustomers] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCountryDetails = async (countryId) => {
    try {
      const countryDetails = await api.GET(`/countries/${countryId}`);
      return countryDetails.data.name;
    } catch (error) {
      console.error("Error fetching country details:", error);
      return "N/A";
    }
  };

  const fetchCustomers = async (pageNumber) => {
    try {
      const response = await api.GET(
        `/customers?page=${pageNumber}&pageSize=${pageSize}`
      );

      const customersWithCountryDetails = await Promise.all(
        response.data.data.map(async (customer) => {
          const countryName = await fetchCountryDetails(customer.country_id);
          return {
            ...customer,
            countryName,
          };
        })
      );

      setCustomers(customersWithCountryDetails);
      setMaxDataSize(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
      setMaxDataSize(0);
    }
  };

  useEffect(() => {
    fetchCustomers(page);
  }, [page, pageSize]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const renderCustomerRows = () => {
    const filteredCustomers = customers.filter(
      (customer) =>
        customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredCustomers.map((customer) => (
      <TableRow key={customer.id}>
        <TableCell component="td" align="center">
          {customer.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {`${customer.first_name} ${customer.last_name}`}
        </TableCell>
        <TableCell component="td" align="center">
          {customer.first_name}
        </TableCell>
        <TableCell component="td" align="center">
          {customer.last_name}
        </TableCell>
        <TableCell component="td" align="center">
          {customer.countryName}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <main>
      <h1>
        <b>Customers Page</b>
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
              <TableCell>Full Name</TableCell>
              <TableCell align="center">First Name</TableCell>
              <TableCell align="center">Last Name</TableCell>
              <TableCell align="center">Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              renderCustomerRows()
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
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
          count={Math.ceil(maxDataSize / pageSize)}
        />
      )}
    </main>
  );
}
