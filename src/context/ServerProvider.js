import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"



export const ServerContext = createContext();

export const ServerProvider = (props) => {
    const params = useParams();
    const [roomId, setRoomId] = useState()

    useEffect(() => {
        setRoomId(params.id)
    }, [params.id])
    

    return(
        <ServerContext.Provider value={[roomId,setRoomId]}>
            {props.children}
        </ServerContext.Provider>
    )
}