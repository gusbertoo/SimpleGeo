import { useParams } from "react-router";
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import ChartVisualisation from '../components/ChartVisualisation';
import MapVisualisation from '../components/MapVisualisation';
import TableVisualisation from '../components/TableVisualisation';

import Visualisation from '../components/Visualisation';
import Header from '../components/Header';

function ViewDatasetPage() {
    if (Object.keys(useParams()).length == 0) { /* if no set_id specified redirect */
        return ( <Navigate to='/' /> )
    }
    
    const url_params = useParams();
    const curr_set_id = url_params.set_id;
    
    /*switch (curr_vis_mode) {
        case "chart":
            vis_mode_comp = <ChartVisualisation />;
        case "map":
            vis_mode_comp = <MapVisualisation />
    }*/
    
    const [dataset, setDataset] = useState([]);
    const [l, setL] = useState(false);
    
    //const [geodata, setGeodata] = useState({});
    //const [gl, setGl] = useState(false);
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/backend/get-dataset/${curr_set_id}`)
            .then(r => r.json())
            .then(d => {
                setDataset(d);
                setL(true);
            });
    }, []);
    
    /*useEffect(() => {
        fetch(`http://127.0.0.1:8000/backend/get-geodata/${curr_geodata_id}`)
            .then(r => r.json())
            .then(d => {
                setGeodata(d);
                console.log(d);
                setGl(true);
            });
    }, []);*/
    
  return (
      <>
          <Header name='View Dataset' desc='Visualise a selected dataset in table, chart and map modes' />
          <div className='min-h-screen bg-gray-100'>
              {l ?
                  <Visualisation dataset={dataset[0]} curr={url_params.vis_mode}/> :
                  <p>loading...</p>
              }
          </div>
      </>
  );
}

export default ViewDatasetPage;
