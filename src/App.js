import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import './Home.css';
import { green } from '@material-ui/core/colors';


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
        vaccinated: stats[region].total.vaccinated1,
        vaccinatedPercent: parseFloat(((stats[region].total.vaccinated1 / stats[region].meta.population)*100).toFixed(2)),
        vaccinatedPercent2: parseFloat(((stats[region].total.vaccinated2 / stats[region].meta.population)*100).toFixed(2)),
        casesToday: (typeof stats[region].delta != 'undefined') ? 
        ( stats[region].delta.recovered&&stats[region].delta.deceased&&stats[region].delta.confirmed 
          ? stats[region].delta.confirmed 
          : Math.round(stats[region].delta7.confirmed /7) )
          : Math.round(stats[region].delta7.confirmed /7) ,
        activeToday: (typeof stats[region].delta != 'undefined') ? 
        ( stats[region].delta.recovered&&stats[region].delta.deceased&&stats[region].delta.confirmed 
          ? (stats[region].delta.confirmed -stats[region].delta.recovered - stats[region].delta.deceased) 
          : Math.round((stats[region].delta7.confirmed - stats[region].delta7.recovered - 
            (stats[region].delta7.deceased ? stats[region].delta7.deceased : 0 ) )/7)
         )
          :Math.round((stats[region].delta7.confirmed - stats[region].delta7.recovered - 
            (stats[region].delta7.deceased ? stats[region].delta7.deceased : 0 ) )/7
          ),
        recoveredToday: (typeof  stats[region].delta != 'undefined') ? 
        ( stats[region].delta.recovered&&stats[region].delta.deceased&&stats[region].delta.confirmed 
          ? stats[region].delta.recovered 
          : Math.round(stats[region].delta7.recovered /7) )
        : Math.round(stats[region].delta7.recovered/7),
        deathsToday: (typeof stats[region].delta != 'undefined') 
        ? ( stats[region].delta.recovered&&stats[region].delta.deceased&&stats[region].delta.confirmed 
          ? stats[region].delta.deceased 
          : (Math.round(stats[region].delta7.deceased/7) ? Math.round(stats[region].delta7.deceased/7) : 0) )
        : (Math.round(stats[region].delta7.deceased/7) ? Math.round(stats[region].delta7.deceased/7) : 0),
        casesWeekly: Math.round(stats[region].delta7.confirmed /7) ,
        activeWeekly: Math.round((stats[region].delta7.confirmed -stats[region].delta7.recovered - stats[region].delta7.deceased)/7),
        recoveredWeekly: Math.round(stats[region].delta7.recovered/7),
        deathsWeekly: Math.round(stats[region].delta7.deceased/7),
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
    {console.log(stats)}
    
  {/*  <table className="table">      
  <br/>
      <tbody>
        <tr>
          <td>India</td>
          <td>{indiaStats.cases} &nbsp;<span className="redText">+{indiaStats.casesToday}</span></td>
          <td style={{color: "#5074a0"}}>{indiaStats.active} &nbsp;
          {indiaStats.activeToday > 0 ?
            <span className="redText">+{indiaStats.activeToday}</span>
            : 
            <span className="greenText">-{indiaStats.activeToday*-1}</span>
          }
          </td>
          <td style={{color: "forestgreen"}}>{indiaStats.recovered} &nbsp;<span className="greenText">+{indiaStats.recoveredToday}</span></td>
          <td style={{color: "darkred"}}>{indiaStats.deaths} &nbsp;<span className="redText">+{indiaStats.deathsToday}</span></td>
          {/*<td style={{color: "#980147"}}>{region.vaccinated}</td>}
          <td style={{color: "#570029"}}>{indiaStats.vaccinatedPercent} %</td>
          <td style={{color: "#570029"}}>{indiaStats.vaccinatedPercent2} %</td>
        </tr>
      </tbody>          
        </table> */}
    
    <br/>
    <table className="table">

      <tr className="top-row">
        <td onClick={() => sortBy("region")} className="state">State</td>
        <td onClick={() => sortBy("cases")} className="cases">Total Cases</td>
        <td onClick={() => sortBy("active")} className="active">Active Cases</td>
        <td onClick={() => sortBy("recovered")} className="recovered">Recovered</td>
        <td onClick={() => sortBy("deaths")} className="deaths">Deaths</td>
        {/*<td onClick={() => sortBy("vaccinated")} className="vaccinated">Vaccinated</td>*/}
        <td onClick={() => sortBy("vaccinatedPercent")} className="vaccinated-percent">Vaccinated-1</td>
        <td onClick={() => sortBy("vaccinatedPercent")} className="vaccinated-percent">Vaccinated-2</td>
      </tr>

      {regionsData.map((region)=> {

        return(
          <tbody>
            <tr>
              <td>{region.region}</td>
              <td>{region.cases} &nbsp;<span className="redText">+{region.casesToday}</span></td>
              <td style={{color: "#5074a0"}}>{region.active} &nbsp;
              {region.activeToday > 0 ?
                <span className="redText">+{region.activeToday}</span>
                : 
                <span className="greenText">-{region.activeToday*-1}</span>
              }
              </td>
              <td style={{color: "forestgreen"}}>{region.recovered} &nbsp;<span className="greenText">+{region.recoveredToday}</span></td>
              <td style={{color: "darkred"}}>{region.deaths} &nbsp;<span className="redText">+{region.deathsToday}</span></td>
              {/*<td style={{color: "#980147"}}>{region.vaccinated}</td>*/}
              <td style={{color: "#570029"}}>{region.vaccinatedPercent} %</td>
              <td style={{color: "#570029"}}>{region.vaccinatedPercent2} %</td>
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
