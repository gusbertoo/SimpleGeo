import {useState} from 'react'

function HeaderCell({ h, rename, setShowDeleteColumn, setDelCol }) {
    const [val, setVal] = useState(h);
    const [tempVal, setTempVal] = useState(h);
    return (
        <th className='border border-gray-300 bg-blue-50'>
            <div className='grid grid-cols-[1fr__auto_auto]'>
                <input value={val} onChange={(e) => setVal(e.target.value)} onBlur={(e) => val != tempVal && (rename(h,val) ? setTempVal(val) : setVal(tempVal))}/>
                <div className='border-l border-gray-300 px-0.5'>
                    <button value={h} onClick={(e)=>{setShowDeleteColumn(true); setDelCol(e.target.value)}} className="cursor-pointer hover:bg-gray-100 border border-gray-300 rounded-full font-gray-300 px-2 py-0.5 m-0.5">-</button>
                </div>
            </div>
        </th>
    );
}

function TableVisualisation({data, geo, presetGeo, setData, setGeo}) { /* need presetGeo to display feature.id for those planning on mapping imported dataset to preset geosets */
    const ids = presetGeo ? presetGeo.features.map(f => f.id) : [];
    const headers = []; /* variable to hold array of dataset headers */
    data.map(
        (d) => {
            Object.keys(d).map(
                (h) => {
                    if (!headers.includes(h)) headers.push(h);
                }
            )
        }
    )
    const [showDeleteColumn, setShowDeleteColumn] = useState(false);
    const [delCol, setDelCol] = useState("");
    const [showColumnAdd, setShowColumnAdd] = useState(false);
    
    const addColumn = (column) => {
        /*const column = document.getElementById('new_column').value;*/
        if (headers.includes(column)) return alert('Cannot add a new column with the same name as an existing column');
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
            setGeo(tempGeo);
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

    const rename = (key,newKey) => {
        if (newKey == '') {
            alert('Headers cannot be empty');
            return false;
        } else if (data.some(d => newKey in d)) {
            alert('Name cannot be an existing header')
            return false;
        }
        const temp = [...data.map(
            (d) => {
                const obj = {};
                Object.keys(d).forEach((curr)=>{
                    if (curr == key) obj[newKey] = d[curr];
                    else obj[curr] = d[curr];
                });
                return obj;
            }
        )]
        setData(temp);
        setGeo(prev => ({
            ...prev,
            features: prev.features.map((f, i) => ({
                ...f,
                properties: temp[i]
            }))
        }));
        return true;
    }


    return (
        /* table display of selected dataset */
        <div>
            <p className='ml-2 text-xs text-gray-400 truncate'>Recomended to have a 'name' field</p>
            <div className='flex'>
                <table className='border-collapse'>
                    <thead className=''>
                        <tr className=''>
                            {ids.length > 0 && <th className='border border-gray-300 bg-blue-50'>Feature ID</th>}
                            {headers.map( /* loop to display dataset headers */
                                (h,i) => (
                                    <HeaderCell key={h} h={h} rename={rename} setShowDeleteColumn={setShowDeleteColumn} setDelCol={setDelCol} />
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className=''>
                        {data.map( /* loop to access each index of dataset */
                            (d,i) => (
                                <tr className='even:bg-gray-50' key={`r-${i}`}>
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
                    <button className='border rounded-full px-1.5 ml-2 text-sm cursor-pointer' onClick={() => setShowColumnAdd(true)}>+</button>
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
        </div>
    );
}

export default TableVisualisation;