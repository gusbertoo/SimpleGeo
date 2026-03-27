import { MapContainer, TileLayer,GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useState, useEffect, useRef} from 'react'

function MapDragHandler({ setDragging }) { /* allows for dragging over map control div */
    useMapEvents({
        dragstart: () => setDragging(true),
        dragend: () => setDragging(false),
    });
};

function MapVisualisation({geo, metric, geos, getPresetGeo, presetData, data, setShowBind}) {
    const geoRef = useRef(null);
    const map = useRef(null);
    const [drag, setDrag] = useState(true);
    const [dragging, setDragging] = useState(false);

    useEffect(()=>{
        if (geoRef.current) {
            geoRef.current.clearLayers(); /* ref allows for use of leaflets clearLayers function */
            if (geo) {geoRef.current.addData(geo);} /* if there is no geojson, don't add geojson layer */
        }
    }, [geo]);

    useEffect(()=>{
        if (map.current) {
            (drag) ? map.current.dragging.enable() : map.current.dragging.disable();
        }
    }, [drag])

	return (
		<MapContainer
            ref={map}
            center={[51.505, -0.09]} 
            keyboard={false} /* prevents strange jump on first click on map */
            dragging={drag}
            minZoom={2} 
            maxBounds={[[-90, -180], [90, 180],]} 
            maxBoundsViscosity={1.0} zoom={2} 
            className='h-full rounded-r-md shadow-md z-0 grid grid-cols-[auto_200px]'
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                /*url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"*/
                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
            />
            <GeoJSON data={geo} ref={geoRef} />
            <div className='col-start-2 bg-white z-1000 h-40 m-5 rounded-md shadow-md' onMouseOver={()=>{if (!dragging) setDrag(false)}} onMouseOut={()=>{if (!dragging) setDrag(true)}}>
                <select onChange={(e) => {getPresetGeo(e.target.value)}}>
                    <option value='-1'>Custom</option>
                    {geos ? 
                        geos.map(
                            (g) => (
                                <option value={g['geo_id']} key={g['geodata_id']}>{g['name']}</option>
                            )
                        ) : 
                        <></>
                    }
                </select>
                {presetData && data.length > 0 &&
                    <button onClick={() => setShowBind(true)}>Add Custom Dataset to Preset</button>
                }

            </div>
            <MapDragHandler setDragging={setDragging} />
        </MapContainer>
	)
}

/*const getColor = (value) => {
            return value > 100 ? "#800026" :
                value > 50  ? "#BD0026" :
                value > 20  ? "#E31A1C" :
                value > 10  ? "#FC4E2A" :
                value > 0   ? "#FD8D3C" :
                               "#ccc";
    };

    const style = (feature) => {
      const countryCode = feature;
      const value = userData[countryCode];

      return {
        fillColor: getColor(value),
        weight: 1,
        opacity: 1,
        color: "white",
        fillOpacity: 0.7
      };
    };*/

export default MapVisualisation;