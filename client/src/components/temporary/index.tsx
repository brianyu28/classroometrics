/**
 * Temporary component - for testing, not meant to be used in production.
 */

import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useState, useEffect } from 'react';

function Temporary() {
    const [messageHistory, setMessageHistory] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    const webSocketURL = (
        (location.protocol === 'https:' ? 'wss://' : 'ws://') +
        window.location.host + '/ws/example/'
    );
    const {sendJsonMessage, lastJsonMessage, readyState} = useWebSocket(webSocketURL);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            setMessageHistory(history => history.concat((lastJsonMessage as any).message));
        }
    }, [lastJsonMessage, setMessageHistory]);

    const updateCurrentMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMessage(event.target.value);
    };

    const submitMessage = () => {
        sendJsonMessage({message: currentMessage});
    };

    return (
        <div>
            Messages:
            <ul>
                {messageHistory.map((message, i) =>
                    <li key={i}>{message}</li>
                )}
            </ul>
            <input value={currentMessage} onChange={updateCurrentMessage} />
            <button onClick={submitMessage}>Submit</button>
        </div>
    );
}

export default Temporary;
