import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();

    return () => {
      // Không disconnect ở đây vì socket được share globally
    };
  }, []);

  return socketRef.current;
}

export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void
) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
