"use client"

import { useState } from "react"

interface UseApiCallProps {
  apiFunction: () => Promise<any>
  timeout?: number
}

interface UseApiCallReturn {
  isLoading: boolean
  error: string | null
  data: any
  executeCall: () => Promise<void>
}

export function useApiCall({ 
  apiFunction, 
  timeout = 8000 // 8 seconds default timeout
}: UseApiCallProps): UseApiCallReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const executeCall = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("API_TIMEOUT"))
        }, timeout)
      })

      // Race between the API call and timeout
      const result = await Promise.race([
        apiFunction(),
        timeoutPromise
      ])

      setData(result)
    } catch (err: any) {
      if (err.message === "API_TIMEOUT") {
        setError("API_TIMEOUT")
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    data,
    executeCall
  }
}