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

export default function BrandsPage() {
  const api = useApi();
  const [brands, setBrands] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const fetchBrands = async (pageNumber) => {
    try {
      const response = await api.GET(
        `/brands?page=${pageNumber}&pageSize=${itemsPerPage}`
      );
      const totalItems = response.data.totalCount;
      setMaxDataSize(totalItems);
      const brandsList = response.data.data;
      setBrands(brandsList);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderBrandRows = () => {
    return brands.map((brand) => (
      <TableRow key={brand.id}>
        <TableCell component="td" align="center">
          {brand.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {brand.name}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <h1>
        <b>Brands Page</b>
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
            {brands.length > 0 ? (
              renderBrandRows()
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  {brands.length === 0 && maxDataSize > 0 ? (
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
