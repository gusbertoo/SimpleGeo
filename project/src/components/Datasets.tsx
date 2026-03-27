import { useEffect, useState } from 'react';
import Dataset from './Dataset.tsx'

function Datasets() {
    
    const [ds, setDs] = useState([]) ; // variable to store and set list of datasets value
    const [l, setL] = useState(false); // variable to identify if datasets have been loaded
    const [search, setSearch] = useState(''); // variable to store search input text
    const [searchDs, setSearchDs] = useState([]);
    
    // function to fetch datasets from backend api
    useEffect(() => {
        fetch('http://localhost:8000/backend/get-datasets') // fetches json promise
            .then(r => r.json())
            .then(d => { // d holds datasets json
                setDs(d);
                setL(true); // datasets now loaded
            });
    }, []);

    useEffect(()=>{
      if (ds.length == 0) return;
      if (search == '') return setSearchDs([]);
      const regex = new RegExp(search,'i'); /* case insensetive regex */
      setSearchDs(ds.filter((d)=>{
        return d['title'].match(regex) // /s.*/
      }));
    }, [search]);
    
    
    return (
      <div className='max-w-full'>
        <div className='flex justify-center'>
            <input className='rounded-full mx-auto py-1 px-2 bg-white border border-gray-200 hover:border-gray-500 focus:border-gray-500' type='text' onChange={(e)=>setSearch(e.target.value)} placeholder='Serach...'/>
        </div>

        {search != '' &&
            <div className='border mt-3 border-gray-300 rounded-md w-full md:w-150 xl:w-200 mx-auto'>
                <div className='px-3 py-1 border-b border-gray-300 mx-2 shadow-b-md'>
                    <h1 className='text-center'>Search Results</h1>
                </div>
                {searchDs.length > 0 ?
                  <div className='grid md:grid-cols-2 grid-cols-1 w-200 xl:w-300 2xl:w-500 max-w-full max-h-70 overflow-scroll'>
                    {searchDs.map(
                      (d)=>(
                        <Dataset key={d.set_id} dataset={d} />
                      )
                    )}
                  </div> :
                  <div>
                    <p className='text-center p-5 text-gray-400'>No datasets match your search</p>
                  </div>
                }
            </div>
        }
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 w-200 xl:w-300 2xl:w-500 max-w-full'>
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
      </div>
    );
}

export default Datasets