import { useEffect, useState } from 'react'
import './App.css'
import Title from './components/Title'
import Subtitle from './components/Subtitle'
import axios from 'axios'
import Closure from './components/Closure'

function App() {

  const [closures, setClosures] = useState([]);
  const [date, setDate] = useState();
  const [boat, setBoat] = useState();
  const [dateFilter, setDateFilter] = useState("");
  const [boatFilter, setBoatFilter] = useState("");
  const [lastClosure, setLastClosure] = useState("");
  const [isPassed, setIsPassed] = useState(true);

  
  const url = 'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=80&sort=date_passage&facet=bateau';
  
  /* Charge les horaires de fermetures du pont Chaban Delmas */
  const getClosure = () => {
    axios.get(url).then((response) => {
      setClosures(response.data.records);
    });
  }
  const getBoat = ()=> {
    axios.get(url).then((response) => {
      setBoat(response.data.records.map((closure) => closure.fields.bateau));
  });
}

const getDates = () => {
  axios.get(url).then((response) => {
    setDate(response.data.records.map((closure) => closure.fields.date_passage));
  });
}

/* Gère fermeture prochaine ou passée NOTA: Remplacer array date par test pour tester les fermetures futures */

const test = ["2023-11-06","2023-10-03","2023-01-01","2022-11-05"]

const setCountdown = () => {
  const now = new Date().getTime();
  const countdownDate = new Date(date[0]).getTime();
  const distanceBase = countdownDate - now;
  console.log(distanceBase, "distanceBase");
  if (distanceBase < 0) {
    setLastClosure(date[0]); 
  } else {
    setIsPassed(false);
    setLastClosure(date.filter(date=> new Date(date).getTime() > now) .pop());
  }
  }

/*   Charge les requêtes au démarrage de l'application */

useEffect(() => {
  getClosure(), getBoat(), getDates();
}, []);

useEffect(()=> date && setCountdown(), [date])


console.log(lastClosure, "lastClosure");


  /*  Gère les changements de filtre */
  const selectDate = (event) => {
    setDateFilter(event.target.value);
    setBoatFilter("");
  }
  
  const selectBoat = (event) => {
    setBoatFilter(event.target.value);
    setDateFilter("");
  }
  
  return (
    <div className="App">
      <Title title={"Test Technique Dotsafe"}/>
      {lastClosure && <Closure coutdown={lastClosure} isPassed = {isPassed}/>}
      <Subtitle subtitle={"Fermetures du pont Chaban Delmas"}/>
    <form>
        <label htmlFor="date">
          Fermetures le {""}  
          <select id="date" onChange={selectDate} >
            <option value="">---</option>
            {date && date.map((date) => (<option value={date}>{date}</option>))}
          </select>
        </label>
        <label htmlFor="boat">
         Motif de fermeture{""}  
          <select id="boat" onChange={selectBoat}>
            <option value="">---</option>
            {boat && boat.map((boat) => (<option value={boat}>{boat}</option>))}
          </select>
        </label>

      </form>
      <table >
        <tr>
            <th>Date de fermeture</th>
            <th>Heure de fermeture</th>
            <th>Heure de réouverture</th>
            <th>Bateau</th>
        </tr>
        {closures
        .filter ((closure) => dateFilter==="" || closure.fields.date_passage === dateFilter)
        .filter ((closure) => boatFilter==="" || closure.fields.bateau === boatFilter)
        .map((closure) => (<tr>
          <td>{closure.fields.date_passage}</td>
          <td>{closure.fields.fermeture_a_la_circulation}</td>
          <td>{closure.fields.re_ouverture_a_la_circulation}</td>
          <td>{closure.fields.bateau}</td>
          </tr>
          ))}
    </table>
    </div>
  )
}

export default App
