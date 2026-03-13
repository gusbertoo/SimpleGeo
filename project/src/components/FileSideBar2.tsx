import {useState, useEffect, useRef} from 'react'
import TableVisualisation from './TableVisualisation.tsx'

function FileSideBar({data}) {
	if (data) {
		return (
			<div className='overflow-scroll col-start-2 bg-white rounded-r-md'>
				<TableVisualisation data={data} />
			</div>
		);
	};

	return (
		<div className='overflow-scroll col-start-2 bg-white rounded-r-md'>
			<p>Nothing to see here</p>
		</div>
	);
};

export default FileSideBar;