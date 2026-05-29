import { useState, useEffect, useCallback } from "react";
import * as connectionsApi from "../services/connectionsApi";

/**
 * Custom hook for managing candidate connection functionality
 * @param {number|string} userId - The user ID to connect with
 * @param {string} displayName - Display name for the user (used for logging)
 * @returns {Object} Connection state and functions
 */
const useCandidateConnect = (userId, displayName) => {
  const [status, setStatus] = useState({
    isConnected: false,
    pendingIncoming: false,
    pendingOutgoing: false,
    loading: true,
    error: null,
  });

const [connectLabel, setConnectLabel] = useState("Connect");
  const [connectDisabled, setConnectDisabled] = useState(false);

// Fetch connection status
  const checkConnectionStatus = useCallback(async () => {
    if (!userId) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));
      const statusData = await connectionsApi.getConnectionStatus(userId);
      
      // Handle different response formats
      const isConnected = statusData?.connected === true || statusData?.status === "connected";
      const pendingIncoming = statusData?.pendingIncoming === true || statusData?.status === "pending_incoming";
      const pendingOutgoing = statusData?.pendingOutgoing === true || statusData?.status === "pending_outgoing";

      setStatus({
        isConnected,
        pendingIncoming,
        pendingOutgoing,
        loading: false,
        error: null,
      });

      // Update button label based on status
      if (isConnected) {
        setConnectLabel("Connected");
        setConnectDisabled(true);
      } else if (pendingIncoming) {
        setConnectLabel("Respond");
        setConnectDisabled(false);
      } else if (pendingOutgoing) {
        setConnectLabel("Pending");
        setConnectDisabled(true);
      } else {
        setConnectLabel("Connect");
        setConnectDisabled(false);
      }
    } catch (error) {
      console.error("Error fetching connection status:", error);
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      // Default to Connect button if status check fails
      setConnectLabel("Connect");
      setConnectDisabled(false);
    }
  }, [userId]);

  // Initial status check
  useEffect(() => {
    checkConnectionStatus();
  }, [checkConnectionStatus]);

  // Send connection request
  const sendRequest = async () => {
    if (!userId || status.isConnected || status.pendingOutgoing) {
      return;
    }

    try {
      setConnectDisabled(true);
      await connectionsApi.sendConnectionRequest(userId);
      
      setStatus((prev) => ({
        ...prev,
        pendingOutgoing: true,
      }));
      setConnectLabel("Pending");
      setConnectDisabled(true);
      
      console.log(`Connection request sent to ${displayName} (ID: ${userId})`);
    } catch (error) {
      console.error("Error sending connection request:", error);
      setConnectDisabled(false);
      // Revert label on error
      if (!status.isConnected && !status.pendingOutgoing) {
        setConnectLabel("Connect");
      }
    }
  };

  return {
    sendRequest,
    connectLabel,
    connectDisabled,
    status,
    checkConnectionStatus,
  };
};

export default useCandidateConnect;
