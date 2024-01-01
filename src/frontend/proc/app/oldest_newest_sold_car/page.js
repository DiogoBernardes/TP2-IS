// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, 
  Container, 
  CircularProgress, Typography, Card, CardContent, Grid } from "@mui/material";
import useAPI from "../Hooks/useAPI";

function CarDetails() {
  const { GET } = useAPI();
  
  const [oldestCarData, setOldestCarData] = useState(null);
  const [newestCarData, setNewestCarData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      GET('/oldestCarSold'),
      GET('/newestCarSold')
    ]).then(([oldestResult, newestResult]) => {
      if (oldestResult.data) {
        setOldestCarData(oldestResult.data);
      }
      if (newestResult.data) {
        setNewestCarData(newestResult.data);
      }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Car Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Oldest Sold Car Details
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : oldestCarData ? (
                Object.entries(oldestCarData).map(([key, value]) => (
                  <Typography key={key}>{`${key}: ${value}`}</Typography>
                ))
              ) : (
                <Typography>No data available for the oldest car.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Newest Sold Car Details
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : newestCarData ? (
                Object.entries(newestCarData).map(([key, value]) => (
                  <Typography key={key}>{`${key}: ${value}`}</Typography>
                ))
              ) : (
                <Typography>No data available for the newest car.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CarDetails;
