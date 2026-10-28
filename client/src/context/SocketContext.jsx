import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    // In Vite dev, the proxy handles socket.io
    const newSocket = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setConnected(false);
    });

    // Universal event recorder for live ticker
    const registerEvent = (eventType, payload) => {
      setLiveEvents((prev) => [
        { type: eventType, payload, timestamp: new Date().toISOString(), id: Math.random().toString() },
        ...prev.slice(0, 49),
      ]);
    };

    newSocket.on('incident:created', (data) => registerEvent('incident:created', data));
    newSocket.on('incident:updated', (data) => registerEvent('incident:updated', data));
    newSocket.on('alert:created', (data) => registerEvent('alert:created', data));
    newSocket.on('field_report:created', (data) => registerEvent('field_report:created', data));
    newSocket.on('shelter:updated', (data) => registerEvent('shelter:updated', data));
    newSocket.on('team:assigned', (data) => registerEvent('team:assigned', data));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, liveEvents }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
