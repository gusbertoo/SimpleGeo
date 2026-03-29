import { useState, useCallback, useRef } from 'react';
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar, Scatter, Doughnut, PolarArea } from 'react-chartjs-2';
import { toPng } from 'html-to-image';

function ChartVisualisation({data,setMode,addSave,setShowFilter,title,metrics}) {
	const [yAxis, setYAxis] = useState('y-axis');
	const [xAxis, setXAxis] = useState('x-axis');
	const charts = {'Bar':Bar, 'Doughnut':Doughnut, 'Area':PolarArea};
	const [chartType, setChartType] = useState('Bar');
	const Chart = charts[chartType];
	const [saving, setSaving] = useState(false);
	const ref = useRef<HTMLDivElement>();

	const save_ = useCallback(() => {
        if (ref.current === null) {
          return
        }
        setSaving(true);
        toPng(ref.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `${title}-chart.png`
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {alert(err)})
            .finally(() => {setSaving(false);});
      }, [ref])

	return (
		<div ref={ref} className='h-full grid grid-cols-[40px_1fr] gap-2 p-3 relative'>
			<div className='absolute z-1000 top-3 right-3 grid gap-2'>
                <div className={`grid grid-cols-2 gap-2 ${saving && `hidden`}`}>
                    <div className='bg-white rounded-lg p-2 grid grid-cols-3 col-span-2 gap-2 border border-gray-400 opacity-70 hover:opacity-100 shadow-xl'>
                        <button className={`px-3 border border-red-200 bg-red-100 rounded-md cursor-pointer hover:bg-red-300`} onClick={()=>setMode('map')}>Map</button>
                        <button className={`px-3 border border-yellow-200 bg-yellow-100 rounded-md cursor-pointer hover:bg-yellow-200`} onClick={()=>setMode('chart')}>Chart</button>
                        <button className={`px-3 border border-purple-200 bg-purple-100 rounded-md cursor-pointer hover:bg-purple-300`} onClick={()=>setMode('table')}>Table</button>
                    </div>
                    <button onClick={()=>setShowFilter(true)} className='text-gray-600 text-sm border border-gray-400 rounded-md bg-white opacity-70 p-0.5 hover:opacity-100 cursor-pointer'>Filter</button>
                    <button onClick={()=>{save_();addSave()}} className='text-gray-600 text-sm text-sm border border-gray-400 rounded-md bg-white opacity-70 hover:opacity-100 cursor-pointer'>Save</button>
                    <div className='col-span-2'>
                    	<div className='w-fit mx-auto relative text-gray-600 text-sm text-sm border border-gray-400 rounded-md bg-white opacity-70 hover:opacity-100 cursor-pointer'>
		                    <select onChange={(e)=>setChartType(e.target.value)} className='mx-auto outline-none appearance-none pl-1 px-6'>
		                    	<option>Bar</option>
		                    	<option>Scatter</option>
		                    	<option>Doughnut</option>
		                    	<option>Area</option>
		                    </select>
		                    <div className='text-gray-600 pointer-events-none top-0 absolute rounded-r-md right-0 border-l bg-white px-1 border-gray-300 h-full'>
			                	&#8597;
			                </div>
		                </div>
	                </div>
                </div>
            </div>
			<div className='my-auto flex justify-center'>
				<div className='relative border border-gray-300 rounded-lg shadow-md bg-blue-50 rotate-270 origin-center'>
					<select onChange={(e)=>setYAxis(e.target.value)} className='appearance-none outline-none pl-1 pr-6' id='y-axis' onChange={(e)=>setYAxis(e.target.value)}>
						<option>y-axis</option>
						{metrics.map(
							(h) => (
									<option>{h}</option>
							)
						)}
					</select>
					<div className='text-gray-600 pointer-events-none top-0 absolute rounded-r-md right-0 border-l bg-blue-50 px-1 border-gray-300 h-full'>
	                	&#8597;
	                </div>
	            </div>
			</div>
			<div className='overflow-scroll'>
				{console.log(data.map((d)=>d['properties']['name']))}
				{chartType in charts ?
					<Chart
						data={{
							labels: data.map((d)=>(xAxis == 'Feature ID' ? d['id'] : d['properties'][xAxis])),
							datasets: [
								{label:yAxis, data: data.map((d)=>d['properties'][yAxis])},
							]
						}} 
					/> :
					<Scatter 
						data={{
							datasets: [{
								label: yAxis + ' | ' + xAxis,
								data: data.map((d) => ({
									x: d.properties[xAxis],
									y: d.properties[yAxis],
									label: d.properties.name ? d.properties.name : d.id, 
								}))
							}]
						}}
						options={{
							plugins: {
								tooltip: {
									callbacks: {
										label: function(context) {
											const { x, y, label } = context.raw;
											return `${label || 'Unknown'} (${x}, ${y})`;
										}
									}
								}
							}
						}}
					/>
				}
			</div>
			<div className='row-start-2 col-start-2 flex justify-center'>
				<div className='relative border border-gray-300 rounded-lg shadow-md'>
					<select className='appearance-none outline-none pl-1 pr-6' id='x-axis' onChange={(e)=>setXAxis(e.target.value)}>
						<option>x-axis</option>
						{data[0]?.id && <option>Feature ID</option>}
						{metrics.map(
							(h) => (
									<option>{h}</option>
							)
						)}
					</select>
					<div className='text-gray-600 pointer-events-none top-0 absolute rounded-r-md right-0 border-l bg-white px-1 border-gray-300 h-full'>
	                	&#8597;
	                </div>
	            </div>
			</div>
		</div>
	)
}

export default ChartVisualisation;