"use client";
import React, { useEffect, useState } from "react";
import { LayerGroup, useMap } from "react-leaflet";
import { ObjectMarker } from "./ObjectMarker";
import useAPI from "../Hooks/useAPI";

function ObjectMarkersGroup() {
  const map = useMap();
  const [geom, setGeom] = useState([]);
  const [bounds, setBounds] = useState(map.getBounds());
  const api = useAPI();

  useEffect(() => {
    const cb = () => {
      setBounds(map.getBounds());
    };
    if (typeof window !== "undefined") {
      map.on("moveend", cb);
    }

    return () => {
      if (typeof window !== "undefined") {
        map.off("moveend", cb);
      }
    };
  }, [map]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiResponse = await api.GET("/countries");

      if (apiResponse && Array.isArray(apiResponse.data)) {
        const apiData = apiResponse.data;

        // Fetch customer counts for each country
        const customerCounts = await Promise.all(
          apiData.map(async (country) => {
            const customerCountResponse = await api.GET(
              `/countries/${country.id}/customer-count`
            );
            return {
              countryId: country.id,
              customerCount: customerCountResponse.data.customer_count || 0,
            };
          })
        );

        const geomData = apiData.map((data, index) => {
          const countryId = data.id;
          const countryName = data.name;
          const coordinates = data.geom.coordinates;

          if (
            coordinates &&
            Array.isArray(coordinates) &&
            coordinates.length >= 2
          ) {
            const latitude = parseFloat(coordinates[0]);
            const longitude = parseFloat(coordinates[1]);

            if (!isNaN(latitude) && !isNaN(longitude)) {
              return {
                type: "feature",
                geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                properties: {
                  id: countryId,
                  name: countryName,
                  customerCount: customerCounts[index].customerCount,
                  imgUrl:
                    "https://cdn-icons-png.flaticon.com/512/1067/1067630.png",
                },
              };
            } else {
              console.error("Invalid coordinates:", coordinates);
              return null;
            }
          } else {
            console.error("Invalid or missing coordinates:", coordinates);
            return null;
          }
        });

        setGeom(geomData.filter((geo) => geo !== null));
      } else {
        console.error("Invalid API response structure:", apiResponse);
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  return (
    <LayerGroup>
      {geom.map((geoJSON) => (
        <ObjectMarker key={geoJSON.properties.id} geoJSON={geoJSON} />
      ))}
    </LayerGroup>
  );
}

export default ObjectMarkersGroup;
