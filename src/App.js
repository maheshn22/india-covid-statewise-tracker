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
        vaccinatedPercent: ((stats[region].total.vaccinated / stats[region].meta.population)*100).toFixed(2) + " %",
      }
      tempArray.push(tempRegion);
    })
  console.log(tempArray);


  // setRegionsData(tempArray);

  console.log(regionsData);


    let tempObject  = tempArray.filter(item => item.region == 'TT');
    setIndiaStats(tempObject);
    // console.log(tempObject)
    tempArray = tempArray.filter(item => item.region != 'TT');
    console.log(tempArray)

    let sortedArray = tempArray.sort((a,b) => {
      return b.cases - a.cases;
    })
    setRegionsData(sortedArray);

  }
  storeRegions();
  // sortRegions();

},[regions]);

const sortRegions = () => {
  let sortedArray = regionsData.sort((a,b) => {
    return b.cases - a.cases;
  })
  setRegionsData(sortedArray);
  console.log(regionsData)
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
        <td className="state">State</td>
        <td className="cases">Cases</td>
        <td className="active">Active</td>
        <td className="recovered">Recovered</td>
        <td className="deaths">Deaths</td>
        <td className="vaccinated">Vaccinated</td>
        <td className="vaccinated-percent">Vaccinated %</td>
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
              <td>{region.vaccinatedPercent}</td>
            </tr>
          </tbody>
          )
       
        }

      )}
           {/*regions&&
          regionsData.map((region) => {
            return(
                  <tr>
                    <td>{region.name}</td>
                    
                  </tr>
            )
          })*/}
          
    </table>

    </div>
  );
}

export default App;
