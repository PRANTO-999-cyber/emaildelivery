import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Custom hook for managing WebSocket connection lifecycle and real-time delivery event subscriptions.
 *
 * @param {Object} options
 * @param {string} [options.url] - WebSocket server endpoint URL
 * @param {string} [options.tenantId] - Active workspace ID for channel isolation
 * @param {boolean} [options.autoConnect=true] - Connect automatically on mount
 * @returns {Object} Connection status, real-time payload stream, and emission utilities
 */
export function useSocket({
  url = process.env.NEXT_PUBLIC_SOCKET_URL ||
    "wss://api.myproject.com/telemetry",
  tenantId = null,
  autoConnect = true,
} = {}) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    try {
      // Initialize WebSocket connection with tenant authentication query
      const wsUrl = tenantId ? `${url}?tenantId=${tenantId}` : url;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setLastEvent(parsedData);
        } catch (err) {
          console.warn("Received non-JSON socket message:", event.data);
        }
      };

      ws.onerror = (error) => {
        setConnectionError("WebSocket connection error occurred");
        console.error("WebSocket Error:", error);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      socketRef.current = ws;
    } catch (err) {
      setConnectionError(err.message);
      setIsConnected(false);
    }
  }, [url, tenantId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((eventName, payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          event: eventName,
          payload,
          timestamp: new Date().toISOString(),
        }),
      );
    } else {
      console.warn("Socket unavailable. Message not transmitted:", eventName);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    lastEvent,
    connectionError,
    connect,
    disconnect,
    emit,
  };
}

export default useSocket;
