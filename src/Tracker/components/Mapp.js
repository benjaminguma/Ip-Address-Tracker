import React, { useRef, useEffect, useState } from "react";
import icon from "../images/icon-location.svg";

const Mapp = (props) => {
  const mapRef = useRef(null);
  const [mapOn, setMapOn] = useState(null);

  useEffect(() => {
    if (!props.lat) return;

    const { lat, lng } = props;

    let map;
    // if block runs only once
    if (!mapOn) map = new window.L.map(mapRef.current);
    else map = mapOn;

    map.setView([lat, lng], 15);
    const layer = new window.L.TileLayer(
      "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    );
    map.addLayer(layer);
    const iconOptions = {
      iconUrl: icon,
      iconSize: [50, 60],
    };
    // Creating a custom icon
    const customIcon = window.L.icon(iconOptions);

    // Creating Marker Options
    var markerOptions = {
      title: `local`,
      clickable: true,
      draggable: true,
      icon: customIcon,
    };
    const marker = window.L.marker([lat, lng], markerOptions);
    marker.addTo(map);
    marker.bindPopup(`this is where address ${props.ip} is`);
    setMapOn(map);
  }, [props.lat, props.lng]);

  return <main ref={mapRef} className="main"></main>;
};

export default Mapp;
