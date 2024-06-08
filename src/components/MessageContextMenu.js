import React from 'react'
import { useState } from 'react';

const MessageContextMenu = ({ contextMenuItems, coordinates }) => {
    console.log("render context menu");  
    return (
        <div className='context-menu' 
        style={{top: coordinates.y, left: coordinates.x, position: 'absolute' }}>
            {
                contextMenuItems.map((item, index) => {
                    <div key={index}>
                        <span>{item.title}</span>
                    </div>
                })
            }
        </div>
    )
}

export default MessageContextMenu
