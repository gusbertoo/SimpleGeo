import { useState, useEffect } from 'react'

function BrowseMapVisual({data,setMode,addSave,setShowFilter,title,metrics}) {
	const [saving, setSaving] = useState(false);
	const [asc, setAsc] = useState(true);
	const [sort, setSort] = useState(data[0]?.id ? 'id' : 0);
	const [sorted, setSorted] = useState([]);
	const [move,setMove] = useState(false);

	useEffect(()=>{
		setSorted([...data].sort((a,b) => {
			if (sort == 'id') {
				const v1 = a?.[sort] ?? '';
				const v2 = b?.[sort] ?? '';
				return v1.toString().localeCompare(v2.toString(),'en',{'numeric':true}) * (asc ? 1 : -1);
			} else if (metrics.length > 0) {
				const k = metrics[sort];
				const v1 = a?.properties?.[k] ?? '';
				const v2 = b?.properties?.[k] ?? '';
				return v1.toString().localeCompare(v2.toString(),'en',{'numeric':true}) * (asc ? 1 : -1);
			}
			return 0;
		}));
	},[data,sort,asc]);

	return (
		<div className='h-full'>
			<div className={`absolute z-1000 top-3 ${move ? `left-3` : `right-3`} grid gap-2 pointer-events-none`}>
                <div className={`grid grid-cols-2 gap-2 ${saving && `hidden`}`}>
                	<div className='col-span-2 flex gap-1'>
	                    <div className='pointer-events-auto bg-white rounded-lg p-2 grid grid-cols-3 gap-2 border border-gray-400 opacity-70 hover:opacity-100 shadow-xl'>
	                        <button className={`px-3 border border-red-200 bg-red-100 rounded-md cursor-pointer hover:bg-red-300`} onClick={()=>setMode('map')}>Map</button>
	                        <button className={`px-3 border border-yellow-200 bg-yellow-100 rounded-md cursor-pointer hover:bg-yellow-200`} onClick={()=>setMode('chart')}>Chart</button>
	                        <button className={`px-3 border border-purple-200 bg-purple-100 rounded-md cursor-pointer hover:bg-purple-300`} onClick={()=>setMode('table')}>Table</button>
	                    </div>
	                </div>
                    <div className='col-span-2 flex gap-1 justify-center pointer-events-auto'>
                    	<div className={`grid items-center ${move && 'order-1'}`}>
                			<button className='pointer-events-auto cursor-pointer bg-white rounded-full border border-gray-400 opacity-70 hover:opacity-100 shadow-xl px-1.5 text-xl' onClick={()=>{setMove((prev)=>!prev)}}>{move ? <p>&#8594;</p> : <p>&#8592;</p>}</button>
                		</div>
                    	<button onClick={()=>setShowFilter(true)} className='px-3 text-gray-600 text-sm border border-gray-400 rounded-md bg-white opacity-70 p-0.5 hover:opacity-100 cursor-pointer'>Filter</button>
                    </div>
                </div>
            </div>
	        <div className='p-3 text-gray-500 text-xs h-full w-full grid place-items-center'>
	        	<div className='border rounded-2xl border-gray-300 max-h-full max-w-full overflow-scroll'>
					<table>
						<thead>
							<tr className='bg-gray-100'>
								{sorted[0]?.id && 
									<th onClick={()=>{if (sort == 'id'){setAsc((prev)=>!prev)} else {setSort('id'); setAsc(true);}}} className={`pl-1 pr-5 ${'id' == sort && `bg-sky-100`} cursor-pointer`}>
										Feature ID 
										<span>{'id' == sort && (asc ? <p className=''>&#8593;</p> : <p className=''>&#8595;</p>)}</span>
									</th>
								}
								{metrics.map(
									(m,i) => (
										<th onClick={()=>{if (sort == i){setAsc((prev)=>!prev)} else {setSort(i); setAsc(true);}}} className={`pl-1 pr-5 cursor-pointer ${i == sort && `bg-sky-100`}`}>
											{m} {i == sort && (asc ? <p className=''>&#8593;</p> : <p className=''>&#8595;</p>)}
										</th>
									)
								)}
							</tr>
						</thead>
						<tbody>
							{sorted.map(
								(feature) => (
									<tr className='border-y border-gray-100 even:bg-gray-50'>
										{feature.id && <td className={`${'id' == sort && `bg-sky-50`} pl-1 pr-5`}>{feature.id}</td>}
										{metrics.map(
											(metric,i) => (
												<td className={`pl-1 pr-5 ${i == sort && `bg-sky-50`}`}>
													{feature['properties'][metric]}
												</td>
											)
										)}
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
};

export default BrowseMapVisual;