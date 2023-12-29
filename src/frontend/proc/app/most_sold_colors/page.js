// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CircularProgress,
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function MostSoldColors() {
  const { GET } = useAPI();
  const [colorData, setColorData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GET('/mostSoldColors')
      .then((result) => {
        if (result.data) {
          setColorData(result.data);
        } else {
          setColorData(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setColorData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Most Sold Car Colors</h1>
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
        ) : colorData ? (
          <Box>
            {Object.entries(colorData).map(([key, value]) => (
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

export default MostSoldColors;
