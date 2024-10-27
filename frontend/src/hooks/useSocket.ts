import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:9000";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onerror = () => {
            console.log("Error in connecting to websocket.");
        }
        ws.onopen = () => {
            setSocket(ws);
            console.log("Connected.");
        }
        ws.onclose = () => {
            console.log("Closing websocket");
            setSocket(null);
        }
        return () => {
            ws.close();
        }
    }, []);

    return socket;
}