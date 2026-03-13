import {useState} from 'react'

function TableVisualisation({data, geo, presetGeo, setData, setGeo}) { /* need presetGeo to display feature.id for those planning on mapping imported dataset to preset geosets */
    const ids = presetGeo ? presetGeo.features.map(f => f.id) : [];
    const headers = Object.keys(data[0]); /* variable to hold array of dataset headers */
    const [showDeleteColumn, setShowDeleteColumn] = useState(false);
    const [delCol, setDelCol] = useState("");
    const [showColumnAdd, setShowColumnAdd] = useState(false);
    
    const addColumn = (column) => {
        /*const column = document.getElementById('new_column').value;*/
        if (Object.keys(data[0]).includes(column)) return alert('Cannot add a new column with the same name as an existing column');
        if (geo) {
            const updatedGeo = {
                ...geo,
                features: geo['features'].map(
                    (f) => ({
                        ...f,
                        properties: {
                            ...f['properties'],
                            [column]: ""
                        }
                    })
                )
            };
            setGeo(updatedGeo);
        }
        const updatedData = 
            data.map(
                (r) => (
                    {...r, [column]: ''}
                )
            );
        setData(updatedData);
        setShowColumnAdd(false);
    };

    const deleteKey = (k) => { /* https://gist.github.com/mustafadalga/9bcd5a0efa77c0df79a5defa3c018f10 */
        const temp = [...data].map(
            (curr) => {
                const {[k]:_,...rest} = {...curr};
                return rest;
            }
        );
        setData(temp);
        if (geo) {
            const tempGeo = {...geo,
                features: geo['features'].map(
                    (f)=>{
                        const {[k]: _,...rest } = f['properties'];
                        return {...f, properties: rest};
                    }
            )};
            setGeo(geo);
        }
        setShowDeleteColumn(false);
    };

    const update = (e,i,h) => {
        const temp = [...data];
        temp[i] = {...temp[i], [h]:e.target.value};
        setData(temp);
        if (geo) {
            const tempGeo = {...geo};
            tempGeo['features'] = [...tempGeo['features']];
            tempGeo['features'][i] = {
                ...tempGeo['features'][i],
                properties: temp[i]
            }
            setGeo(tempGeo);
        };
    }

	return (
        /* table display of selected dataset */
        <div className='flex'>
    		<table className='overflow-scroll'>
                <thead className=''>
                    <tr className=''>
                        {ids.length > 0 && <th className='border border-gray-300'>Feature ID</th>}
                        {headers.map( /* loop to display dataset headers */
                            (h,i) => (
                                /*<th key={`h-${i}`}>{h}</th>*/
                                <th key={h} className='border border-gray-300'>
                                    <div className='grid grid-cols-[1fr_auto] gap-1'>
                                        <input className='px-1 cursor-pointer' value={h} onChange={(e)=>{console.log(e)}}/>
                                        <button value={h} onClick={(e)=>{setShowDeleteColumn(true); setDelCol(e.target.value)}} className="cursor-pointer hover:bg-gray-100 border border-gray-300 rounded-full font-gray-300 px-2 py-0.5 m-0.5">-</button>
                                    </div>
                                </th>
                            )
                        )}
                    </tr>
                </thead>
                <tbody className=''>
                    {data.map( /* loop to access each index of dataset */
                        (d,i) => (
                            <tr className='' key={`r-${i}`}>
                                {ids.length > 0 && <td className='border border-gray-300'>{ids[i]}</td>}
                                {headers.map( /* loop to access all data within index */
                                    (h) => (
                                        <td className='border border-gray-300' key={`${h}-${i}`}>
                                            <input className='px-2 w-full' type='text' value={data[i][h] ? data[i][h] : ""} onChange={(e)=>{update(e,i,h)}}/>
                                        </td>
                                    )
                                )}
                            </tr>
                        )
                    )}
                </tbody>
    		</table>
            <div>
                <button onClick={() => setShowColumnAdd(true)}>Add Column</button>
            </div>

            {showColumnAdd &&
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
                    <div className='bg-white p-5 rounded-md shadow-lg w-80'>
                        <h2 className="font-bold mb-3">Create Column</h2>
                        <input id='new_column' type='text' placeholder='Column name' className='border w-full p-2 rounded mb-3' />

                        <div className='flex justify-end gap-2'>
                            <button onClick={() => setShowColumnAdd(false)} className='px-3 py-1 bg-gray-200 rounded cursor-pointer'>Cancel</button>
                            <button className='px-3 py-1 bg-blue-500 text-white rounded cursor-pointer' onClick={() => {addColumn(document.getElementById('new_column').value)}}>Add</button>
                        </div>
                    </div>
                </div>
            }

            {showDeleteColumn &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-md shadow-lg w-80">
                        <h2 className="font-bold mb-3">Are you sure you want to delete this column: {delCol}</h2>

                        <div className="flex justify-center gap-2">
                            <button onClick={() => setShowDeleteColumn(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer" onClick={() => deleteKey(delCol)}>Yes</button>
                        </div>
                    </div>
                </div>
            }
        </div>
	);
}

export default TableVisualisation;