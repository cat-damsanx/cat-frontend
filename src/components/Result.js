import React from 'react';

function Result(props) {
    return (
        <>
            <img alt="plot img" src={`data:image/png;base64,${props.plotImg}`}/>
            <p>Final ability estimate level: {props.finalTheta}</p>
        </>
    )
}

export default Result;