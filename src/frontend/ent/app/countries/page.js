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

export default function CustomersPage() {
  const api = useApi();
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await api.GET("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const renderCustomerRows = () => {
    return customers.map((customer) => (
      <TableRow key={customer.id}>
        <TableCell component="td" align="center">
          {customer.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {`${customer.first_name} ${customer.last_name}`}
        </TableCell>
        <TableCell component="td" align="center">
          {customer.country.name}{" "}
          {/* Assuming each customer has a country association */}
        </TableCell>
        {/* Add more cells for additional customer details if needed */}
      </TableRow>
    ));
  };

  return (
    <main>
      <h1>
        <b>Customers Page</b>
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "lightgray" }}>
              <TableCell component="th" width={"1px"} align="center">
                ID
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Country</TableCell>
              {/* Add more table headers for additional customer details if needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              renderCustomerRows()
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
