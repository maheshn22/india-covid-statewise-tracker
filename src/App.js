import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import './Home.css';


function App() {
  const [stats,setStats] = useState([]);
  const [regions,setRegions] = useState([]);
  const [regionsData,setRegionsData] = useState([]);
  const [indiaStats,setIndiaStats] = useState({});

  const getStats = async () => {
    try {
      const response = await axios.get("https://api.covid19india.org/v4/min/data.min.json");
      setStats(response.data);
      let a = response.data
      setRegions(Object.keys(a));
    } 
    catch(e) {
      console.log(e)
    } 
  }
  
  const [, updateState] = React.useState();
const forceUpdate = React.useCallback(() => updateState({}), []);

  
  
  useEffect(() => {

  const storeRegions = () => {
    let tempArray = [];
    regions.map(region => {
      let tempRegion = {
        region: region,
        cases: stats[region].total.confirmed,
        active: stats[region].total.confirmed - stats[region].total.recovered - stats[region].total.deceased,
        recovered: stats[region].total.recovered,
        deaths: stats[region].total.deceased,
        vaccinated: stats[region].total.vaccinated,
        vaccinatedPercent: parseFloat(((stats[region].total.vaccinated / stats[region].meta.population)*100).toFixed(2)),
      }
      tempArray.push(tempRegion);
    })
  // console.log(tempArray);


  // setRegionsData(tempArray);

  // console.log(regionsData);


    let tempObject  = tempArray.filter(item => item.region == 'TT');
    setIndiaStats(tempObject);
    // console.log(tempObject)
    tempArray = tempArray.filter(item => item.region != 'TT');
    // console.log(tempArray)

    let sortedArray = tempArray.sort((a,b) => {
      return b.cases - a.cases;
    })
    setRegionsData(sortedArray);

    }
    storeRegions();
    // sortRegions();

  },[regions]);

  const [sortToggle,setSortToggle] = useState(true)
  const sortBy = (criteria) => {
    
    console.log(criteria);
    let sortedArray = regionsData.sort((a,b) => {
      if(sortToggle) {
        return b[criteria] > a[criteria] ? 1 : -1;
      } else return a[criteria] > b[criteria] ? 1 : -1;
    })
    
    setSortToggle(!sortToggle);

    console.log(sortedArray[0])
    setRegionsData(sortedArray)
    forceUpdate();
  }


  useEffect(() => {
    getStats();
  },[]);

  return (
    <div className="App">

    <h1>India Statewise Covid Cases - Live</h1>
    <br/>
    <table className="table">

      <tr className="top-row">
        <td onClick={() => sortBy("region")} className="state">State</td>
        <td onClick={() => sortBy("cases")} className="cases">Cases</td>
        <td onClick={() => sortBy("active")} className="active">Active</td>
        <td onClick={() => sortBy("recovered")} className="recovered">Recovered</td>
        <td onClick={() => sortBy("deaths")} className="deaths">Deaths</td>
        <td onClick={() => sortBy("vaccinated")} className="vaccinated">Vaccinated</td>
        <td onClick={() => sortBy("vaccinatedPercent")} className="vaccinated-percent">Vaccinated %</td>
      </tr>

      {regionsData.map((region)=> {

        return(
          <tbody>
            <tr>
              <td>{region.region}</td>
              <td>{region.cases}</td>
              <td>{region.active}</td>
              <td>{region.recovered}</td>
              <td>{region.deaths}</td>
              <td>{region.vaccinated}</td>
              <td>{region.vaccinatedPercent} %</td>
            </tr>
          </tbody>
          )
       
        }

      )}
          
    </table>

    </div>
  );
}

export default App;
