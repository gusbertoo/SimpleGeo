import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image'

function ZoomControl({show}) {
    const map = useMap();
    useEffect(() => {
        if (show) {
            map.addControl(map.zoomControl);
        } else {
            map.removeControl(map.zoomControl);
        }
    }, [map, show]);
}

function BrowseMapVisual({geo,setMode,addSave,title,setShowFilter,metrics}) {
    const geoRef = useRef();
    const ref = useRef<HTMLDivElement>(null);
    const [saving, setSaving] = useState(false)
    
    const save_ = useCallback(() => {
        if (ref.current === null) {
          return
        }
        setSaving(true);
        toPng(ref.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `${title}-map.png`
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {alert(err)})
            .finally(() => {setSaving(false);});
      }, [ref])

    const [metric, setMetric] = useState('');

    const metricVals = geo.features?.map((f) => {
        const val = f.properties?.[metric];
        if (val === "" || val == null) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
    }).filter(v => v !== undefined) || [];

    const min = Math.min(...metricVals);
    const max = Math.max(...metricVals);
    const [clicked2, setClicked2] = useState(new Map()) // variable to store all current features that have been clicked
    const [geoReset, setGeoReset] = useState(0);

    const norm = (v) => {
        if (v != '' && !isNaN(Number(v))) return (Number(v) - min) / (max - min);
        return NaN;
    }

    const colour = (nv) => {
        if (isNaN(nv)) return null;
        return `rgb(${200}, ${180*(1-nv)}, ${((1-nv)*110)+80})`;
    }

    const style = (f) => {
        const colour_ = colour(norm(f['properties'][metric]))
        return {
            fillColor: colour_ ? colour_ : '#e0e0e0',
            weight: 1.5,
            color: 'white',
            dashArray: 3,
            opacity: 1,
            fillOpacity: 0.7,
        }
    };

    useEffect(()=>{
        setGeoReset((prev)=>prev == 0 ? 1 :0)
    }, [geo]);

    useEffect(() => {
    if (!geoRef.current) return;
        geoRef.current.setStyle(style);
        geoRef.current.eachLayer((layer) => {
            const feature = layer.feature;
            const value = feature.properties?.[metric];
            layer.setTooltipContent(
                `${feature.id || feature.properties?.name || 'Unknown'}: ${value || 'N/A'}`
            );
        });
    }, [metric]);

    const onEachFeature = (feature, layer) => {
        const value = feature.properties?.[metric];

        layer.on({
            mouseover: (e) => {
                if (e.target.setStyle) {
                    e.target.setStyle({
                        weight: 2,
                        fillOpacity: 1,
                    });
                }
            },
            mouseout: (e) => {
                if (e.target.setStyle) {
                    e.target.setStyle({
                        weight: 1.5,
                        fillOpacity: 0.7,
                    });
                }
            },
            click: (e) => {
                const key     = e.target['_leaflet_id']
                const feature = e.target.feature
                setClicked2((prev) => {
                    return new Map(prev).set(key, {'feature':feature, show: true});
                });
            }
        });
        layer.bindTooltip(
            `${feature.properties.name || feature.id || 'Unknown'}: ${value || 'N/A'}`,
            { sticky: true }
        );
    };

    return (
        <div ref={ref} className='h-full relative w-full overflow-hidden'>
            <MapContainer
                className='h-full z-0'
                center={[51.505, -0.09]} 
                keyboard={false} /* prevents strange jump on first click on map */
                minZoom={2} 
                maxBounds={[[-90, -180], [90, 180],]} 
                maxBoundsViscosity={1.0} 
                zoom={2}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    /*url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"*/
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
                />
                <GeoJSON key={geoReset} data={geo} style={style} onEachFeature={onEachFeature} ref={geoRef}/>
                <ZoomControl show={!saving} />
            </MapContainer>
            <div className='absolute z-1000 top-3 right-3 grid gap-2'>
                <div className={`grid grid-cols-2 gap-2 ${saving && `hidden`}`}>
                    <div className='bg-white rounded-lg p-2 grid grid-cols-3 col-span-2 gap-2 border border-gray-400 opacity-70 hover:opacity-100 shadow-xl'>
                        <button className={`px-3 border border-red-200 bg-red-100 rounded-md cursor-pointer hover:bg-red-300`} onClick={()=>setMode('map')}>Map</button>
                        <button className={`px-3 border border-yellow-200 bg-yellow-100 rounded-md cursor-pointer hover:bg-yellow-200`} onClick={()=>setMode('chart')}>Chart</button>
                        <button className={`px-3 border border-purple-200 bg-purple-100 rounded-md cursor-pointer hover:bg-purple-300`} onClick={()=>setMode('table')}>Table</button>
                    </div>
                    <button onClick={()=>setShowFilter(true)} className='text-gray-600 text-sm border border-gray-400 rounded-md bg-white opacity-70 p-0.5 hover:opacity-100 cursor-pointer'>Filter</button>
                    <button onClick={()=>{save_();addSave()}} className='text-gray-600 text-sm text-sm border border-gray-400 rounded-md bg-white opacity-70 hover:opacity-100 cursor-pointer'>Save</button>
                </div>
                <select value={metric} className='text-gray-600 text-sm appearance-none rounded-lg px-2 shadow-xl border border-gray-400 cursor-pointer bg-white opacity-70 hover:opacity-100' onChange={(e)=>setMetric(e.target.value)}>
                    <option>{saving ? metric == '' ? 'No metric selected': metric : 'Choose a metric'}</option>
                    {metrics.map(
                        (h) => (
                            <option>{h}</option>
                        )
                    )}
                </select>
                <div className={`grid grid-cols-[auto_1fr] gap-2 p-1 items-center border bg-white shadow-xl rounded-lg border-gray-400 opacity-70 hover:opacity-100 text-gray-600 ${saving && `w-50`}`}>
                    <p className='text-xs'>Legend</p>
                    <div className='h-3 rounded shadow-lg border border-gray-200' style={{background: 'linear-gradient(to right, rgb(255,255,255), rgb(200,0,80))'}}/>
                    <div className='col-start-2 text-[8px] grid grid-cols-[auto_1fr_auto]'>
                        <p>{min}</p>
                        <p className='text-center'>{(max+min)/2}</p>
                        <p className='text-right'>{max}</p>
                    </div>
                </div>
            </div>
            <div className='absolute bottom-0 left-3 w-full pt-3 pointer-events-none overflow-scroll'>
                <div className='flex gap-2 relative'>
                    {[...clicked2].map(
                        ([key, value]) => (
                            <div onClick={()=>setClicked2((prev)=>new Map(prev).set(key, {'feature': value['feature'], show: !value['show']}))} className={`p-1 grid grid-rows-[auto_1fr] pointer-events-auto relative mt-auto flex-shrink-0 w-50 h-10 bg-white opacity-70 cursor-pointer rounded-t-lg border-x border-t border-gray-400 shadow-xl hover:opacity-100 transition-all duration-300  ${value['show'] && `h-100`}`}>
                                <button onClick={(e)=>{
                                    e.stopPropagation();
                                    setClicked2((prev)=>{
                                        const map = new Map(prev);
                                        map.delete(key);
                                        return map;
                                    })
                                }} className='pointer-events-auto absolute top-0 right-0 translate-x-1/3 -translate-y-1/2 z-1000 bg-red-300 border border-red-500 px-1.5 rounded-full text-center text-sm cursor-pointer hover:bg-red-400'>-</button>
                                <div>
                                    <h2 className='text-sm bold text-center'>{value.feature.properties.name || value.feature.id || 'Unknown'}</h2>
                                </div>

                                <div className='border border-gray-300 px-2 rounded-md text-xs text-gray-700 grid gap-1 h-full overflow-scroll'>
                                    {Object.keys(value.feature.properties).map(
                                        (h) => (
                                            <p>- {h}: {value.feature.properties[h]}</p>
                                        )
                                    )}
                                </div>
                            </div>
                        )
                    )}

                </div>
            </div>
        </div>
    )
}

export default BrowseMapVisual;