import Header from '../components/Header.tsx';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa'
import Dataset from '../components/Dataset'

function TutorialsPage() {
	const [search,setSearch] = useState('');
	const [ds, setDs] = useState([]) ; // variable to store and set list of datasets value
    const [searchDs, setSearchDs] = useState([]);
    const [public_, setPublic_] = useState(true);
    
    // function to fetch datasets from backend api
    useEffect(() => {
        fetch('http://localhost:8000/backend/get-datasets') // fetches json promise
            .then(r => r.json())
            .then(d => { // d holds datasets json
                setDs(d);
            });
    }, []);

    useEffect(()=>{
      if (ds.length == 0) return;
      if (search == '') return setSearchDs([]);
      const regex = new RegExp(search,'i'); /* case insensetive regex */
      setSearchDs(ds.filter((d)=>{
        return d['title'].match(regex) // /s.*/
      }));
    }, [search]);

	return (
		<div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
			<div className='row-start-1'>
	        	<Header name='Tutorials' desc='Take a look through some of our tutorials to get you started' />
	        </div>
	        <div className='px-3'>
	        	<div className='row-start-2 px-3 grid lg:grid-cols-3 sm:grid-cols-2 gap-3'>
	        		<div>
		        		<div className='bg-white text-sm rounded-xl shadow-xl px-3 opacity-50 hover:opacity-100 transition-all duration-300'>
		        			<h1 className='text-xl font-bold text-center'>Viewing Visualisations</h1>
		        			<div className='grid gap-3 rounded-md text-gray-600 pb-3'>
			        			<div className='border border-gray-500 rounded-xl p-1.5'>
				        			<p>All public visualisations can be found on the <Link className='text-blue-500 hover:underline' to={'/'}>Browse</Link> page.</p>
				        			<p>If you are struggling to find a dataset, or have a specific topic in mind, use the search bar. This will search for datasets by title:</p>
				        			<div className='mt-1'>
					        			<div className='flex justify-center'>
								            <input className='rounded-full mx-auto py-1 px-2 bg-white border border-gray-200 hover:border-gray-500 focus:border-gray-500' type='text' onChange={(e)=>setSearch(e.target.value)} placeholder='Serach...'/>
								        </div>
								        {search != '' &&
								            <div className='border mt-3 border-gray-300 rounded-md mx-auto'>
								                <div className='px-3 py-1 border-b border-gray-300 mx-2 shadow-b-md'>
								                    <h1 className='text-center'>Search Results</h1>
								                </div>
								                {searchDs.length > 0 ?
								                  <div className='grid max-h-50 overflow-scroll'>
								                    {searchDs.map(
								                      (d)=>(
								                        <Dataset key={d.set_id} dataset={d} />
								                      )
								                    )}
								                  </div> :
								                  <div>
								                    <p className='text-center p-5 text-gray-400'>No datasets match your search</p>
								                  </div>
								                }
								            </div>
								        }
								    </div>
				        		</div>
				        		<div className='grid gap-3'>
				        			<div className='border border-gray-500 rounded-xl px-1.5'>
				        				<p>Once a suitable dataset is found, click 'Visualise'. This will bring up the visualisations of the selected dataset: Maps, Charts and Tables</p>
				        				<p>On this page you will be able explore datasets, filter and save visualisations (expect for tables)</p>
				        			</div>
			        				<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
			        					<h2 className='text-lg font-bold text-center'>Filtering and Saving</h2>
			        					<p>Clicking the 'Filter' button will allow for you to select a metric from the dataset to filter through, an operator and a custom value to filter by. These can be removed at any time by going back to the filter screen and clicking the remove button on an applied filter</p>
			        					<p>The saving feature will download a png of the current visualisation (Map or Chart) directly to your downloads folder. For maps, this will capture an image of the current map positon, so make sure you are happy with the map position and then save</p>
			        				</div>
			        				<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
			        					<h2 className='text-lg font-bold text-center'>Maps</h2>
			        					<p>When in a Map visualisation you can select a metric that you wish to explore. This will show the information for that metric when hovering over features on a map</p>
			        					<p>If a feature is clicked, it will be displayed on the screen. Multiple features can be clicked allowing for easy comparison of data between geographic areas</p>
			        				</div>
			        				<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
			        					<h2 className='text-lg font-bold text-center'>Charts</h2>
			        					<p>While in Chart mode you can choose between a number of chart types: Bar, Scatter, Doughnut and Area</p>
			        					<p>Then after choosing a chart type, choose a metric for your x and y axes and your graph will be generated!</p>
			        				</div>
			        				<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
			        					<h2 className='text-lg font-bold text-center'>Tables</h2>
			        					<p>Tables are pretty simple, just displaying the data in a table format</p>
			        					<p>Sorting data is done through clicking of table headers. Clicking header for the first will sort in ascending order, clicking the same header will resort the data into descending order</p>
			        				</div>
			        			</div>
		        			</div>
		        		</div>
		        	</div>

		        	<div>
		        		<div className='bg-white text-sm rounded-xl shadow-xl px-3 opacity-50 hover:opacity-100 transition-all duration-300'>
		        			<h1 className='text-xl font-bold text-center'>Creating Visualisations</h1>
		        			<div className='grid gap-3 rounded-md text-gray-600 pb-3'>
			        			<div className='border border-gray-500 rounded-xl p-1.5'>
				        			<p>Creation and uploading of visualisations and datasets can be done on the <Link className='text-blue-500 hover:underline' to={'/create'}>Create</Link> page.</p>
				        		</div>
				        		<div className='border border-gray-500 rounded-xl p-1.5'>
				        			<p>On this page you will be able to upload and edit your very own geospatial data file, use a preset provided by another user, or combine the two by uploading your own dataset and binding it to a preset.</p>
				        		</div>
				        		<div className='border border-gray-500 rounded-xl p-1.5'>
				        			<p>You will also be able to give your dataset a custom name and description, and visualise what an upload of your dataset would look like for others.</p>
				        		</div>
				        		<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
				        			<h2 className='text-lg font-bold text-center'>Importing Data</h2>
				        			<p>Currently the supported data formats are as follows: <strong>CSV, JSON, GeoJSON</strong></p>
				        			<p>Any other data foramts will not be accepted and ignored.</p>
				        		</div>
				        		<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
				        			<h2 className='text-lg font-bold text-center'>Using Presets</h2>
				        			<p>There will be a select bar in the top right of your map you which will allow you to choose a preset to use.</p>
				        			<p>It's default will be 'Custom' which is your own imported data. Switching from a 'Custom' to a preset will not discard any imported data or changes made to it. Switching from a preset to custom <strong><u>will discard changes made</u></strong>.</p>
				        		</div>
				        		<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
				        			<h2 className='text-lg font-bold text-center'>Combing Custom Data and Preset</h2>
				        			<p>If you have imported data and are currently have a preset selected, you will be able to attempt to combine these datasets into one.</p>
				        			<p>The option to click the 'Combine Custom & Preset' will become avaliable.</p>
				        			<p>After clicking this you will be presented with two tables: <strong>selected preset and your imported data</strong>.</p>
				        			<p>Try to find a column in your table which matches the values of the 'Feature ID' column of the preset, or add in a new column and values that match the 'Feature ID' column.</p>
				        			<p>The column headers do not need to be the same, just the values.</p>
				        		</div>
				        		<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
				        			<h2 className='text-lg font-bold text-center'>Editing Data</h2>
				        			<p>After importing data or selecting a preset, a resizable table will be displayed on the left side of the screen. Clicking on column headers or data, will allow you to change their values. Columns can also be added or deleted.</p>
				        		</div>
				        		<div className='border border-gray-500 rounded-xl px-1.5 pb-1.5'>
				        			<h2 className='text-lg font-bold text-center'>Uploading Data</h2>
				        			<p>In order to upload data you must be logged into a registered <Link className='text-blue-500 hover:underline' to='/account'>Account</Link>. Datasets can either be uploaded as 'Public' <FaLockOpen className='inline'/> or 'Private' <FaLock className='inline'/>.</p>
				        			<p>Private means only the uploader can view it and it will not be displayed on the <Link className='text-blue-500 hover:underline' to={'/'}>Browse</Link> page. Public means all can view it and it will be displayed on the <Link className='text-blue-500 hover:underline' to={'/'}>Browse</Link> page</p>
				        		</div>
		        			</div>
		        		</div>
		        	</div>

		        	<div>
		        		<div className='bg-white text-sm rounded-xl shadow-xl px-3 opacity-50 hover:opacity-100 transition-all duration-300'>
		        			<h1 className='text-xl font-bold text-center'>Managing Visualisations & Account</h1>
		        			<div className='grid gap-3 rounded-md text-gray-600 pb-3'>
		        				<div className='border border-gray-500 rounded-xl p-1.5'>
		        					<p>If you have a registered <Link className='text-blue-500 hover:underline' to='/account'>Account</Link> and uploaded datasets, you will be able to update and view your datasets.</p>
		        					<p>The <Link className='text-blue-500 hover:underline' to='/account'>Account</Link> page will display all of your uploaded datasets, public <FaLockOpen className='inline'/> and private <FaLock className='inline'/>.</p>
		        					<p>Two graphs will also be shown, one to show any presets you have uploaded and how much they have been used, and another to show your datasets total views and saves.</p>
		        				</div>
		        				<div className='border border-gray-500 rounded-xl p-1.5'>
		        					<h2 className='text-lg font-bold text-center'>Setting a Dataset to Private</h2>
		        					<p>Every dataset will have either a <FaLockOpen className='inline' /> or <FaLock className='inline'/> to indicate if the dataset is a 'Public' or 'Private' upload.</p>
		        					<p>Clicking this icon will give you the option to set your preset to 'Public' or 'Private':</p>
			        				<div className='mx-auto flex gap-3 items-center justify-center'>
			        					<div className='relative'>
			        						<select onChange={(e)=>setPublic_(e.target.value == 'Public'?true:false)} value={public_ ? 'Public':'Private'} className='w-10 h-10 appearance-none outline-none cursor-pointer text-white border border-gray-300 hover:border-gray-500 rounded-md shadow-lg'>
			        							<option>Public</option>
			        							<option>Private</option>
			        						</select>
			        						<div className='absolute top-0 w-10 h-10 h-full pointer-events-none grid place-items-center'>{public_ ? <FaLockOpen title='Public' className='w-4 h-3 text-gray-500'/> : <FaLock title='Private' className='w-4 h-3 text-gray-500'/>}</div>
			        					</div>
			        					<p className='text-[9px]'>Upload would be {public_ ? 'public': 'private'}</p>
			        				</div>
		        				</div>
		        			</div>
		        		</div>
		        	</div>
	        	</div>
	       	</div>
	        <div className='h-32 bg-linear-to-r from-teal-800 to-teal-200 border-t row-start-3'/>
	    </div>
    )
}

export default TutorialsPage;