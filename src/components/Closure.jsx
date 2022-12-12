import React, { useEffect, useState } from 'react'

function Closure({coutdown, today}) {

    const [nseconds, setNSeconds] = useState();
    const [nminutes, setNMinutes] = useState();
    const [nhours, setNHours] = useState();
    const [ndays, setNDays] = useState();
    
    const countdownDate = new Date(coutdown).getTime();
    const now = today;
    const distanceBase = countdownDate - now;
    
    let timer;
  
    useEffect(() => {
      timer = setInterval(() => {
        setNDays(Math.floor(distanceBase / (1000 * 60 * 60 * 24)));
        setNHours(
          Math.floor(
            (distanceBase % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ).toFixed(0)
        );
        setNMinutes(
          Math.floor((distanceBase % (1000 * 60 * 60)) / (1000 * 60)).toFixed(0)
        );
        setNSeconds(Math.floor((distanceBase % (1000 * 60)) / 1000).toFixed(0));
      }, 1000);
      return () => clearInterval(timer);
    });


  return (
    <h2> {`Prochaine fermeture dans: ${ndays}J ${nhours}H ${nminutes}M ${nseconds}s`}</h2>
  )
}

export default Closure