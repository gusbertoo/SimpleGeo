import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import TableVisualisation from '../components/TableVisualisation'

function CreatePage() {
    
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [public_, setPublic] = useState(true);
    const [file, setFile] = useState(null);
    const [submittable, setSubmittable] = useState(false);
    const [data, setData] = useState(null);
    const [geos, setGeos] = useState(null);
    const [geo, setGeo] = useState(null);
    const [geoID, setGeoID] = useState(-1);
    const [geoIndicator, setGeoIndicator] = useState(null);
    
    
    useEffect(() => {
        fetch('http://localhost:8000/backend/get-geodatas') // fetches json promise
            .then(r => r.json())
            .then(g => {
                setGeos(g);
            });
    }, []);
    
    
    /* functions to update user input variables */
    const titleChange = (t) => {
        setTitle(t.target.value); /* sets title to the value stored in the title input field */
    }
    
    const descChange = (d) => {
        setDesc(d.target.value);
    }
    
    const publicChange = () => {
        setPublic(!public_); /* inverts the current state of public, i.e. false -> true, true -> false */
    }
    
    const fileChange = (f) => {
        setFile(f.target.files[0]); /* gets file from target's' FileList */
    }
    
    const geoIdChange = (g) => {
        setGeoID(g.target.value);
    }

    const geoIndicatorChange = (g) => {
        setGeoIndicator(g.target.value);
    }
    
    
    
    useEffect(() => {
        setData(null);
        setGeo(null);
        setGeoID(-1);
        setGeoIndicator(null);
        if (checkFile()) {
            const getFile = async () => {
                try {
                    const fd = new FormData();
                    fd.append('file', file);
                    const response = await axios.post('http://localhost:8000/backend/get-file',fd,);
                    setData(response.data.data);
                    setGeo(response.data.geo);
                } catch (err) {
                    alert(err);
                }
            }
            getFile();
        }
        else {
            setData(null)
        }
    }, [file]);
    
    
    
    useEffect(() => { /* used to check if the changes to title and file inputs result in the form becoming submittable */
        setSubmittable(checkTitle() && checkFile())
    }, [title, file]);

    const checkFile = () => {
        if (file) {
            const ext = file['name'].split('.').pop().toLowerCase(); /* get file extension to check, toLower() ensures all the same case- i.e. json and JSON treated the same */
            const acceptable = ['json', 'csv']
            return acceptable.includes(ext);
        }
        return false;
    }
    
    const checkTitle = () => {
        return title != "";
    }
    
    
    
    const submit = async () => {
        
        const fd = new FormData();
        fd.append('title', title);
        fd.append('desc', desc);
        fd.append('public', public_);
        /*fd.append('file', file);*/
        fd.append('data', JSON.stringify(data));
        
        try {
            const response = await axios.post('http://localhost:8000/backend/add-dataset',fd,);
        } catch (err) {
            alert(err);
        }
    }
    
    
    
  return (
      <>
          <Header name='Create' desc='Design your very own datasets and visualisations'/>
          {/*<form>*/}
          <div className='flex min-h-screen bg-gray-100 p-5 overflow-hidden'>
              <div className='bg-white h-100 w-3/4 mr-10 overflow-scroll'>
                  {data ?
                      <TableVisualisation data={data} /> :
                      <p>bye</p>
                  }
              </div>
              
              <div className='w-64 bg-white h-100 w-1/4'>
                  <input type ='text' name='title' value={title} onChange={titleChange} />
                  <input type='text' name='desc' value={desc} onChange={descChange} />
                  <input type='file' name='file' onChange={fileChange}/>
                  <input type='checkbox' name='public' checked={public_} onChange={publicChange}/>
                  {geos && checkFile() && !geo ?
                      <select onChange={geoIdChange}>
                         <option value={-1}>None</option>
                         {geos.map(
                             (g) => (
                                 <option key={g['geodata_id']} value={g['geodata_id']}>{g['name']}</option>
                             )
                         )}
                      </select>:
                      <></>
                  }
                  {geoID > -1 ?
                      <select onChange={(g)=>{alert(g.target.value)}}>
                          {Object.keys(data[0]).map(
                                (k, i) => (
                                    <option key={i}>{k}</option>
                                )
                          )}
                      </select> :
                      <></>
                  }
                  <button className={`${submittable ? '' : 'cursor-not-allowed'}`} disabled={!submittable} onClick={submit}>submit</button>
              </div>
          </div>
          {/*</form>*/}
      </>
  );
}

export default CreatePage;