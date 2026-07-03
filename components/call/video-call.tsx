"use client"

import { useState } from "react"
import { m } from "framer-motion"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Monitor,
  Users,
  Settings,
  MessageSquare,
  Maximize2,
  MoreVertical,
  Pin,
  Hand,
  Smile,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Participant {
  id: string
  name: string
  avatar?: string
  avatarFallback: string
  isMuted: boolean
  isVideoOn: boolean
  isSpeaking: boolean
  isHost: boolean
}

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "You",
    avatarFallback: "JD",
    isMuted: false,
    isVideoOn: true,
    isSpeaking: false,
    isHost: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatarFallback: "SC",
    isMuted: true,
    isVideoOn: true,
    isSpeaking: true,
    isHost: false,
  },
  {
    id: "3",
    name: "Alex Johnson",
    avatarFallback: "AJ",
    isMuted: false,
    isVideoOn: false,
    isSpeaking: false,
    isHost: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    avatarFallback: "ED",
    isMuted: true,
    isVideoOn: true,
    isSpeaking: false,
    isHost: false,
  },
]

export function VideoCall() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const getGridClass = () => {
    const count = mockParticipants.length
    if (count <= 1) return "grid-cols-1"
    if (count <= 2) return "grid-cols-2"
    if (count <= 4) return "grid-cols-2"
    if (count <= 6) return "grid-cols-3"
    return "grid-cols-4"
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Team Standup</span>
            <Badge variant="secondary" className="text-xs">
              00:32:15
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {mockParticipants.length}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className={`grid ${getGridClass()} gap-4 h-full`}>
            {mockParticipants.map((participant) => (
              <m.div
                key={participant.id}
                layout
                className={`relative rounded-xl overflow-hidden bg-zinc-900 ${
                  participant.isSpeaking ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                {participant.isVideoOn ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
                    {/* Placeholder for video stream */}
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-3xl">
                        {participant.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500/50 to-blue-500/50 text-3xl">
                        {participant.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* Participant Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {participant.name}
                      </span>
                      {participant.isHost && (
                        <Badge className="bg-violet-500/20 text-violet-300 text-xs">
                          Host
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.isMuted && (
                        <div className="p-1 rounded bg-red-500/20">
                          <MicOff className="h-3 w-3 text-red-400" />
                        </div>
                      )}
                      {!participant.isVideoOn && (
                        <div className="p-1 rounded bg-zinc-500/20">
                          <VideoOff className="h-3 w-3 text-zinc-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Speaking indicator */}
                {participant.isSpeaking && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20">
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <m.div
                          key={i}
                          className="w-1 bg-emerald-400 rounded-full"
                          animate={{
                            height: [4, 12, 4],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-emerald-400">Speaking</span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50">
                    <Pin className="h-4 w-4" />
                  </Button>
                </div>
              </m.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 p-4 border-t border-border/50 bg-zinc-900/50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
                className="rounded-full h-12 w-12"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={!isVideoOn ? "destructive" : "secondary"}
                size="lg"
                className="rounded-full h-12 w-12"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isVideoOn ? "Turn off camera" : "Turn on camera"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="lg"
                className="rounded-full h-12 w-12"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <Monitor className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isScreenSharing ? "Stop sharing" : "Share screen"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full h-12 w-12"
              >
                <Hand className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Raise hand</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full h-12 w-12"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reactions</TooltipContent>
          </Tooltip>

          <div className="w-px h-8 bg-border/50 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showParticipants ? "default" : "secondary"}
                size="lg"
                className="rounded-full h-12 w-12"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <Users className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Participants</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showChat ? "default" : "secondary"}
                size="lg"
                className="rounded-full h-12 w-12"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chat</TooltipContent>
          </Tooltip>

          <div className="w-px h-8 bg-border/50 mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full h-12 px-6"
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                Leave
              </Button>
            </TooltipTrigger>
            <TooltipContent>Leave call</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
