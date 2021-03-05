import React from 'react';

export function WatchListItem(props) {
    return (
        <div>
            <p>{props.index==0 ? 'Player X: ' + props.name : ''}</p>
            <p>{props.index==1 ? 'Player O: ' + props.name : ''}</p>
            <p>{props.index>=2 ? 'Spectator: ' + props.name : ''}</p>
        </div>
    );
    
}