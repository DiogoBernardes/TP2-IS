// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState, useRef } from "react";
import { 
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Container,
  TextField,
  Autocomplete
} from "@mui/material";
import useAPI from "../Hooks/useAPI";

function FetchCarModels() {
  const { GET } = useAPI();

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchedBrandsRef = useRef(false);

  useEffect(() => {
    if (!fetchedBrandsRef.current) {
      const fetchBrands = async () => {
        try {
          const response = await GET('/brands');
          setBrands(response.data || []);
          fetchedBrandsRef.current = true;
        } catch (error) {
          console.error("Error fetching brands:", error);
        }
      };

      fetchBrands();
    }
  }, [GET]);;

  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand);
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  const fetchModels = async (brandName) => {
    setLoading(true);
    try {
      const response = await GET(`/models?brandName=${encodeURIComponent(brandName)}`);
      setModels(response.data || []);
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>Car Models</Typography>
      <Autocomplete
        options={brands}
        value={selectedBrand}
        onChange={(event, newValue) => {
          setSelectedBrand(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select or Type Brand" fullWidth />
        )}
        sx={{ mb: 3 }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {models.map((model, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{model}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default FetchCarModels;
