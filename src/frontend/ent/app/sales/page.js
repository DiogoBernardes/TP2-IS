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

export default function SalesPage() {
  const api = useApi();
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [customerNames, setCustomerNames] = useState([]);
  const [creditCardNames, setCreditCardNames] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const itemsPerPage = 20;

  const fetchCustomerNames = async (customerIds) => {
    try {
      const responses = await Promise.all(
        customerIds.map((customerId) => api.GET(`/customers/${customerId}`))
      );

      return responses.map((response) => {
        const customerData = response.data;
        return `${customerData.first_name} ${customerData.last_name}`;
      });
    } catch (error) {
      console.error("Error fetching customer names:", error);
      throw error;
    }
  };

  const fetchCreditCardNames = async (creditCardIds) => {
    try {
      const responses = await Promise.all(
        creditCardIds.map((creditCardId) =>
          api.GET(`/credit-card-types/${creditCardId}`)
        )
      );

      return responses.map((response) => response.data.name);
    } catch (error) {
      console.error("Error fetching credit card names:", error);
      throw error;
    }
  };

  const fetchModelAndBrandInfo = async (carId) => {
    try {
      const carDetails = await api.GET(`/cars/${carId}`);
      const modelDetails = await api.GET(`/models/${carDetails.data.model_id}`);
      const brandDetails = await api.GET(
        `/brands/${modelDetails.data.brand_id}`
      );

      return {
        modelName: modelDetails.data.name,
        brandName: brandDetails.data.name,
      };
    } catch (error) {
      console.error("Error fetching model and brand info:", error);
      throw error;
    }
  };

  const updateCustomerNames = async () => {
    try {
      if (sales.length > 0) {
        const customerIds = sales.map((row) => row.customer_id);
        const customerNamesPromises = customerIds.map((customerId) =>
          api.GET(`/customers/${customerId}`)
        );

        const customerResponses = await Promise.all(customerNamesPromises);

        const customerNames = customerResponses.map((response) => {
          const customerData = response.data;
          return `${customerData.first_name} ${customerData.last_name}`;
        });

        setCustomerNames(customerNames);
        setDataReady(true);
      }
    } catch (error) {
      console.error("Error updating customer names:", error);
    }
  };

  const fetchSales = async (pageNumber) => {
    try {
      const response = await api.GET(
        `/sales?page=${pageNumber}&pageSize=${itemsPerPage}`
      );
      const salesData = response.data.data;

      const customerIds = salesData.map((row) => row.customer_id);
      const creditCardIds = salesData.map((row) => row.credit_card_type_id);

      const customerNames = await fetchCustomerNames(customerIds);
      const creditCardNames = await fetchCreditCardNames(creditCardIds);

      const salesWithAdditionalInfo = await Promise.all(
        salesData.map(async (row) => {
          const { modelName, brandName } = await fetchModelAndBrandInfo(
            row.car_id
          );
          return {
            ...row,
            modelName,
            brandName,
          };
        })
      );

      setCreditCardNames(creditCardNames);
      setSales(salesWithAdditionalInfo);
      setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));

      updateCustomerNames();
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  useEffect(() => {
    fetchSales(page);
  }, [page]);

  useEffect(() => {
    updateCustomerNames();
  }, [sales]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderSalesRows = () => {
    return sales.map((sale) => (
      <TableRow key={sale.id}>
        <TableCell component="td" align="center">
          {sale.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {sale.car_id}
        </TableCell>
        <TableCell component="td" scope="row">
          {sale.modelName || "N/A"}
        </TableCell>
        <TableCell component="td" scope="row">
          {sale.brandName || "N/A"}
        </TableCell>
        <TableCell component="td" scope="row">
          {sale.customer_id}
        </TableCell>
        <TableCell component="td" scope="row">
          {customerNames[sale.customer_id] || "N/A"}
        </TableCell>
        <TableCell component="td" scope="row">
          {creditCardNames[sale.credit_card_type_id] || "N/A"}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <h1>
        <b>Sales Page</b>
      </h1>
      {dataReady ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "lightgray" }}>
                <TableCell component="th" width={"1px"} align="center">
                  ID
                </TableCell>
                <TableCell>Car ID</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Credit Card</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.length > 0 ? (
                renderSalesRows()
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {sales.length === 0 ? (
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
      ) : (
        <CircularProgress />
      )}
      {totalPages > 0 && (
        <Pagination
          style={{ color: "black", marginTop: 8 }}
          variant="outlined"
          shape="rounded"
          color={"primary"}
          onChange={handlePageChange}
          page={page}
          count={totalPages}
        />
      )}
    </>
  );
}
