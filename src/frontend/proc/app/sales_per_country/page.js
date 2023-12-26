// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function FetchSalesPerCountry() {
  const { GET } = useAPI();

  const [selectedElement, setSelectedElement] = useState("");
  const [procData, setProcData] = useState(null);

  useEffect(() => {
    GET(`/perCountry`)
      .then((result) => {
        if (result.data) {
          const dataArray = Object.entries(result.data).map(([country, sales]) => {
            return { country, sales };
          });
          setProcData(dataArray);
        } else {
          setProcData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setProcData([]);
      });
  }, []);

  return (
    <>
      <h1>Sales per Country</h1>
      <Container
        maxWidth="100%"
        sx={{
          backgroundColor: "info.dark",
          padding: "2rem",
          marginTop: "2rem",
          borderRadius: "1rem",
          color: "white",
        }}
      >
        <h2>Results <small>(PROC)</small></h2>
        {procData && procData.length > 0 ? (
          <ul>
            {procData.map((item, index) => (
              <li key={index}>{`${item.country}: ${item.sales}`}</li>
            ))}
          </ul>
        ) : (
          <CircularProgress />
        )}
      </Container>
    </>
  );
}

export default FetchSalesPerCountry;
