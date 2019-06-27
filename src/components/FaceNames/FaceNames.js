import React from 'react'
import './FaceNames.css'

const FaceNames = ({ boxes }) => {
    return (
        <div className='test1987'>
            {boxes.map(box => {
                return (
                    <div key={box.bottomRow}>
                        <p>This person is: {box.person} </p>
                        <p>Probability: {box.probability}</p>  
                    </div>
                )
            })}
        </div>
    )
}


export default FaceNames;