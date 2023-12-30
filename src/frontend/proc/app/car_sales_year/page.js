// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  CircularProgress,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function CarsPerYear() {
  const { GET } = useAPI();

  const [yearInput, setYearInput] = useState("");
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleYearInputChange = (event) => {
    setYearInput(event.target.value);
  };

  const fetchCarDetails = () => {
    if (yearInput) {
      setLoading(true);
      GET(`/carYear?year=${encodeURIComponent(yearInput)}`)
        .then((result) => {
          setCarData(result.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setCarData(null);
          setLoading(false);
        });
    }
  };

  return (
    <>
      <h1>Car Sales Per Year</h1>
      <Container
        maxWidth="100%"
        sx={{
          backgroundColor: "background.default",
          padding: "2rem",
          borderRadius: "1rem",
        }}
      >
        <TextField
          fullWidth
          label="Year"
          value={yearInput}
          onChange={handleYearInputChange}
          type="number"
          sx={{ marginBottom: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchCarDetails}
          sx={{ marginTop: 2 }}
        >
          Fetch Car Details
        </Button>
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
        ) : (
          carData && (
            <List>
              {carData.map((car, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Brand: ${car.Brand}, Model: ${car.Model}`}
                    secondary={`Color: ${car.Color}, Customer: ${car.Customer}`}
                  />
                </ListItem>
              ))}
            </List>
          )
        )}
      </Container>
    </>
  );
}

export default CarsPerYear;
