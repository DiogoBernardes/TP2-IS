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
// ... (imports)

function FetchBrands() {
  const { GET } = useAPI();

  const [selectedElement, setSelectedElement] = useState("");
  const [procData, setProcData] = useState(null);

  useEffect(() => {
    GET(`/brands`)
      .then((result) => {
        console.log("API Result:", result);

        if (result.data) {
          console.log("Data from API:", result.data);
          setProcData(result.data);
        } else {
          console.error("Invalid data received from API:", result.data);
          setProcData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <h1>Fetch Brands</h1>

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
        <h2>
          Results <small>(PROC)</small>
        </h2>
        {procData ? (
          procData.length > 0 ? (
            <ul>
              {procData.map((data, index) => (
                <li key={index}>{data}</li>
              ))}
            </ul>
          ) : (
            <p>No data available</p>
          )
        ) : selectedElement ? (
          <CircularProgress />
        ) : (
          "--"
        )}
      </Container>
    </>
  );
}

export default FetchBrands;
