import { Link } from 'react-router-dom';

import TableVisualisation from '../components/TableVisualisation';
import ChartVisualisation from '../components/ChartVisualisation';
import MapVisualisation from '../components/MapVisualisation';

function Visualisation({dataset, curr}) {
        let vis_mode_comp = <TableVisualisation data={dataset.dataset}/> /* variable to load component depending on url params */
        
        if (curr == 'chart') {
            vis_mode_comp = <ChartVisualisation data={dataset.dataset}/>
        } else if (curr == 'map') {
            vis_mode_comp = <MapVisualisation data={dataset.dataset}/>
        }
        
    return (
        <div className='w-4/5 p-5'>
            <div className='w-full h-140 bg-white rounded-4xl shadow-md relative z-0 overflow-hidden'> {/*z-0 and relative used to allow sticky nav bar*/}
                <div className='w-full h-12 px-3'>
                    <div className='px-2 flex items-center font-mono h-full'>
                        <div className='flex'>
                            <h1 className='border-r px-5 underline'>{dataset.title}</h1>
                            <h1 className='px-5'>{dataset.username_id}</h1>
                        </div>
                        <div className='flex ml-auto'>
                            <Link to={`/view/${dataset.set_id}/table`}>
                                <button className='border px-5 mx-1'>Table</button>
                            </Link>
                            <Link to={`/view/${dataset.set_id}/chart`}>
                                <button className='border px-5 mx-1'>Chart</button>
                            </Link>
                            {dataset.geodata_id ?
                                <Link to={`/view/${dataset.set_id}/map`}>
                                    <button className='border px-5 mx-1'>Map</button>
                                </Link> :
                                <></>
                            }
                        </div>
                    </div>
                </div>
                
                {vis_mode_comp}
                
                {/*<MapContainer center={[51.505, -0.09]} zoom={1} className='h-full rounded-md'>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>*/}
            </div>
        </div>
        
    );
}

export default Visualisation;