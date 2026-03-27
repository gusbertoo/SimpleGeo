function Filter ({setShowFilter,metrics,setFilters,filters}) {
	const addFilter = () => {
		const metric = document.getElementById('metric').value;
		const term = document.getElementById('term').value;
		const operator = document.getElementById('operator').value;
		if (metric == '') {
			setShowFilter(false);
			return alert('Cannot filter on a non-existant metric!');
		}
		else if (term == '') {
			return alert('Value cannot be left empty!');
		}
		setFilters((prev)=>(
			{...prev, [metric]:prev[metric] ? [...prev[metric], operator+term]: [operator+term]}
		));
	}

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-1000000">
            <div className="bg-white p-5 rounded-md shadow-lg w-80 grid gap-2">
                <h2 className="font-bold text-center">Filter Dataset</h2>
                <div className='grid grid-cols-[1fr_auto_1fr] gap-2 w-full items-center'>
                	<div className='w-full  bg-white border border-gray-300 rounded relative'>
                		<select id='metric' className='w-full appearance-none outline-none'>
                			{metrics.map(
                				(m) => (
                					<option>{m}</option>
                				)
                			)}
                		</select>
                		<div className='text-gray-600 pointer-events-none top-0 absolute  right-0 border-l bg-white px-1 border-gray-300'>
                			&#8597;
                		</div>
                	</div>
                	<div className='w-full  bg-white border border-gray-300 rounded relative'>
                		<select id='operator' className='w-8 appearance-none outline-none pl-0.5'>
                			<option>{'>'}</option>
                			<option>{'<'}</option>
                			<option>{'='}</option>
                		</select>
                		<div className='text-gray-600 pointer-events-none top-0 absolute  right-0 border-l bg-white px-1 border-gray-300'>
                			&#8597;
                		</div>
                	</div>
                	<input id='term' className='border border-gray-300 w-full px-1 rounded' type='text' placeholder='value'/>
                </div>
            	{Object.keys(filters).length>0 &&
	            	<div className='flex flex-wrap gap-1 w-full'>
	            		{Object.keys(filters).map(
	            			(f) => (
	            				filters[f].map(
	            					(op,i) => (
	            						<div className='max-w-50 flex border-gray-400 border shadow-md rounded-md overflow-hidden hover:border-gray-700'>
	            							<div className='max-w-45 flex rounded-l-md px-1'>
		            							<p className='min-w-5 text-gray-500 text-xs truncate'>{f}</p>
		            							<p className='text-gray-500 text-xs truncate'>{op[0] + op.slice(1)}</p>
		            						</div>
	            							<button 
	            								onClick={
	            									()=>setFilters((prev)=>{
	            										return {...prev, [f]:[...prev[f].filter((_,o)=>o!=i)]}
	            									} 
	            								)} 
	            								className='text-xs px-0.5 border-l border-gray-400 text-gray-500 cursor-pointer bg-red-100 transition-all duration-500 hover:border-gray-700 hover:bg-red-400 hover:text-black ml-auto text-center'>x</button>
	            						</div>
	            					)
	            				)
	            			)
	            		)}
	            	</div>
            	}
                <div className="flex justify-center gap-2">
                    <button onClick={() => setShowFilter(false)} className='px-3 py-1 bg-gray-200 rounded cursor-pointer'>Close</button>
                    <button className='px-3 py-1 bg-blue-500 text-white rounded cursor-pointer' onClick={()=>addFilter()}>Apply Filter</button>
                </div>
            </div>
        </div>
	);
};

export default Filter;