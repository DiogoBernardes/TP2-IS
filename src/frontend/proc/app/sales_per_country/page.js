// ./app/top_teams/page.js
"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import useAPI from "../Hooks/useAPI";

function FetchSalesPerCountry() {
  const { GET } = useAPI();

  const [loading, setLoading] = useState(false); 
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
        maxWidth="lg"
        sx={{
          backgroundColor: "background.paper",
          padding: "2rem",
          marginTop: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)"
        }}
      >
        <h2>Results <small>(PROC)</small></h2>
        {loading ? (
          <CircularProgress />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={procData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Container>
    </>
  );
}

export default FetchSalesPerCountry;
