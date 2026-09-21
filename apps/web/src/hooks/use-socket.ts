'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('notification:new', () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unread-count'] });
    });

    socket.on('training:updated', () => {
      qc.invalidateQueries({ queryKey: ['trainings'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, qc]);

  return socketRef.current;
}
