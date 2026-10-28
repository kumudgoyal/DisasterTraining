import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    const isVercel =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('netlify.app') ||
        window.location.hostname.includes('github.io'));

    // Universal event recorder for live ticker
    const registerEvent = (eventType, payload) => {
      setLiveEvents((prev) => [
        { type: eventType, payload, timestamp: new Date().toISOString(), id: Math.random().toString() },
        ...prev.slice(0, 49),
      ]);
    };

    if (isVercel) {
      // In-browser mock socket event bus for Vercel demo
      setConnected(true);
      const handleCustomEvent = (e) => {
        if (e.detail?.type) {
          registerEvent(e.detail.type, e.detail.payload);
        }
      };
      window.addEventListener('dmecs:socket_event', handleCustomEvent);

      const mockSocket = {
        connected: true,
        on: (event, cb) => {
          const l = (e) => {
            if (e.detail?.type === event) cb(e.detail.payload);
          };
          window.addEventListener('dmecs:socket_event', l);
          return () => window.removeEventListener('dmecs:socket_event', l);
        },
        emit: (event, payload) => {
          registerEvent(event, payload);
        },
        disconnect: () => {},
      };
      setSocket(mockSocket);

      return () => {
        window.removeEventListener('dmecs:socket_event', handleCustomEvent);
      };
    }

    // Connect to real backend socket.io server
    const newSocket = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 3,
      timeout: 5000,
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('connect_error', () => {
      setConnected(false);
    });

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
