// WebSocket Service Layer
// Handles connection management, reconnection, heartbeat, and event routing

type WebSocketEventType = 
  | "message.created"
  | "message.updated"
  | "message.deleted"
  | "presence.updated"
  | "typing.started"
  | "typing.stopped"
  | "channel.updated"
  | "user.joined"
  | "user.left"
  | "reaction.added"
  | "reaction.removed"

interface WebSocketEvent<T = unknown> {
  type: WebSocketEventType
  channel_id?: string
  user_id?: string
  payload: T
  timestamp: number
}

interface WebSocketConfig {
  url: string
  token?: string
  reconnectAttempts?: number
  reconnectInterval?: number
  heartbeatInterval?: number
}

type EventCallback<T = unknown> = (event: WebSocketEvent<T>) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private config: Required<WebSocketConfig>
  private reconnectAttempts = 0
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private eventListeners: Map<string, Set<EventCallback>> = new Map()
  private subscriptions: Set<string> = new Set()
  private isConnecting = false
  private isIntentionalClose = false

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      token: config.token || "",
      reconnectAttempts: config.reconnectAttempts ?? 10,
      reconnectInterval: config.reconnectInterval ?? 3000,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        reject(new Error("Connection already in progress"))
        return
      }

      this.isConnecting = true
      this.isIntentionalClose = false

      const url = new URL(this.config.url)
      if (this.config.token) {
        url.searchParams.set("token", this.config.token)
      }

      try {
        this.ws = new WebSocket(url.toString())

        this.ws.onopen = () => {
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.resubscribe()
          this.emit("connection", { type: "connected" })
          resolve()
        }

        this.ws.onclose = (event) => {
          this.isConnecting = false
          this.stopHeartbeat()
          this.emit("connection", { type: "disconnected", code: event.code })
          
          if (!this.isIntentionalClose) {
            this.attemptReconnect()
          }
        }

        this.ws.onerror = (error) => {
          this.isConnecting = false
          this.emit("error", { error })
          reject(error)
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketEvent
            this.handleMessage(data)
          } catch (err) {
            console.error("[WebSocket] Failed to parse message:", err)
          }
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect(): void {
    this.isIntentionalClose = true
    this.stopHeartbeat()
    this.clearReconnectTimer()
    
    if (this.ws) {
      this.ws.close(1000, "Client disconnect")
      this.ws = null
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.reconnectAttempts) {
      this.emit("error", { error: new Error("Max reconnection attempts reached") })
      return
    }

    this.reconnectAttempts++
    this.emit("connection", { 
      type: "reconnecting", 
      attempt: this.reconnectAttempts,
      maxAttempts: this.config.reconnectAttempts
    })

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(console.error)
    }, this.config.reconnectInterval * Math.min(this.reconnectAttempts, 5))
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: "ping", timestamp: Date.now() })
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private handleMessage(event: WebSocketEvent): void {
    // Handle pong
    if (event.type === "pong" as WebSocketEventType) {
      return
    }

    // Emit to type-specific listeners
    this.emit(event.type, event)

    // Emit to channel-specific listeners if applicable
    if (event.channel_id) {
      this.emit(`channel:${event.channel_id}`, event)
    }

    // Emit to wildcard listeners
    this.emit("*", event)
  }

  private emit(eventType: string, data: unknown): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.forEach(callback => callback(data as WebSocketEvent))
    }
  }

  on<T = unknown>(eventType: string, callback: EventCallback<T>): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }
    this.eventListeners.get(eventType)!.add(callback as EventCallback)

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType)
      if (listeners) {
        listeners.delete(callback as EventCallback)
      }
    }
  }

  off(eventType: string, callback?: EventCallback): void {
    if (callback) {
      const listeners = this.eventListeners.get(eventType)
      if (listeners) {
        listeners.delete(callback)
      }
    } else {
      this.eventListeners.delete(eventType)
    }
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn("[WebSocket] Cannot send, connection not open")
    }
  }

  subscribe(channelId: string): void {
    this.subscriptions.add(channelId)
    this.send({ type: "subscribe", channel_id: channelId })
  }

  unsubscribe(channelId: string): void {
    this.subscriptions.delete(channelId)
    this.send({ type: "unsubscribe", channel_id: channelId })
  }

  private resubscribe(): void {
    this.subscriptions.forEach(channelId => {
      this.send({ type: "subscribe", channel_id: channelId })
    })
  }

  updateToken(token: string): void {
    this.config.token = token
    this.send({ type: "auth", token })
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  get connectionState(): "connecting" | "connected" | "disconnected" | "reconnecting" {
    if (this.isConnecting) return "connecting"
    if (this.ws?.readyState === WebSocket.OPEN) return "connected"
    if (this.reconnectTimer) return "reconnecting"
    return "disconnected"
  }
}

// Singleton instance factory
let wsInstance: WebSocketService | null = null

export function getWebSocketService(config?: WebSocketConfig): WebSocketService {
  if (!wsInstance && config) {
    wsInstance = new WebSocketService(config)
  }
  if (!wsInstance) {
    throw new Error("WebSocket service not initialized. Call with config first.")
  }
  return wsInstance
}

export function initWebSocket(config: WebSocketConfig): WebSocketService {
  wsInstance = new WebSocketService(config)
  return wsInstance
}

export { WebSocketService }
export type { WebSocketEvent, WebSocketEventType, WebSocketConfig }
