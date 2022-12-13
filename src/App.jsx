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
  const sixMonths = 15778476000;
  const today = new Date().getTime() - sixMonths;
  console.log(today,  "today");
  

  
  const url = 'https://opendata.bordeaux-metropole.fr/api/records/1.0/search/?dataset=previsions_pont_chaban&q=&rows=80&sort=date_passage&facet=bateau';
  
  /* Charge les horaires de fermetures du pont Chaban Delmas */
  const getClosure = () => {
    axios.get(url).then((response) => {
      setClosures(response.data.records.filter((closure) => new Date(closure.fields.date_passage).getTime() > today).reverse());
    });
  }

  const getBoat = ()=> {
      axios.get(url).then((response) => {
        setBoat(response.data.records.filter((closure) => new Date(closure.fields.date_passage).getTime()> today).map((closure) => closure.fields.bateau));
      })
  }

  const getDates = () => {
      axios.get(url).then((response) => {
        setDate(response.data.records.filter((closure) => new Date(closure.fields.date_passage).getTime()> today).map((closure) => closure.fields.date_passage));
      })
  }
  

/* Gère fermeture prochaine ou passée NOTA: Remplacer array date par test pour tester les fermetures futures */

  const setCountdown = () => {
    setLastClosure(date.pop())
  }
  

/*   Charge les requêtes au démarrage de l'application */

useEffect(() => {
  getClosure(),
  getBoat(),
  getDates();

}, []);

 useEffect(()=>{
 date && setCountdown()
}, [closures])


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
    <div className="flex flex-col ">
      <div className="flex h-screen flex-col">
      <Title title={"Test technique Dotsafe"}/>
      <Subtitle subtitle={"Fermetures du pont Chaban Delmas"}/>
      {lastClosure && <Closure coutdown={lastClosure}/>}
    <form className = "m-4 border-solid border-2 border-black p-2">
        <label className="text-blue-600" htmlFor="date">
          Fermeture le {""}  
          <select className ="text-center" id="date" onChange={selectDate} >
            <option value="">---</option>
            {date && date.map((date) => (<option value={date}>{date}</option>))}
          </select>
        </label>
        <label className="text-blue-600" htmlFor="boat">
         Motif de fermeture{""}  
          <select className ="text-center text-blue-600" id="boat" onChange={selectBoat}>
            <option value="">---</option>
            {boat && boat.map((boat) => (<option value={boat}>{boat}</option>))}
          </select>
        </label>
      </form>
      <table className="border-separate border-spacing-2 border border-slate-700 ">
        <thead>
        <tr>
            <th className="border border-slate-300 ">Date de fermeture</th>
            <th className="border border-slate-300 ">Heure de fermeture</th>
            <th className="border border-slate-300 ">Heure de réouverture</th>
            <th className="border border-slate-300 ">Bateau</th>
        </tr>
        </thead>
        <tbody>
        {closures
        .filter ((closure) => dateFilter==="" || closure.fields.date_passage === dateFilter)
        .filter ((closure) => boatFilter==="" || closure.fields.bateau === boatFilter)
        .map((closure) => (<tr>
          <td className="border border-slate-300 text-center">{closure.fields.date_passage}</td>
          <td className="border border-slate-300 text-center">{closure.fields.fermeture_a_la_circulation}</td>
          <td className="border border-slate-300 text-center">{closure.fields.re_ouverture_a_la_circulation}</td>
          <td className="border border-slate-300 text-center">{closure.fields.bateau}</td>
          </tr>
          ))}
          </tbody>
    </table>
          </div>
    </div>
  )
}

export default App
