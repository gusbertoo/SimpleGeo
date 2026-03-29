import { useEffect, useState } from 'react';

import Chart from '../components/ChartVisualisation';
import Map from '../components/BrowseMapVisual';
import Table from '../components/BrowseTableVisual';
import Header from '../components/Header';
import Filter from '../components/Filter';

function PreviewDataset({geo_,title,description}) {    
    const [geo, setGeo] = useState(geo_);
    const [filtered, setFiltered] = useState(geo_);
    const [mode, setMode] = useState('map');
    const [filters, setFilters] = useState({});
    const [showFilter, setShowFilter] = useState(false);
    const [metrics, setMetrics] = useState(()=>{
        const arr = [];
        geo_.features.forEach((f) => {
            Object.keys(f.properties).forEach((h) => {
                if (!arr.includes(h)) arr.push(h);
            });
        });
        return arr;
    });

    useEffect(()=>{
        if (!geo) return;
        if (Object.keys(filters).length == 0) return setFiltered({...geo});
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
    
  return (
    <div className='bg-gray-100 gap-5 overflow-hidden font-mono rounded-xl'> 
        <div className='p-5'>
            {geo ? 
                <div className='max-w-full w-350 mx-auto gap-2 grid grid-cols-[1fr_250px]'>
                    <div className='bg-white rounded-xl shadow-md overflow-hidden relative 2xl:h-200 xl:h-150 md:h-100 sm:h-60 h-40 sm:col-span-1 col-span-2'>
                        {mode == 'table' &&
                            <div className='p-1 h-full'>
                                <Table metrics={metrics} data={filtered['features']} setMode={setMode} setShowFilter={setShowFilter} />
                            </div>
                        }
                        {mode == 'map' &&
                            <div className='h-full relative'>
                                <Map title={title} geo={filtered} setMode={setMode} setShowFilter={setShowFilter} metrics={metrics}/>
                            </div>
                        }
                        {mode == 'chart' &&
                            <div className='h-full'>
                                <Chart metrics={metrics} title={title} data={filtered['features']} setMode={setMode} setShowFilter={setShowFilter}/>
                            </div>
                        }
                    </div>
                    <div className='p-3 grid gap-1 grid-rows-[auto_auto_1fr] bg-white rounded-xl shadow-md'>
                        <div className='border rounded-md border-gray-300 px-1'>
                            <h1 className='text-center'>{title}</h1>
                        </div>
                        <p className='text-xs text-gray-300'>description</p>
                        <div className='border border-gray-300 rounded-md px-1 text-sm text-gray-500'>
                            {!description ? <p>No description avaliable</p> : <p>{description}</p>}
                        </div>
                    </div>
                </div>
                    :
                <p>loading...</p>
            }
        </div>
        {showFilter && <Filter filters={filters} setFilters={setFilters} setShowFilter={setShowFilter} metrics={metrics} />}
    </div>

  );
}

export default PreviewDataset;
