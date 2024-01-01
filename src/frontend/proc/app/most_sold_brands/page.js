// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  CircularProgress,
  Typography
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import useAPI from "../Hooks/useAPI";

function MostSoldBrands() {
  const { GET } = useAPI();
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GET('/mostSoldBrands')
      .then((result) => {
        if (result.data) {
          const chartData = Object.entries(result.data).map(([brand, sales]) => ({
            name: brand,
            sales: parseFloat(sales)
          }));
          setBrandData(chartData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Most Sold Brands
      </Typography>
      <Container maxWidth="lg">
        <ResponsiveContainer width="100%" height={400}>
          {loading ? (
            <CircularProgress />
          ) : (
            <BarChart data={brandData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Container>
    </>
  );
}

export default MostSoldBrands;
