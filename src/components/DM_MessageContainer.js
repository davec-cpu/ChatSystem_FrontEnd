import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router';

const DM_MessageContainer = ({ directMessage, setDM, receiverName }) => {
  const params = useParams();
  const [senderData, setSenderData] = useState()
  const [receiverData, setReceiverData] = useState()

  useEffect(() => {
    axios.get('https://localhost:7028/directmsg/'.concat(params.senderid).concat('/').concat(params.receiverid))
      .then(res => {
        console.log(res.data);
        setDM([])
        res.data.map(msginfo => {
          let displayName = msginfo.sender.name
          if (msginfo.sender.id == params.senderid) {
            displayName = "You"
          }
          const msg = displayName + " said: " +  msginfo.content
          setDM(directMessage => [...directMessage, msg])
        })
      })
      .catch(err => console.log(err));
  }, [])

  return (
    <div>
      {
        (directMessage != null) ?
          (
            directMessage.map((msg) => {
              return (
                <p> {msg}</p>
              )
            })
          )
          :
          (<p>No message yet</p>)
      }
    </div>
  )
}

export default DM_MessageContainer
