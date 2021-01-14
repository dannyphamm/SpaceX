import React, { useState, useEffect } from 'react'
import moment from 'moment';
import countdown from 'countdown'

function Countdown(props) {
  const [timeLeft, setTimeLeft] = useState([]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(countdown(moment.unix(props.time)).toString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [props.time]);

  return (
    <span className={props.containerClassName}>{timeLeft}</span>
  )
}

export default Countdown
