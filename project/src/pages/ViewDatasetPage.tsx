import { useParams } from "react-router";
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Chart from '../components/ChartVisualisation';
import Map from '../components/BrowseMapVisual';
import Table from '../components/BrowseTableVisual';
import Header from '../components/Header';
import Filter from '../components/Filter';

import axios from 'axios'; axios.defaults.withCredentials = true;

function ViewDatasetPage() {
    if (Object.keys(useParams()).length == 0) { /* if no set_id specified redirect */
        return ( <Navigate to='/' /> )
    }

    const [authorised, setAuthorised] = useState(false)
    const nav = useNavigate();
    const authCheck = async (id) => {
        try {
            const fd = new FormData();
            fd.append('set_id', id);
            const response = await axios.post('http://localhost:8000/backend/check-dataset-auth',fd,);
            if (response['data']['status'] != 'Authorised') {
                nav('/');
            } else {
                setAuthorised(true);
            }
        } catch (err) {
            nav('/');
        }
    }
    
    const url_params = useParams();
    const curr_set_id = url_params.set_id;
    const [datasetRef, setDatasetRef] = useState(null);
    const [geo, setGeo] = useState(null);
    const [filtered, setFiltered] = useState(null);
    const [data, setData] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [mode, setMode] = useState('map');
    const [filters, setFilters] = useState({});
    const [showFilter, setShowFilter] = useState(false);

    useEffect(()=>{
        if (!geo) return;
        if (Object.keys(filters).length == 0) return setFiltered(...geo);
        const filteredGeo = (
            {...geo, features:[...geo['features'].filter((feature)=>{
                return Object.keys(filters).every((metric)=>{
                    return filters[metric].every((filter)=>filter_(feature['properties'][metric],filter))
                })
            })]}
        );
        setFiltered(filteredGeo);
    }, [filters])

    const filter_ = (featureVal,filter) => {
        const op = filter[0];
        const val = isNaN(Number(filter.slice(1))) ? filter.slice(1) : Number(filter.slice(1));
        featureVal = isNaN(Number(featureVal)) ? featureVal : Number(featureVal);

        switch (op) {
            case '>':
                return featureVal > val;
            case '<':
                return featureVal < val;
            case '=':
                return featureVal == val;
            default:
                return false;
        }
    }

    const addSave = async () => {
        try {
            const fd = new FormData();
            fd.append('id',curr_set_id);
            const response = await axios.post('http://localhost:8000/backend/update-saves',fd,);
          } catch (err) {
            alert(err);
          }
    }
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/backend/get-dataset/${curr_set_id}`)
            .then(r => r.json())
            .then(d => {
                if (d[0]['public'] == false) authCheck(d[0]['set_id']);
                else setAuthorised(true);
                setDatasetRef(d[0]);
                setGeo(d[0]['dataset']);
                setFiltered(d[0]['dataset']);
                setData([...d[0]['dataset']['features'].map((f)=>({...f['properties']}))]);
                const arr = [];
                d[0]['dataset']['features'].map(
                    (f) => {
                        Object.keys(f['properties']).map(
                            (h) => {
                                if (!arr.includes(h)) arr.push(h)
                            }
                        )
                    }
                )
                setMetrics([...arr]);
            });
    }, []);
    
  return (
    <div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-5 overflow-hidden font-mono'> 
        <div className='row-start-1'>
            <Header name='View Dataset' desc='Visualise a selected dataset in table, chart and map modes' />
        </div>
        <div className='w-screen px-5'>
            {geo && authorised ? 
                <div className='max-w-full w-350 mx-auto gap-2 grid grid-cols-[1fr_250px]'>
                    <div className='bg-white rounded-xl shadow-md overflow-hidden relative 2xl:h-200 xl:h-150 md:h-120 h-80 sm:col-span-1 col-span-2'>
                        {mode == 'table' &&
                            <div className='p-1 h-full'>
                                <Table metrics={metrics} data={filtered['features']} setMode={setMode} addSave={addSave} setShowFilter={setShowFilter} />
                            </div>
                        }
                        {mode == 'map' &&
                            <div className='h-full relative'>
                                <Map title={datasetRef.title} geo={filtered} setMode={setMode} addSave={addSave} setShowFilter={setShowFilter} metrics={metrics}/>
                            </div>
                        }
                        {mode == 'chart' &&
                            <div className='h-full'>
                                <Chart metrics={metrics} title={datasetRef.title} data={filtered['features']} setMode={setMode} addSave={addSave} setShowFilter={setShowFilter}/>
                            </div>
                        }
                    </div>
                    <div className='p-3 grid gap-1 grid-rows-[auto_auto_1fr] bg-white rounded-xl shadow-md'>
                        <div className='border rounded-md border-gray-300 px-1'>
                            <h1 className='text-center'>{datasetRef.title}</h1>
                        </div>
                        <p className='text-xs text-gray-300'>description</p>
                        <div className='border border-gray-300 rounded-md px-1 text-sm text-gray-500'>
                            {!datasetRef.description ? <p>No description avaliable</p> : <p>{datasetRef.description}</p>}
                        </div>
                    </div>
                </div>
                    :
                <p>loading...</p>
            }
        </div>
        <div className='h-32 bg-teal-700 row-start-3'/>
        {showFilter && <Filter filters={filters} setFilters={setFilters} setShowFilter={setShowFilter} metrics={Object.keys(geo.features[0]?.properties)} />}
    </div>

  );
}

export default ViewDatasetPage;
