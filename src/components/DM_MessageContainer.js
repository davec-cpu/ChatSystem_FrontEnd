import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';

const DM_MessageContainer = ({ directMessage, setDM, receiverName, setdm2, dm2 }) => {
  const params = useParams();
  const [senderData, setSenderData] = useState()
  const [receiverData, setReceiverData] = useState()

  const onMessageRightClick = (e, msgId, setdm2) => {
    console.log(e);
    e.preventDefault();
    console.log(msgId);
  }
  useEffect(() => {
    axios.get('https://localhost:7028/directmsg/'.concat(params.senderid).concat('/').concat(params.receiverid))
      .then(res => {  
        console.log(res.data);
        setDM([])
        setdm2([])
        res.data.map(msginfo => {
          let displayName = msginfo.sender.name
          if (msginfo.sender.id == params.senderid) {
            displayName = "You"
          }
          const msg = displayName + " said: " +  msginfo.content
          setDM(directMessage => [...directMessage, msg])

          const msgObj = {
            "id":1,
            "senderId": 1,
            "msg": displayName + " said: " +  msginfo.content
          }
          setdm2(dm2 => [...dm2, msgObj])
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
                <Button style={{backgroundColor: 'transparent', color: 'black', borderColor: 'transparent'}} onContextMenu={(e) => onMessageRightClick(e, msg.id)}> {msg}</Button>
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
