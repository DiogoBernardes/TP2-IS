"use client";
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import useApi from "../Hooks/useAPI";

export default function ModelsPage() {
  const api = useApi();
  const [models, setModels] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [page, setPage] = useState(1);

  const fetchBrandInfo = async (modelId) => {
    try {
      const modelDetails = await api.GET(`/models/${modelId}`);
      const brandDetails = await api.GET(
        `/brands/${modelDetails.data.brand_id}`
      );

      return {
        brandName: brandDetails.data.name,
      };
    } catch (error) {
      console.error("Error fetching model and brand info:", error);
      throw error;
    }
  };

  const fetchModels = async (pageNumber) => {
    try {
      const response = await api.GET(`/models?page=${pageNumber}`);
      setModels(response.data);
      setMaxDataSize(response.headers["x-total-count"]);
      const modelWithBrandName = await Promise.all(
        response.data.map(async (row) => {
          const { modelName, brandName } = await fetchBrandInfo(row.id);
          return {
            ...row,
            brandName,
          };
        })
      );
      setModels(modelWithBrandName);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  useEffect(() => {
    fetchModels(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderModelRows = () => {
    return models.map((model) => (
      <TableRow key={model.id}>
        <TableCell component="td" align="center">
          {model.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {model.name}
        </TableCell>
        <TableCell component="td" align="center">
          {model.brand_id}
        </TableCell>
        <TableCell component="td" scope="row">
          {model.brandName || "N/A"}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <main>
      <h1>
        <b>Models Page</b>
      </h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "lightgray" }}>
              <TableCell component="th" width={"1px"} align="center">
                ID
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Brand ID</TableCell>
              <TableCell>Brand Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.length > 0 ? (
              renderModelRows()
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
