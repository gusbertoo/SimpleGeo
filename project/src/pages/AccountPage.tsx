import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import Dataset from '../components/Dataset_account.tsx';
import Update from '../components/UpdateDataset.tsx';
import axios from 'axios'; axios.defaults.withCredentials = true;
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2'

defaults.maintainAspectRatio = false;
defaults.responsive = true

function AccountPage() {
	const [loggedIn, setLoggedIn] = useState(null);
	const [showLogout, setShowLogout] = useState(false);
	const [showDeleteAccount, setShowDeleteAccount] = useState(false);
	const [showDeletePreset, setShowDeletePreset] = useState(null);
	const [datasets, setDatasets] = useState([]);
	const [presets, setPresets] = useState(null);
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState('');
	const [labels, setLabels] = useState([]);
	const [showLabelList, setShowLabelList] = useState(true);
	const [presetData, setPresetData] = useState([]);
	const [update, setUpdate] = useState(null);
	const [showCancelUpdate, setShowCancelUpdate] = useState(false);

	useEffect(() => {
		(async () => {
			try {
		    	const response = await axios.get('http://localhost:8000/backend/current-user');
		    	if (response.data['username']) {
		    		getUserSets();
		    		setUsername(response.data['username']);
		    		return setLoggedIn(true);
		    	}
		    } catch (err) {
		    	alert(err);
		    }
		    return setLoggedIn(false);
		})();
	},[loggedIn]);

	const getUserSets = async () => {
		try {
			const response = await axios.post('http://localhost:8000/backend/user-sets');
			setDatasets(response.data.datasets);
			setPresets(response.data.presets);
			setLabels(response.data.presets.map((p)=>p['name']));
			setPresetData(response.data.presets.map((p)=>p['usage']));
			setLoading(false);
		} catch (err) {
			alert(err);
		}
	}

	const deletePreset = async (id) => {
		try {
			const fd = new FormData();
			fd.append('id',id);
			const response = await axios.post('http://localhost:8000/backend/delete-preset',fd);
			getUserSets();
		} catch (err) {
			alert(err);
		}
	}

	const logout = async () => {
		await axios.post('http://localhost:8000/backend/logout');
		setLoggedIn(null);
	};

	const deleteAccount = async () => {
		await axios.post('http://localhost:8000/backend/delete-account');
		setLoggedIn(null);
	}

	if (loggedIn == null) {
		return (
			<div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
				<div className='row-start-1'>
					<Header name='' desc='' />
				</div>
				<div className='h-32 bg-teal-700 row-start-3'/>
			</div>
		)
	} else if (loggedIn) {
		return (
			<div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
				<div className='row-start-1'>
					<Header name={`Account: ${username}`} desc='View and manage all your uploaded datasets' />
				</div>
				<div className='row-start-2 px-3 w-screen'>
					<div className='grid grid-cols-3 grid-rows-2 gap-3 h-200 sm:h-200 md:h-100 lg:h-125 max-w-full 2xl:w-500 xl:w-300 2xl:h-200 mx-auto'>
						<div className='bg-white rounded-xl shadow-md px-3 min-h-0 grid grid-rows-[auto_1fr] gap-3 md:col-span-2 col-span-3 row-span-2 max-h-200'>
							<div className='p-1 border-b bg-white'>
								<h1 className='text-center text-xl'>Datasets</h1>
							</div>
							<div className='border border-gray-100 rounded-xl mb-3 p-3 grid md:grid-cols-2 2xl:grid-cols-3 overflow-scroll'>
								{loading ? 
									<p>loading...</p> :
									<>
										{datasets.length > 0 ?
											<>
												{datasets.map(
													(d) => (
														<Dataset key={d.set_id} dataset={d} username={username} getUserSets={getUserSets} setUpdate={setUpdate} />
													)
												)}
											</> :
											<p className='grid place-items-center col-span-3 text-center'>You have no uploaded datasets</p>
										}
									</>
								}
							</div>
						</div>
						<div className='bg-white rounded-xl shadow-md px-3 grid grid-rows-[auto_1fr] col-span-3 md:col-span-1'>
							<div className='p-1 border-b bg-white'>
								<button className='text-gray-300 text-xs absolute mt-2' onClick={() => {setShowLabelList((prev)=>!prev);}}>{showLabelList ?  'hide' : 'show'}</button>
								<h1 className='text-center text-xl'>Preset Usage</h1>
							</div>
								{loading ? 
									<p>loading...</p> :
									<div className='grid grid-cols-[auto_1fr] place-items-center min-h-0'>
										<div className={`h-full overflow-hidden bg-white border-r border-gray-200 shadow-r-md transition-all duration-300 text-xs ${showLabelList ? `w-30` : `w-0 border-white`}`}>
											<ul>
												{presets.map((p)=>(
													<div className='flex p-1 items-center'>
														<li className='truncate mr-1'>{p['name']}</li>
														<button className='py-0.5 px-1.5 rounded-full bg-red-200 border border-red-400 ml-auto cursor-pointer hover:bg-red-400' onClick={()=>{setShowDeletePreset(p['geo_id'])}}>-</button>
													</div>
												))}
											</ul>
										</div>
										<div className='flex justify-center h-full w-full overflow-scroll min-h-0'>
											<Bar 
												data={{
													labels: labels,
													datasets: [
														{label:'No. times preset used', data: presetData},
													]
												}} 
											/>
										</div>
									</div>
								}
						</div>
						<div className='bg-white rounded-xl shadow-md px-3 grid grid-rows-[auto_1fr] col-span-3 md:col-span-1'>
							<div className='p-1 border-b bg-white'>
								<h1 className='text-center text-xl'>Dataset Usage</h1>
							</div>
								{loading ? 
									<p>loading...</p> :
									<div className='grid place-items-center min-h-0'>
										<div className='flex justify-center h-full w-full overflow-scroll min-h-0'>
											<Bar 
												data={{
													labels: datasets.map((d)=>d['title']),
													datasets: [
														{label:'No. views', data: datasets.map((d)=>d['views'])},
														{label:'No. saves', data: datasets.map((d)=>d['saves'])}
													]
												}} 
											/>
										</div>
									</div>
								}
						</div>
						<div className='w-100 grid grid-cols-2 gap-2 col-span-3 ml-auto'>
							<button className='p-1 bg-white rounded-lg border border-gray-200 shadow-md hover:border-gray-400 cursor-pointer' onClick={()=>setShowLogout(true)}>Logout</button>
							<button className='p-1 bg-red-300 border border-red-400 rounded-lg shadow-md cursor-pointer hover:bg-red-500 hover: border-red-600' onClick={()=>setShowDeleteAccount(true)}>Delete Account</button>
						</div>
					</div>
				</div>
				<div className='h-32 bg-linear-to-r from-teal-800 to-teal-200 border-t row-start-3'/>

				{showLogout &&
	            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
	                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
	                        <h2 className="font-bold mb-3">Are you sure you want to logout?</h2>

	                        <div className="flex justify-center gap-2">
	                            <button onClick={() => setShowLogout(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
	                            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={()=>logout()}>Yes</button>
	                        </div>
	                    </div>
	                </div>
	            }
	            {showDeleteAccount &&
	            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
	                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
	                        <h2 className="font-bold mb-3">Are you sure you want to delete this account? All datasets along with presets will be deleted</h2>

	                        <div className="flex justify-center gap-2">
	                            <button onClick={() => setShowDeleteAccount(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
	                            <button onClick={() => deleteAccount()} className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">Yes</button>
	                        </div>
	                    </div>
	                </div>
	            }
	            {showDeletePreset &&
	            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
	                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
	                        <h2 className="font-bold mb-3">Are you sure you want to delete this preset? It will no longer be avaliable for users (previously created datasets will not be affected)</h2>

	                        <div className="flex justify-center gap-2">
	                            <button onClick={() => setShowDeletePreset(null)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
	                            <button onClick={() => {deletePreset(showDeletePreset); setShowDeletePreset(null);}} className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">Yes</button>
	                        </div>
	                    </div>
	                </div>
	            }
	            {update &&
	            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
	            		<div className='w-9/10 overflow-hidden'>
	            			<button onClick={()=>setShowCancelUpdate(true)} className='cursor-pointer bg-white border border-gray-300 shadow-lg rounded-full px-3 py-1 text-lg flex items-center mb-2 hover:bg-red-400 hover:border-gray-700'>x</button>
	                    	<Update dataset={update} setUpdate={setUpdate} getUserSets={getUserSets} />
	                    </div>
	                </div>
	            }
	            {showCancelUpdate &&
	            	<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
	                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
	                        <h2 className="font-bold mb-3">Are you sure you want to close this window? Any changes made will not be saved</h2>

	                        <div className="flex justify-center gap-2">
	                            <button onClick={() => setShowCancelUpdate(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
	                            <button onClick={() => {setUpdate(null); setShowCancelUpdate(false)}} className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">Yes</button>
	                        </div>
	                    </div>
	                </div>
	        	}
			</div>
		)
	} else {
		return <Navigate to='/login'/>
	}
}

export default AccountPage;