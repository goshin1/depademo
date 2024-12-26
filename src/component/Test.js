import { useEffect, useState } from "react"

export default function Test(){

    const [time, setTime] = useState();
    useEffect(() => {
        let toDay = new Date();
        console.log(toDay);
        let month = (toDay.getMonth() + 1) < 10 ? "0" + (toDay.getMonth() + 1) : (toDay.getMonth() + 1);
        console.log(toDay.getFullYear() + "-" +
            month + "-" +
            toDay.getDate() + " " +
            toDay.getHours() + ":" + toDay.getMinutes() + ":" + toDay.getSeconds()
            )

    }, []);

    
    return <div>
        
       
    </div>
}

