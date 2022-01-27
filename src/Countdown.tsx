import { useState, useEffect } from 'react'
import moment from 'moment';
import countdown from 'countdown'

function Countdown(props) {
  const [timeLeft, setTimeLeft] = useState<any>();

  useEffect(() => {
    
    const intervalId = setInterval(() => {
      setTimeLeft(countdown(moment.unix(props.time).toDate()).toString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [props.time]);

  return (
    <span className={props.containerClassName}>{timeLeft}</span>
  )
}

export default Countdown
