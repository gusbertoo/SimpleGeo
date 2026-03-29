import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaLockOpen } from 'react-icons/fa'
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from 'axios'; axios.defaults.withCredentials = true;
import Header from '../components/Header';
import TableVisualisation from '../components/TableVisualisation';
import MapVisualisation from '../components/MapVisualisation';
import Preview from '../components/PreviewDataset';
import Update from '../components/UpdateDataset';
import Map from '../components/BrowseMapVisual';
import FileSideBar from '../components/FileSideBar2';
import {Resizable} from 'react-resizable';
import "react-resizable/css/styles.css";

function UpdateDataset({dataset, setUpdate, getUserSets}) {
	console.log(dataset);
	const [username, setUsername] = useState(null);
	const nav = useNavigate();

	const [title, setTitle] = useState(dataset.title);
	const [desc, setDesc] = useState(dataset.description);
	const [file, setFile] = useState(null);
	const [public_, setPublic] = useState(dataset.public);

	const [geos, setGeos] = useState(null);
	const [geo, setGeo] = useState(dataset.dataset);
	const [presetGeo, setPresetGeo] = useState(null);
	const [presetGeoID, setPresetGeoID] = useState(-1);
	const [data, setData] = useState(dataset.dataset['features'].map((f)=>f?.['properties']));
	const [presetData, setPresetData] = useState(null);

	const [s_width, setS_width] = useState(150);
	const [maxSWidth, setMaxSWidth] = useState(0);
	const [isResizing, setIsResizing] = useState(false);

	const [showBind, setShowBind] = useState(false);
	const [showClear, setShowClear] = useState(false);
	const [showUpdate, setShowUpdate] = useState(false);
	const [showUploadPreset, setShowUploadPreset] = useState(false);
	const [showPreview, setShowPreview] = useState(false);

	const containerRef = useRef(null);

	const clear = () => {
		setTitle('');
		setDesc('');
		setFile(null);
		setPublic(true);
		setGeo(null);
		setPresetGeo(null);	
		setPresetGeoID(-1);
		setData({});
		setPresetData(null);
		setShowClear(false);
    }

    const getPresetGeo = (id) => {
    	setPresetGeoID(id);
    	const geo_ = geos.find((g) => g['geo_id'] == id);
    	if (geo_) {
    		const temp = {...geo_}
			setPresetData(temp['geodata']['features'].map(
				(f) => f['properties']
			));
    		return setPresetGeo(temp['geodata']);
    	}
    	window.dispatchEvent(new Event("resize"))
    	setPresetGeo(null);
    	setPresetData(null);
    }

    const bind = (v) => {
    	const dataHeaders = Object.keys(data[0]).filter(k => k !== v);
    	var idFound = false;

		const dataLookup = data.reduce((acc, d) => { /* converts array of objects into single object with key based on v (user input) for lookup in temp for each */
			const { [v]: key, ...rest } = d
			acc[key] = rest
			return acc
		}, {});

		const temp = {
            ...presetGeo,
            features: presetGeo['features'].map(
                (f) => ({
                    ...f
                })
            )
        };

		temp['features'].forEach(
			(f) => {
				if (dataLookup[f['id']]) {
					f['properties'] = {...f['properties'], ...dataLookup[f['id']]};
					idFound = true;
				} else {
					const tempProps = {}
					dataHeaders.forEach(
						(k) => {
							if (!f['properties'][k]) {
								tempProps[k] = ""
							}
						}
					);
					f['properties'] = {...f['properties'], ...tempProps};
				}
			}
		);

		if (idFound) {
			setPresetGeo(temp);
			setPresetData([...temp['features'].map(
				(f) => ({...f['properties']})
			)]);
		};

    };

	const save2 = () => { /* https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js */
		const upload = presetGeo ? presetGeo : geo;
		const blob = new Blob([JSON.stringify(upload)], { type: 'application/geo+json' });
		const url = window.URL.createObjectURL(blob);

	    const link = document.createElement('a');
	    link.href = url;
	    link.setAttribute(
	    	'download',
	    	`${title ? title: `data`}.geojson`,
	    );

	    document.body.appendChild(link);
	    link.click();
	    link.parentNode.removeChild(link);
	}

	const LeftResizeHandle = (props: any) => (
		<div
			{...props}
		    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-400 bg-gray-100"
		/>
	);

	const handleUpdate = (upload) => {
		setShowUpdate(false);
		if (title == "") {
			return alert('The title cannont be empty!')
		} else if (!upload || !upload['features'] || upload['features'].length == 0) {
			return alert('The current dataset cannot be update, please try again');
		}
		updateGeo(upload);
	};

	const updateGeo = async (upload) => {
		try {
			const fd = new FormData();
			fd.append('id', dataset.set_id);
        	fd.append('title', title);
        	fd.append('desc', desc == null ? '':desc);
        	fd.append('public', public_);
        	fd.append('dataset', JSON.stringify(upload));
        	fd.append('preset', presetGeoID);
        	const response = await axios.post('http://localhost:8000/backend/update-geo',fd,);
        	setUpdate(null);
        	getUserSets();
        	alert('Update Successful');
		} catch (err) {
			alert(err)
		}
	};

	useEffect(() => {
		if (!file) return;
		(async () => {
			try {
		        const fd = new FormData();
		        fd.append('file', file);
		        const response = await axios.post('http://localhost:8000/backend/get-file',fd,);
		        setGeo(response.data.geo);
		        setData(response.data.data);
		    } catch (err) {
		    	console.log(err);
		    }
    	})();
	}, [file]);

	useEffect(() => { /* function to fetch all preset geodata sets */
        fetch('http://localhost:8000/backend/get-geodatas')
            .then(r => r.json())
            .then(g => {
                setGeos(g);
            });
    }, []);

    useEffect(() => { /* funtion to get the current user, i.e. if they are logged in and who the upload is made by */
		(async () => {
			const response = await axios.get('http://localhost:8000/backend/current-user');
			if (response.data['username']) {
				setUsername(response.data['username']);
			}
		})()
    }, []);

    useEffect(()=>{ /* to resize table sizbar depending on the size of the container div (map_table_container) */
    	if (!containerRef.current) return;
		const resizeObserver = new ResizeObserver(() => {
			if (document.getElementById('map_table_container')) {
				const ele_width = document.getElementById('map_table_container').offsetWidth;
				if (s_width == maxSWidth) setS_width(ele_width);
				setMaxSWidth(ele_width);
				if (s_width > ele_width) setS_width(ele_width);
			}
		});
		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
    }, [s_width]);

    useEffect(()=>{
    	if (!geo) return;
    	setGeo(prev => ({...prev, features: prev.features.map((f, i) => ({
    		...f,
    		properties: {
    			...f.properties,
    			...data[i]
    		}
    	}))}));
    }, [data])

    useEffect(()=>{
    	if (!presetGeo) return;
    	setPresetGeo(prev => ({...prev, features: prev.features.map((f, i) => ({
    		...f,
    		properties: {
    			...f.properties,
    			...presetData[i]
    		}
    	}))}));
    }, [presetData])

	return (
		<div className='bg-gray-100 gap-3 overflow-hidden font-mono rounded-xl'>
			<div>
				<div className='p-3 row-start-2 grid grid-cols-[3fr_1fr] mx-auto gap-3'>
					<div className='col-start-1 col-span-2 md:col-span-1 2xl:h-200 xl:h-150 md:h-120 sm:h-80 h-50 rounded-md overflow-hidden'>
						<div ref={containerRef} id='map_table_container' className={`h-full w-full grid overflow-hidden`} style={{gridTemplateColumns: `${data.length > 0 || presetData ? s_width: 0}px 1fr`,}}>
							<div className={`h-full col-start-2`}>
								<MapVisualisation save={save2} setFile={setFile} file={file} presetGeoID={presetGeoID} geo={presetGeo ? presetGeo: geo } geos={geos} getPresetGeo={getPresetGeo} presetData={presetData} data={data} setShowBind={setShowBind} />
							</div>
							{data.length > 0 || presetData ?
								<Resizable className='col-start-1 row-start-1' width={s_width} height={0} axis="x" resizeHandles={["e"]} handle={<LeftResizeHandle />} onResize={(e, { size }) => {setS_width(size.width); setIsResizing(true);}} onResizeStop={(e, { size }) => {window.dispatchEvent(new Event("resize")); setIsResizing(false);}} minConstraints={[20, 0]} maxConstraints={[maxSWidth, 0]}>
									<div className='min-h-0 bg-white p-3 overflow-hidden'>
										<div className={`${isResizing ? `overflow-hidden`: `overflow-scroll`} min-h-0 h-full col-start-2 rounded-md border border-gray-300 relative`}>
											<TableVisualisation data={presetData ? presetData: data} geo={presetGeo ? presetGeo: geo} presetGeo={presetGeo} setData={presetData ? setPresetData: setData} setGeo={presetGeo ? setPresetGeo: setGeo} />
										</div>
									</div>
								</Resizable> :
								<></>
							}
						</div>
					</div>
					<div className={`col-start-1 font-mono col-span-2 lg:col-span-1 md:col-start-2 grid grid-rows-[1fr_auto_auto]`}>
						<div className='w-full h-full bg-white rounded-md p-3 row-start-1 grid grid-rows-[auto_1fr]'>
							<input type='text' placeholder='Title...' spellCheck='false' value={title} onChange={(e)=>{setTitle(e.target.value)}} className={`w-full text-1xl rounded-md border border-gray-300 px-1 ${title != "" ? 'underline font-bold' : ''}`}/>
							<textarea value={desc} placeholder='description...' className='px-2 min-h-30 w-full border border-gray-300 mt-1 resize-none rounded-md' onChange={(d) => setDesc(d.target.value)}/>
						</div>

						<div className='row-start-2 grid grid-cols-2 gap-2 p-3'>
							<button onClick={()=>setShowClear(true)} className='bg-white rounded-md shadow-lg border border-gray-300 cursor-pointer hover:border-gray-500 hover:text-black text-gray-500'>
								Clear
							</button>
							<button 
								onClick={()=>{
									if (!presetGeo && !geo) return alert('Nothing to preview!');
									setShowPreview((prev)=>!prev)
								}} 
								className='bg-white rounded-md shadow-lg border border-gray-300 cursor-pointer hover:border-gray-500 hover:text-black text-gray-500'>
								Preview
							</button>
							<div onClick={()=>!username && alert('Must be logged into a registered account to upload')} className='col-span-2'>
								<div className={`grid grid-cols-[1fr_auto] w-1/2 mx-auto ${!username && `cursor-not-allowed`}`}>
				                	<button className={`bg-blue-100 border border-gray-300 shadow-lg rounded-l-md text-gray-500 ${username ? `cursor-pointer hover:bg-blue-300 hover:text-black`: `cursor-not-allowed`}`} onClick={()=>setShowUpdate(true)}>Update</button>
				                	<div className='bg-blue-50 hover:bg-blue-100 border-r border-y border-gray-300 rounded-r-md relative'>
				                		<select value={public_ ? 'Public':'Private'} onChange={(e)=>{e.target.value == 'Public' ? setPublic(true):setPublic(false)}} id='upload_type' className={`appearance-none outline-none pl-0.5 w-5 bg-blue-100 ${!username && `pointer-events-none`} text-blue-100 ${username && `hover:bg-blue-300 hover:text-blue-300 cursor-pointer`} rounded-r-sm`}>
				                			<option>Public</option>
				                			<option>Private</option>
				                		</select>
				                		<div className='w-5 h-full text-sm text-gray-500 pointer-events-none top-0 absolute rounded-r-md right-0 border-gray-300 grid place-items-center'>
				                			{public_ ? <FaLockOpen />:<FaLock />}
				                		</div>
				                	</div>
				                </div>
				            </div>
						</div>
					</div>
				</div>
			</div>

			{showBind &&
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
				    <div className='bg-white p-3 rounded-4xl shadow-xl max-h-8/10 max-w-5/10 gap-2 grid grid-rows-[0.5fr_5fr_1fr]'>
				    	<div className='row-start-1 flex justify-center items-center'>
				    		<p className="font-bold underline md:text-xl ">Add custom data to current preset</p>
				    	</div>
				    	<div className='row-start-2 grid rounded-md overflow-hidden'>
					    	<div className='grid grid-cols-[1fr_3fr] gap-2 overflow-hidden'>
						    	<div className='col-start-1 border border-gray-300 rounded-md overflow-scroll h-full col-start-1'>
							    	<TableVisualisation data={presetData} geo={presetGeo} presetGeo={presetGeo} setData={setPresetData} setGeo={setPresetGeo}/>
						    	</div>
							    <div className='col-start-2 border border-gray-300 rounded-md col-start-2 overflow-scroll'>
							    	<TableVisualisation data={data} geo={geo} presetGeo={null} setData={setData} setGeo={setGeo} />
							    </div>
							</div>
						</div>

						<div className='row-start-3 rounded-md'>
							<div className='col-start-1 border border-gray-300 rounded-md p-3 grid grid-cols-[3fr_1fr]'>
								<div className='px-2'>
									<p className='text-sm text-center font-bold'>Select a field that matches the values of the Feature ID</p>
								</div>
								<div className='flex items-center justify-center'>
									<select id='binder' className='row-start-1'>
							    		<option>None</option>
							    		{Object.keys(data[0]).map(
							    			(d,i) => (
							    				<option key={i}>{d}</option>
							    			)
							    		)}
							    	</select>
							    </div>
						    </div>
						    <div className='col-start-2 flex items-center justify-center gap-2 mt-1'>
					    		<button className='row-start-1 gap-2 px-3 py-1 bg-gray-200 rounded cursor-pointer' onClick={()=>{setShowBind(false)}}>Cancel</button>
					    		<button className='row-start-1 px-3 py-1 bg-blue-500 text-white rounded cursor-pointer' onClick={()=>bind(document.getElementById('binder').value)}>Add</button>
					    	</div>
					    </div>
				    </div>
				</div>
			}

			{showClear &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
                        <h2 className="font-bold mb-3">Are you sure you want to clear current dataset?</h2>

                        <div className="flex justify-center gap-2">
                            <button onClick={() => setShowClear(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={()=>clear()}>Yes</button>
                        </div>
                    </div>
                </div>
            }

            {showUpdate &&
            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
                        <h2 className="font-bold mb-3">Are you sure you want to update current dataset?</h2>
                        <h2 className='flex mb-3 text-sm text-gray-600'>Visibilty:
                        	<div className='bg-white border border-gray-300 rounded relative ml-1'>
		                		<select onChange={(e)=>{e.target.value == 'Public' ? setPublic(true):setPublic(false)}} value={public_ ? 'Public' : 'Private'} className='appearance-none outline-none pl-0.5 pr-6'>
		                			<option>{'Public'}</option>
		                			<option>{'Private'}</option>
		                		</select>
		                		<div className='text-gray-600 pointer-events-none top-0 absolute  right-0 border-l bg-white px-1 border-gray-300'>
		                			&#8597;
		                		</div>
	                		</div>
                		</h2>

                        <div className="flex justify-center gap-2">
                            <button onClick={() => setShowUpdate(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={()=>{handleUpdate( presetGeo ? presetGeo: geo )}}>Yes</button>
                        </div>
                    </div>
                </div>
            }

            {showPreview &&
	            <div className='fixed inset-0 bg-black/40 z-50 grid items-center'>
	            	<div className='relative mx-auto w-8/10 overflow-hidden'>
	            		<button onClick={()=>setShowPreview(false)} className='cursor-pointer bg-white border border-gray-300 shadow-lg rounded-full px-3 py-1 text-lg flex items-center mb-2 hover:bg-red-400 hover:border-gray-700'>x</button>
	            		<Preview geo_={presetGeo ? presetGeo : geo} title={title} description={desc} />
	            	</div>
	            </div>
            }

		</div>
	)
};

export default UpdateDataset;