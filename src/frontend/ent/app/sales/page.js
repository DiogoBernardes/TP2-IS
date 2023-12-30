"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useApi from "../Hooks/useAPI";

export default function SalesPage() {
  const api = useApi();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const [sales, setSales] = useState([]);
  const [maxDataSize, setMaxDataSize] = useState(0);
  const [customerNames, setCustomerNames] = useState([]);
  const [creditCardNames, setCreditCardNames] = useState([]);

  const page = parseInt(searchParams.get("page")) || 1;
  const PAGE_SIZE = 10;

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

  const fetchSalesData = async () => {
    try {
      const response = await api.GET("/sales");
      const salesData = response.data;
      setSales(salesData);
      setMaxDataSize(salesData.length);

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

      setCustomerNames(customerNames);
      setCreditCardNames(creditCardNames);
      setSales(salesWithAdditionalInfo);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [page]);

  const renderSalesRows = () => {
    const slicedSales = sales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return slicedSales.map((row, index) => (
      <TableRow key={row.id}>
        <TableCell component="td" align="center">
          {row.id}
        </TableCell>
        <TableCell component="td" scope="row">
          {row.car_id}
        </TableCell>
        <TableCell component="td" scope="row">
          {row.modelName || "N/A"}
        </TableCell>
        <TableCell component="td" scope="row">
          {row.brandName || "N/A"}
        </TableCell>
        <TableCell component="td" scope="row">
          {customerNames[index] || "N/A"}
        </TableCell>
        <TableCell component="td" scope="row">
          {creditCardNames[index] || "N/A"}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <h1 sx={{ fontSize: "100px" }}>Sales</h1>

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
              <TableCell>Credit Card</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.length > 0 ? (
              renderSalesRows()
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
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
          onChange={(e, v) => {
            router.push(pathname + "?" + createQueryString("page", v));
          }}
          page={page}
          count={Math.ceil(maxDataSize / PAGE_SIZE)}
        />
      )}
    </>
  );
}
