// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function MostSoldModels() {
  const { GET } = useAPI();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GET('/mostSoldModels')
      .then((result) => {
        if (result.data) {
          setCarData(result.data);
        } else {
          setCarData(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCarData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Most Sold Models</h1>
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
        ) : carData ? (
          <Box>
            {Object.entries(carData).map(([key, value]) => (
              <p key={key}>{`${key}: ${value}`}</p>
            ))}
          </Box>
        ) : (
          <p>No data available</p>
        )}
      </Container>
    </>
  );
}

export default MostSoldModels;
