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

export default function CreditCardTypesPage() {
  const api = useApi();
  const [creditCardTypes, setCreditCardTypes] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [page, setPage] = useState(1);

  const fetchCreditCardTypes = async (pageNumber) => {
    try {
      const response = await api.GET(`/credit-card-types?page=${pageNumber}`);
      setCreditCardTypes(response.data);
      setMaxDataSize(response.headers["x-total-count"]);
    } catch (error) {
      console.error("Error fetching credit card types:", error);
    }
  };

  useEffect(() => {
    fetchCreditCardTypes(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderCreditCardTypeRows = () => {
    return creditCardTypes.map((creditCardType) => (
      <TableRow key={creditCardType.id}>
        <TableCell component="td" align="center">
          {creditCardType.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {creditCardType.name}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <main>
      <h1>
        <b>Credit Card Types Page</b>
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
            {creditCardTypes.length > 0 ? (
              renderCreditCardTypeRows()
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
