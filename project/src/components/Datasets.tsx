import { useEffect, useState } from 'react';
import Dataset from './Dataset.tsx'

function Datasets() {
    
    const [ds, setDs] = useState({}) ; // variable to store and set list of datasets value
    const [l, setL] = useState(false); // variable to identify if datasets have been loaded
    
    // function to fetch datasets from backend api
    useEffect(() => {
        fetch('http://localhost:8000/backend/get-datasets') // fetches json promise
            .then(r => r.json())
            .then(d => { // d holds datasets json
                setDs(d);
                setL(true); // datasets now loaded
            });
    }, []);
    
    //console.log(ds);
    
    return (
      <div className='py-5 px-50 flex'>
          {/* check if loaded; true -> generate Datset componets | false -> display loading text */}
          {l ?
              ds.map( // iterating through datasets
                  (d) => (
                      <Dataset key={d.set_id} dataset={d} /> // generate Dataset component, current dataset as props
                  )
              ) :
              <p>loading</p>
          }
      </div>
    );
}

export default Datasets