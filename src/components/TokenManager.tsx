"use client";

import { useState } from "react";
import { useTokens } from "../lib/useTokens";
import { useSession } from "next-auth/react";

export default function TokenManager() {
  const { data: session } = useSession();
  const {
    accessToken,
    refreshToken,
    validateToken,
    refreshTokens,
    revokeTokens,
    getAccessToken,
  } = useTokens();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleValidateToken = async () => {
    setLoading(true);
    try {
      const isValid = await validateToken();
      setResult(`Token validation: ${isValid ? "Valid" : "Invalid"}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshTokens = async () => {
    setLoading(true);
    try {
      const newTokens = await refreshTokens();
      if (newTokens) {
        setResult("Tokens refreshed successfully");
      } else {
        setResult("Failed to refresh tokens");
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeTokens = async () => {
    setLoading(true);
    try {
      const success = await revokeTokens();
      setResult(
        success ? "Tokens revoked successfully" : "Failed to revoke tokens"
      );
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestProtectedAPI = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setResult("No access token available");
        return;
      }

      const response = await fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setResult(`API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="p-4">Please sign in to access token management.</div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Token Management</h2>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Current Session</h3>
          <p>
            <strong>User:</strong> {session.user?.name}
          </p>
          <p>
            <strong>Email:</strong> {session.user?.email}
          </p>
          <p>
            <strong>Access Token:</strong>{" "}
            {accessToken ? "Present" : "Not available"}
          </p>
          <p>
            <strong>Refresh Token:</strong>{" "}
            {refreshToken ? "Present" : "Not available"}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleValidateToken}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Validate Token
          </button>

          <button
            onClick={handleRefreshTokens}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-2"
          >
            Refresh Tokens
          </button>

          <button
            onClick={handleTestProtectedAPI}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 ml-2"
          >
            Test Protected API
          </button>

          <button
            onClick={handleRevokeTokens}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 ml-2"
          >
            Revoke Tokens
          </button>
        </div>

        {result && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
