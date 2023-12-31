// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  CardContent,
  CircularProgress,
  Typography,
  Grid,
  Select,
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function FetchBrands() {
  const { GET } = useAPI();

  const [selectedElement, setSelectedElement] = useState("");
  const [procData, setProcData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>Car Brands</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {procData && procData.map((brand, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {brand}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default FetchBrands;
