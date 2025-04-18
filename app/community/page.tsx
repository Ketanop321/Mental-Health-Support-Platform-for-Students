"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Send, ThumbsUp, MessageSquare, Flag, Users, MessageCircle, PanelRight, PanelLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample user data
const currentUser = {
  id: "user1",
  name: "Alex Johnson",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "student",
}

// Sample community posts
const initialPosts = [
  {
    id: "post1",
    userId: "user2",
    userName: "Jamie Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    userRole: "student",
    content: "Just finished my exams and feeling so relieved! Anyone have tips for post-exam stress?",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    likes: 12,
    comments: 5,
    tags: ["stress", "exams"],
    liked: false,
  },
  {
    id: "post2",
    userId: "user3",
    userName: "Dr. Taylor Reed",
    userAvatar: "/placeholder.svg?height=40&width=40",
    userRole: "counselor",
    content:
      "Remember that self-care isn't selfish. Taking time for yourself is essential for mental health. What's one small thing you're doing for yourself today?",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
    likes: 24,
    comments: 8,
    tags: ["self-care", "wellness"],
    liked: false,
  },
  {
    id: "post3",
    userId: "user4",
    userName: "Morgan Lee",
    userAvatar: "/placeholder.svg?height=40&width=40",
    userRole: "student",
    content:
      "Having trouble sleeping lately due to anxiety about upcoming assignments. Any suggestions for better sleep?",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    likes: 8,
    comments: 12,
    tags: ["sleep", "anxiety"],
    liked: false,
  },
]

// Sample comments
const initialComments = {
  post1: [
    {
      id: "comment1",
      postId: "post1",
      userId: "user5",
      userName: "Riley Parker",
      userAvatar: "/placeholder.svg?height=40&width=40",
      userRole: "student",
      content:
        "I always plan something fun for after exams - maybe a movie night or a hike. It helps me decompress and transition back to normal life!",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), // 1.5 hours ago
      likes: 3,
    },
    {
      id: "comment2",
      postId: "post1",
      userId: "user3",
      userName: "Dr. Taylor Reed",
      userAvatar: "/placeholder.svg?height=40&width=40",
      userRole: "counselor",
      content:
        "Post-exam stress is common. Try deep breathing exercises and remember that you've done your best. The results are out of your hands now.",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
      likes: 5,
    },
  ],
  post2: [
    {
      id: "comment3",
      postId: "post2",
      userId: "user6",
      userName: "Jordan Wilson",
      userAvatar: "/placeholder.svg?height=40&width=40",
      userRole: "student",
      content: "I'm taking a 20-minute walk between classes today. Small but helps clear my mind!",
      timestamp: new Date(Date.now() - 3600000 * 7).toISOString(), // 7 hours ago
      likes: 4,
    },
  ],
  post3: [
    {
      id: "comment4",
      postId: "post3",
      userId: "user7",
      userName: "Casey Brown",
      userAvatar: "/placeholder.svg?height=40&width=40",
      userRole: "student",
      content: "I've been using a sleep meditation app that really helps. Also, no screens an hour before bed!",
      timestamp: new Date(Date.now() - 3600000 * 23).toISOString(), // 23 hours ago
      likes: 2,
    },
    {
      id: "comment5",
      postId: "post3",
      userId: "user3",
      userName: "Dr. Taylor Reed",
      userAvatar: "/placeholder.svg?height=40&width=40",
      userRole: "counselor",
      content:
        "Establishing a consistent sleep routine can help. Try to go to bed and wake up at the same time every day, even on weekends.",
      timestamp: new Date(Date.now() - 3600000 * 22).toISOString(), // 22 hours ago
      likes: 6,
    },
  ],
}

// Sample chat messages
const initialChatMessages = [
  {
    id: "msg1",
    userId: "system",
    userName: "Community Chat",
    content:
      "Welcome to the Community Chat! This is a safe space to connect with other students. Please be respectful and supportive.",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: "msg2",
    userId: "user8",
    userName: "Sam Thompson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Hey everyone! Anyone else struggling with balancing school and self-care?",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
  },
  {
    id: "msg3",
    userId: "user9",
    userName: "Alex Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "Definitely! I've been trying to schedule specific 'me time' in my calendar, but it's hard to stick to it.",
    timestamp: new Date(Date.now() - 3600000 * 0.9).toISOString(), // 54 minutes ago
  },
  {
    id: "msg4",
    userId: "user3",
    userName: "Dr. Taylor Reed",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content:
      "That's a great approach, Alex. Treating self-care as an important appointment can help prioritize it. Remember that even small breaks count!",
    timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(), // 48 minutes ago
  },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("forum")
  const [posts, setPosts] = useState(initialPosts)
  const [comments, setComments] = useState(initialComments)
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [newPost, setNewPost] = useState("")
  const [newComment, setNewComment] = useState("")
  const [newChatMessage, setNewChatMessage] = useState("")
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages, activeTab])

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    }
  }

  // Handle post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    const newPostObj = {
      id: `post${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      tags: extractTags(newPost),
      liked: false,
    }

    setPosts([newPostObj, ...posts])
    setNewPost("")

    toast({
      title: "Post created",
      description: "Your post has been shared with the community.",
    })
  }

  // Handle comment submission
  const handleCommentSubmit = (postId: string) => {
    if (!newComment.trim()) return

    const newCommentObj = {
      id: `comment${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
    }

    const updatedComments = { ...comments }
    if (!updatedComments[postId]) {
      updatedComments[postId] = []
    }
    updatedComments[postId] = [...updatedComments[postId], newCommentObj]

    // Update comment count on post
    const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post))

    setComments(updatedComments)
    setPosts(updatedPosts)
    setNewComment("")
  }

  // Handle chat message submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChatMessage.trim()) return

    const newMessageObj = {
      id: `msg${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newChatMessage,
      timestamp: new Date().toISOString(),
    }

    setChatMessages([...chatMessages, newMessageObj])
    setNewChatMessage("")
  }

  // Toggle like on a post
  const toggleLike = (postId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newLiked = !post.liked
        return {
          ...post,
          liked: newLiked,
          likes: newLiked ? post.likes + 1 : post.likes - 1,
        }
      }
      return post
    })
    setPosts(updatedPosts)
  }

  // Extract hashtags from content
  const extractTags = (content: string) => {
    const tags: string[] = []
    const matches = content.match(/#(\w+)/g)
    if (matches) {
      matches.forEach((match) => {
        tags.push(match.substring(1).toLowerCase())
      })
    }
    return tags
  }

  // Toggle post expansion
  const togglePostExpansion = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null)
    } else {
      setExpandedPost(postId)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">Connect with peers, share experiences, and support each other.</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="md:hidden">
          {showSidebar ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`md:col-span-2 space-y-6 ${!showSidebar ? "col-span-1" : "hidden md:block"}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="forum" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Discussion Forum</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Live Chat</span>
              </TabsTrigger>
            </TabsList>

            {/* Forum Tab */}
            <TabsContent value="forum" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Thoughts</CardTitle>
                  <CardDescription>Post a question, share an experience, or offer support to others.</CardDescription>
                </CardHeader>
                <form onSubmit={handlePostSubmit}>
                  <CardContent>
                    <Textarea
                      placeholder="What's on your mind? Use #hashtags for topics (e.g., #anxiety, #stress)"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      This is a supportive community. Please be respectful and follow our community guidelines.
                    </p>
                    <Button type="submit" disabled={!newPost.trim()}>
                      Post
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={post.userAvatar || "/placeholder.svg"} alt={post.userName} />
                          <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{post.userName}</span>
                            {post.userRole === "counselor" && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              >
                                Counselor
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</span>
                          </div>
                          <p className="text-sm">{post.content}</p>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-8 px-2"
                              onClick={() => toggleLike(post.id)}
                            >
                              <ThumbsUp className={`h-4 w-4 ${post.liked ? "fill-current text-primary" : ""}`} />
                              <span>{post.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-8 px-2"
                              onClick={() => togglePostExpansion(post.id)}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                              <Flag className="h-4 w-4" />
                              <span className="sr-only">Report</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {expandedPost === post.id && (
                      <div className="border-t px-4 py-3 space-y-4">
                        <h4 className="text-sm font-medium">Comments</h4>

                        {comments[post.id] && comments[post.id].length > 0 ? (
                          <div className="space-y-4">
                            {comments[post.id].map((comment) => (
                              <div key={comment.id} className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.userAvatar || "/placeholder.svg"} alt={comment.userName} />
                                  <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{comment.userName}</span>
                                    {comment.userRole === "counselor" && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                      >
                                        Counselor
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimestamp(comment.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Input
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => handleCommentSubmit(post.id)} disabled={!newComment.trim()}>
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Live Community Chat</CardTitle>
                  <CardDescription>
                    Chat in real-time with other community members. Please be respectful and supportive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${message.userId === currentUser.id ? "justify-end" : ""}`}
                    >
                      {message.userId !== "system" && message.userId !== currentUser.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.userAvatar || "/placeholder.svg"} alt={message.userName} />
                          <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.userId === "system"
                            ? "bg-muted text-center w-full text-sm"
                            : message.userId === currentUser.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                        }`}
                      >
                        {message.userId !== currentUser.id && message.userId !== "system" && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs font-medium">{message.userName}</span>
                            <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                          </div>
                        )}
                        <p className={`${message.userId === "system" ? "text-muted-foreground" : ""}`}>
                          {message.content}
                        </p>
                        {message.userId === currentUser.id && (
                          <div className="text-xs opacity-70 text-right mt-1">{formatTimestamp(message.timestamp)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </CardContent>
                <CardFooter className="border-t p-4">
                  <form onSubmit={handleChatSubmit} className="flex items-center gap-2 w-full">
                    <Input
                      placeholder="Type your message..."
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newChatMessage.trim()}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className={`space-y-6 ${showSidebar ? "col-span-1" : "hidden md:block"}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Taylor Reed" />
                      <AvatarFallback>TR</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dr. Taylor Reed</p>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      Counselor
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Message
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Jamie Smith" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Jamie Smith</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Message
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Morgan Lee" />
                      <AvatarFallback>ML</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Morgan Lee</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Message
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Riley Parker" />
                    <AvatarFallback>RP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Riley Parker</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Message
                </Button>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View All Members
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-sm">
                  #anxiety
                </Badge>
                <span className="text-xs text-muted-foreground">24 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-sm">
                  #stress
                </Badge>
                <span className="text-xs text-muted-foreground">18 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-sm">
                  #sleep
                </Badge>
                <span className="text-xs text-muted-foreground">15 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-sm">
                  #selfcare
                </Badge>
                <span className="text-xs text-muted-foreground">12 posts</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-sm">
                  #exams
                </Badge>
                <span className="text-xs text-muted-foreground">10 posts</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-none">
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Be Respectful</h3>
                <p className="text-xs text-muted-foreground">
                  Treat others with kindness and respect. No harassment or bullying.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Protect Privacy</h3>
                <p className="text-xs text-muted-foreground">
                  Don't share personal information about yourself or others.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Be Supportive</h3>
                <p className="text-xs text-muted-foreground">
                  This is a space for support, not medical advice. In crisis, seek professional help.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
