import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; axios.defaults.withCredentials = true;
import Header from '../components/Header';
import TableVisualisation from '../components/TableVisualisation';
import MapVisualisation from '../components/MapVisualisation';
import FileSideBar from '../components/FileSideBar2'
import {Resizable} from 'react-resizable'
import "react-resizable/css/styles.css";

function UpdatePage() {
	const [username, setUsername] = useState(null);
	const nav = useNavigate();

	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');
	const [file, setFile] = useState(null);

	const [geos, setGeos] = useState(null);
	const [geo, setGeo] = useState(null);
	const [presetGeo, setPresetGeo] = useState(null);
	const [presetGeoID, setPresetGeoID] = useState(-1);
	const [data, setData] = useState({});
	const [presetData, setPresetData] = useState(null);

	const [s_width, setS_width] = useState(150);
	const [maxSWidth, setMaxSWidth] = useState(0);
	const [isResizing, setIsResizing] = useState(false);

	const [metric, setMetric] = useState("");

	const [showBind, setShowBind] = useState(false);
	const [showClear, setShowClear] = useState(false);
	const [showUpload, setShowUpload] = useState(false);
	const [showUploadPreset, setShowUploadPreset] = useState(false);

	const containerRef = useRef(null);

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

    const clear = () => {
    	
    }

	const save2 = (upload) => { /* https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js */
		const blob = new Blob([JSON.stringify(upload)], { type: 'application/geo+json' });
		const url = window.URL.createObjectURL(blob);

	    const link = document.createElement('a');
	    link.href = url;
	    link.setAttribute(
	    	'download',
	    	`${title ? title: `data`}.geojson`,
	    );

	    // Append to html link element page
	    document.body.appendChild(link);

	    // Start download
	    link.click();

	    // Clean up and remove the link
	    link.parentNode.removeChild(link);
	}

	const LeftResizeHandle = (props: any) => (
		<div
			{...props}
		    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-400 bg-gray-100"
		/>
	);

	const handleUpload = (upload) => {
		setShowUpload(false);
		if (title == "") {
			return alert('The title cannont be empty!')
		} else if (!upload || !upload['features'] || upload['features'].length == 0) {
			return alert('The current cannot be uploaded, please try again');
		} else if (upload['features'][0]['id'] && !presetGeo) {
			return setShowUploadPreset(true)
		}
		uploadGeo(upload);
	};

	const uploadGeo = async (upload) => {
		try {
			const fd = new FormData();
        	fd.append('username', username);
        	fd.append('title', title);
        	fd.append('desc', desc);
        	fd.append('public', document.getElementById('upload_type').value)
        	fd.append('dataset', JSON.stringify(upload));
        	fd.append('preset', presetGeoID);
        	const response = await axios.post('http://localhost:8000/backend/upload-geo',fd,);
        	nav(`/view/${response.data['success']}`);
		} catch (err) {
			alert(err)
		}
	};

	const uploadPreset = async (upload) => {
		const preset = {...upload,
            features: upload['features'].map(
                (f) => ({
                    ...f,
                    properties: {}
                })
            )
        };
        try {
        	const fd = new FormData();
        	fd.append('username', username);
        	fd.append('name', title);
        	fd.append('geodata', JSON.stringify(preset));
        	const response = await axios.post('http://localhost:8000/backend/upload-preset',fd,);
        } catch (err) {
        	console.log(err);
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
		return () => resizeObserver.disconnect(); // clean up 
    }, [s_width]);

	return (
		<div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
			<div className='row-start-1'>
				<Header name='Create' desc='Design your very own datasets and visualisations' />
			</div>

			<div className='p-3 row-start-2 grid grid-cols-[3fr_1fr] h-full max-w-screen 2xl:w-800 w-300 mx-auto gap-3'>
				<div className='col-start-1 col-span-2 md:col-span-1 2xl:h-250 xl:h-180 md:h-140 h-80 rounded-md z-0 overflow-hidden'>
					<div ref={containerRef} id='map_table_container' className={`h-full w-full grid overflow-hidden`} style={{gridTemplateColumns: `${data.length > 0 || presetData ? s_width: 0}px 1fr`,}}>
						<div className={`h-full col-start-2`}>
							<MapVisualisation geo={presetGeo ? presetGeo: geo } metric={metric} geos={geos} getPresetGeo={getPresetGeo} presetData={presetData} data={data} setShowBind={setShowBind} />
						</div>
						{data.length > 0 || presetData ?
							<Resizable className='col-start-1 row-start-1' width={s_width} height={0} axis="x" resizeHandles={["e"]} handle={<LeftResizeHandle />} onResize={(e, { size }) => {setS_width(size.width); setIsResizing(true);}} onResizeStop={(e, { size }) => {window.dispatchEvent(new Event("resize")); setIsResizing(false);}} minConstraints={[50, 0]} maxConstraints={[maxSWidth, 0]}>
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

				<div className={`col-start-1 font-mono col-span-2 lg:col-span-1 md:col-start-2 grid grid-rows-[1fr_auto_auto] h-150`}>
					<div className='w-full h-full bg-white rounded-md p-3 row-start-1 grid grid-rows-[auto_1fr]'>
						<input type='text' placeholder='Title...' spellCheck='false' value={title} onChange={(e)=>{setTitle(e.target.value)}} className={`w-full text-1xl rounded-md border border-gray-300 px-1 ${title != "" ? 'underline font-bold' : ''}`}/>
						<textarea placeholder='description...' className='px-2 w-full border border-gray-300 mt-1 resize-none rounded-md' onChange={(d) => setDesc(d.target.value)}/>
					</div>

					<div className='w-full row-start-2'>
						{/*<div className='grid grid-cols-2 gap-1 p-3 w-full'>*/}
						<div className='py-3 px-5'>
							<div className='flex'>
								<div className='px-1 w-full'>
									<label className='bg-white w-full shadow-md rounded-md cursor-pointer inline-block text-center'>Import
										<input type='file' className='hidden' onChange={(f) => setFile(f.target.files[0])}/>
									</label>
								</div>
								<div className='px-1 w-full'>
									<button className='bg-white w-full shadow-md rounded-md cursor-pointer' onClick={()=>setShowClear(true)}>Clear</button>
								</div>
							</div>
							<div className='p-1 flex justify-center'>
								<button className={`bg-white shadow-md rounded-md w-1/2 ${username != null && `cursor-pointer`}`} onClick={()=>save2(presetGeo)}>Save</button>
							</div>
						</div>
					</div>

					<div className='flex'>
						<button className={`bg-white shadow-md rounded-md w-3/4 ${username ? `cursor-pointer`: `cursor-not-allowed`}`} disabled={username==null} onClick={()=>setShowUpload(true)}>Upload</button>
						<select id='upload_type'>
							<option>Public</option>
							<option>Private</option>
						</select>
					</div>
				</div>
			</div>

			<div className='h-32 bg-teal-700 row-start-3'>
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
                            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={()=>window.location.reload()}>Yes</button>
                        </div>
                    </div>
                </div>
            }

            {showUpload &&
            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
                        <h2 className="font-bold mb-3">Are you sure you want to upload current dataset?</h2>

                        <div className="flex justify-center gap-2">
                            <button onClick={() => setShowUpload(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={()=>{handleUpload( presetGeo ? presetGeo: geo )}}>Yes</button>
                        </div>
                    </div>
                </div>
            }

            {showUploadPreset &&
            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
                        <h2 className="font-bold mb-3">Your dataset meets the requirements to be used as preset. Would you like to upload a preset for others to use?</h2>

                        <div className="flex justify-center gap-2">
                            <button onClick={() => {setShowUploadPreset(false); uploadGeo(presetGeo ? presetGeo: geo)}} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={()=>{setShowUploadPreset(false); uploadPreset(presetGeo ? presetGeo: geo); uploadGeo(presetGeo ? presetGeo: geo);}}>Yes</button>
                        </div>
                        <div className='flex justify-center mt-2'>
                        	<button className='px-3 py-1 bg-gray-200 rounded cursor-pointer' onClick={()=>setShowUploadPreset(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            }

		</div>
	)
};

export default UpdatePage;