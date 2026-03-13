import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import world from "../assets/world_polygons.json";

function MapVis() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // prevent multiple initialisations

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [-0.09, 51.505], // IMPORTANT: [lng, lat]
      zoom: 1,
      minZoom: 1
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      map.current.addSource("world", {
        type: "geojson",
        data: world
      });

      map.current.addLayer({
        id: "world-fill",
        type: "fill",
        source: "world",
        paint: {
          "fill-color": "#0080ff",
          "fill-opacity": 0.4
        }
      });
    });

  }, []);

  return (
    <div
      ref={mapContainer}
      className="h-full rounded-md"
      style={{ width: "100%" }}
    />
  );
}

export default MapVis;