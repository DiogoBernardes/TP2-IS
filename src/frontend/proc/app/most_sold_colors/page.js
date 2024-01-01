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
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import useAPI from "../Hooks/useAPI";

function MostSoldColors() {
  const { GET } = useAPI();
  const [colorData, setColorData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    GET('/mostSoldColors')
      .then((result) => {
        if (result.data) {
          const chartData = Object.keys(result.data).map((key) => ({
            name: key,
            value: parseFloat(result.data[key].toFixed(2))
          }));
          setColorData(chartData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const colorMap = {
    "Aquamarine": "#7FFFD4",
    "Blue": "#0000FF",
    "Crimson": "#DC143C",
    "Fuscia": "#FF00FF",
    "Goldenrod": "#DAA520",
    "Green": "#008000",
    "Indigo": "#4B0082",
    "Khaki": "#F0E68C",
    "Maroon": "#800000",
    "Mauv": "#E0B0FF",
    "Orange": "#FFA500",
    "Pink": "#FFC0CB",
    "Puce": "#CC8899",
    "Purple": "#800080",
    "Red": "#FF0000",
    "Teal": "#008080",
    "Turquoise": "#40E0D0",
    "Violet": "#EE82EE",
    "Yellow": "#FFFF00"
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Most Sold Car Colors
      </Typography>
      <Container maxWidth="lg">
        <ResponsiveContainer width="100%" height={400}>
          {loading ? (
            <CircularProgress />
          ) : (
            <BarChart data={colorData}>
              <XAxis dataKey="name" angle={-90} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {colorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMap[entry.name] || '#000000'} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </Container>
    </>
  );
}

export default MostSoldColors;
