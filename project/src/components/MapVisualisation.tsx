import { MapContainer, TileLayer,GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useState, useEffect, useRef} from 'react'

function MapDragHandler({ setDragging }) { /* allows for dragging over map control div */
    useMapEvents({
        dragstart: () => setDragging(true),
        dragend: () => setDragging(false),
    });
};

function MapVisualisation({geo, metric, geos, presetGeoID, getPresetGeo, presetData, data, setShowBind, setFile, file, save}) {
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
            className='h-full rounded-r-md shadow-md z-0 relative'
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                /*url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"*/
                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
            />
            <GeoJSON data={geo} ref={geoRef} />
            <div className='font-mono w-60 absolute top-0 right-0 bg-white z-1000 m-3 rounded-lg shadow-lg grid p-3 gap-2 border border-gray-400 opacity-70 hover:opacity-100' onMouseOver={()=>{if (!dragging) setDrag(false)}} onMouseOut={()=>{if (!dragging) setDrag(true)}}>
                <div className='border border-gray-300 shadow-lg rounded-md w-full relative hover:border-gray-500'>
                    <select value={presetGeoID} className='appearance-none w-full pl-2 cursor-pointer' onChange={(e) => {getPresetGeo(Number(e.target.value))}}>
                        <option value={-1}>Custom</option>
                        {geos ? 
                            geos.map(
                                (g) => (
                                    <option value={g['geo_id']} key={g['geodata_id']}>{g['name']}</option>
                                )
                            ) : 
                            <></>
                        }
                    </select>
                    <div className='text-gray-600 pointer-events-none rounded-r-md top-0 absolute right-0 border-l bg-white px-1 pl-0.5 border-gray-300'>
                        &#8597;
                    </div>
                </div>
                <div className='grid gap-2 grid-cols-2'>
                    <label className='bg-white rounded-md cursor-pointer inline-block text-center border border-gray-300 hover:border-gray-500'>Import
                        <input type='file' className='hidden' onChange={(f)=>{setFile(f.target.files[0]); e.target.value = null}}/>
                    </label>
                    <button className={`bg-white cursor-pointer rounded-md border border-gray-300 hover:border-gray-500`} onClick={()=>save()}>Save</button>
                </div>
                <button className={`bg-blue-100 shadow-lg border border-blue-300 text-gray-600 rounded-full px-3 cursor-not-allowed opacity-40 ${presetData && data.length > 0 && `cursor-pointer opacity-100 hover:bg-blue-300 hover:text-black`}`} disabled={presetData && data.length > 0 ? false : true} onClick={() => setShowBind(true)}>Combine Custom & Preset</button>
            </div>
            <MapDragHandler setDragging={setDragging} />
        </MapContainer>
	)
}

export default MapVisualisation;