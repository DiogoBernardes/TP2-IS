"use client";
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import ContactsIcon from "@mui/icons-material/Contacts";
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { icon as leafletIcon, point } from "leaflet";

const LIST_PROPERTIES = [
  { key: "customerCount", label: "Total Sales", Icon: ContactsIcon },
];

export function ObjectMarker({ geoJSON }) {
  const properties = geoJSON?.properties;
  const { id, imgUrl, name, customerCount } = properties;
  const coordinates = geoJSON?.geometry?.coordinates;

  return (
    <Marker
      position={coordinates}
      icon={leafletIcon({
        iconUrl: imgUrl,
        iconRetinaUrl: imgUrl,
        iconSize: point(50, 50),
      })}
    >
      <Popup>
        <List dense={true}>
          <ListItem>
            <ListItemIcon>
              <Avatar alt={name} src={imgUrl} />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
          {LIST_PROPERTIES.map(({ key, label, Icon }) => (
            <ListItem key={key}>
              <ListItemIcon>
                <Icon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <span>
                    {properties[key]}
                    <br />
                    <label style={{ fontSize: "xx-small" }}>({label})</label>
                  </span>
                }
              />
            </ListItem>
          ))}
        </List>
      </Popup>
    </Marker>
  );
}
