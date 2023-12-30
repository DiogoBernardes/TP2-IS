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
  TextField,
  Button,
  Select,
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function CarsPerYear() {
  const { GET } = useAPI();

  const [brandInput, setBrandInput] = useState("");
  const [procData, setProcData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBrandInputChange = (event) => {
    setBrandInput(event.target.value);
  };

  const fetchModels = () => {
    if (brandInput) {
      setLoading(true);
      GET(`/models?brandName=${encodeURIComponent(brandInput)}`)
        .then((result) => {
          setProcData(result.data);
          setLoading(false);
        })
        .catch(() => {
          setProcData([]);
          setLoading(false);
        });
    }
  };


  return (
    <>
      <h1>Fetch Car Models</h1>

      <Container
        maxWidth="100%"
        sx={{
          backgroundColor: "background.default",
          padding: "2rem",
          borderRadius: "1rem",
        }}
      >
        <Box>
          <h2 style={{ color: "white" }}>Enter Brand Name</h2>
          <TextField
            fullWidth
            label="Brand Name"
            value={brandInput}
            onChange={handleBrandInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchModels}
            sx={{ marginTop: 2 }}
          >
            Fetch Models
          </Button>
        </Box>
      </Container>

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
        {loading ? (
          <CircularProgress />
        ) : procData && procData.length > 0 ? (
          <ul>
            {procData.map((model, index) => (
              <li key={index}>{model}</li>
            ))}
          </ul>
        ) : (
          <p>No data available</p>
        )}
      </Container>
    </>
  );
}

export default CarsPerYear;
