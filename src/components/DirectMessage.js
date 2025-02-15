import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DM_MessageContainer from './DM_MessageContainer'
import DM_SendMessage from './DM_SendMessage'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DirectMessage = ({ sendDM, directMessage, setDM, setdm2, dm2 }) => {
    const [receiverName, setReceiverName] = useState();
    const params = useParams();

    useEffect (() => {
        axios.get('https://localhost:7028/'.concat(params.receiverid))
        .then((res) =>{
            setReceiverName(res.data.name);
        })
        .catch((err) =>{
            console.log(err);
        })
    })
    
    return (
        <div>
            {receiverName}
            <DM_MessageContainer directMessage={directMessage} setDM={setDM} receiverName={receiverName}  setdm2={setdm2} dm2={dm2} clasName='px-2'/>
            <DM_SendMessage sendDM={sendDM} senderid = {params.senderid} receiverid={params.receiverid} setdm2={setdm2}/>
        </div>
    )
}

export default DirectMessage
