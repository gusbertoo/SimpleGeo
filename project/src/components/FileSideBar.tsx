import {useState, useEffect, useRef} from 'react'
import TableVisualisation from './TableVisualisation.tsx'

function FileSideBar({data}) {
	const [width, setWidth] = useState(350);
	const isResized = useRef(false);

	useEffect(() => {
		window.addEventListener("mousemove", (e) => {
			if (!isResized.current) {
				return;
			}
			
			setWidth((previousWidth) => previousWidth - e.movementX / 2);
		});
	},[]);

	window.addEventListener("mouseup", () => {
		isResized.current = false;
	});

	if (data) {
		return (
			<div className='overflow-scroll col-start-2 bg-white rounded-r-md' style={{ width: `${width / 16}rem` }}>
				<TableVisualisation data={data} />
			</div>
		);
	};

	return (
		<div className='overflow-scroll col-start-2 bg-white rounded-r-md' style={{ width: `${width / 16}rem` }}>
			<div className='bg-teal-400 w-1 h-full cursor-col-resize' onMouseDown={() => {isResized.current = true;}}>
			</div>
			<p>Nothing to see here</p>
		</div>
	);
};

export default FileSideBar;