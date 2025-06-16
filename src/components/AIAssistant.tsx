'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { 
  Send,
  Mic,
  StopCircle,
  Image as ImageIcon,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Filter,
  ChevronRight,
  ExternalLink,
  Camera,
  Monitor,
  Volume2,
  MessageCircle,
  Book,
  Users,
  Sparkles,
  Plus,
  History,
  Search,
  Bookmark,
  Star,
  ArrowRight,
  User,
  Download,
  Pause,
  Play,
  Trash2,
  Terminal,
  Copy,
  PlayCircle,
  Zap,
  Shield,
  FileText,
  Wrench
} from 'lucide-react'

// Add type declarations for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  image?: string
  imageAnalysis?: string
  isPlaying?: boolean
}

interface QuickHelpCategory {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  examples: string[]
}

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messageCount: number
}

interface KnowledgeArticle {
  id: string
  title: string
  category: string
  content: string
  tags: string[]
  lastUpdated: Date
  views: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  author: string
  rating: number
  bookmarked?: boolean
}

interface KnowledgeCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  articleCount: number
}

export default function EnhancedIRCADAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'settings' | 'knowledge'>('chat')
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: `Hello! I'm Sofia, your IRCAD AI Assistant! 👋

I'm here to help you with any technical issues using:

🔍 Visual Analysis - Upload photos of equipment problems
🎤 Voice Chat - Talk to me naturally  
💬 Text Support - Type your questions
🎯 Quick Help - Select common issue categories
🖥️ Screen Sharing - Show me your screen for real-time help
🤖 Auto-Fix - I can generate automated solutions

I can assist with:
• Medical equipment (cameras, laparoscopes, surgical robots)
• Computer and software problems  
• Network and connectivity issues
• Training and procedures
• Any other technical challenges

How can I help you today? Feel free to speak, type, share your screen, or show me a picture! ✨`,
      timestamp: new Date()
    }
  ])

  const [chatSessions] = useState<ChatSession[]>([
    { id: '1', title: 'Camera calibration issue', timestamp: new Date(Date.now() - 86400000), messageCount: 8 },
    { id: '2', title: 'Zen software troubleshooting', timestamp: new Date(Date.now() - 172800000), messageCount: 12 },
    { id: '3', title: 'Network connectivity problem', timestamp: new Date(Date.now() - 259200000), messageCount: 6 },
    { id: '4', title: 'Equipment maintenance guide', timestamp: new Date(Date.now() - 345600000), messageCount: 15 }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [showQuickHelp, setShowQuickHelp] = useState(false)
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null)
  const [playingMessageId, setPlayingMessageId] = useState<number | null>(null)
  const [lastInputWasVoice, setLastInputWasVoice] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null)
  const [screenCapture, setScreenCapture] = useState<string | null>(null)
  const [showAutomationPanel, setShowAutomationPanel] = useState(false)
  const [generatedFix, setGeneratedFix] = useState<any>(null)
  const [knowledgeSearchTerm, setKnowledgeSearchTerm] = useState('')
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const quickHelpCategories: QuickHelpCategory[] = [
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "Equipment Issues",
      description: "Camera, screen, hardware problems",
      color: "bg-red-50 hover:bg-red-100 border-red-200 text-red-700",
      examples: ["Camera not working", "Black screen issue", "Equipment damage"]
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "Software Problems", 
      description: "App won't open, computer is slow, software crashes",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700",
      examples: ["Zen software crash", "Computer freezing", "App won't start"]
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "Network Issues",
      description: "WiFi, connectivity, internet problems",
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700", 
      examples: ["No internet", "WiFi not working", "Connection slow"]
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "Training & Guides",
      description: "Equipment tutorials, user manuals, procedures",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700",
      examples: ["How to use laparoscope", "Axiocam setup", "Training materials"]
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "Access & Login", 
      description: "Password issues, login problems, account access",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700",
      examples: ["Forgot password", "Can't login", "Account locked"]
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      title: "General Help",
      description: "Any other questions or technical support",
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700",
      examples: ["Need assistance", "Technical question", "Other issues"]
    }
  ]

  const knowledgeCategories: KnowledgeCategory[] = [
    { id: 'all', name: 'All Articles', icon: <ImageIcon className="w-4 h-4" />, color: 'text-gray-600', articleCount: 42 },
    { id: 'equipment', name: 'Medical Equipment', icon: <ImageIcon className="w-4 h-4" />, color: 'text-red-600', articleCount: 15 },
    { id: 'software', name: 'Software & Applications', icon: <ImageIcon className="w-4 h-4" />, color: 'text-blue-600', articleCount: 12 },
    { id: 'network', name: 'Network & Connectivity', icon: <ImageIcon className="w-4 h-4" />, color: 'text-emerald-600', articleCount: 8 },
    { id: 'procedures', name: 'Procedures & Protocols', icon: <ImageIcon className="w-4 h-4" />, color: 'text-purple-600', articleCount: 7 }
  ]

  const knowledgeArticles: KnowledgeArticle[] = [
    {
      id: '1',
      title: 'Axiocam Camera Calibration Guide',
      category: 'equipment',
      content: `# Axiocam Camera Calibration Guide

## Overview
This guide will walk you through the complete calibration process for Axiocam cameras used in IRCAD facilities.

## Prerequisites
- Administrator access to the workstation
- Axiocam camera connected and powered
- Zen software installed and updated
- Calibration target (provided with camera)

## Step-by-Step Calibration

### 1. Initial Setup
1. Launch Zen software as Administrator
2. Navigate to **Acquisition** → **Camera Settings**
3. Verify camera is detected in device list
4. Set exposure time to **Auto**

### 2. White Balance Calibration
1. Place white calibration target under microscope
2. Adjust illumination to 50% intensity
3. Click **White Balance** → **Auto Calibration**
4. Wait for completion (typically 30-60 seconds)

### 3. Color Calibration
1. Replace white target with color calibration target
2. Select **Color Calibration** from Tools menu
3. Follow on-screen prompts for each color patch
4. Save calibration profile with date stamp

### 4. Verification
1. Capture test image with known sample
2. Compare with reference image
3. Check color accuracy and sharpness
4. Repeat calibration if results are unsatisfactory

## Troubleshooting
- **Camera not detected**: Check USB connections and driver installation
- **Poor color accuracy**: Ensure proper illumination and clean optics
- **Calibration fails**: Restart Zen software and try again

## Maintenance Schedule
- Weekly: Quick white balance check
- Monthly: Full calibration procedure
- Quarterly: Professional service check`,
      tags: ['axiocam', 'calibration', 'camera', 'zen', 'microscopy'],
      lastUpdated: new Date(2024, 11, 15),
      views: 1247,
      difficulty: 'Intermediate',
      estimatedTime: '15-20 min',
      author: 'IRCAD Technical Team',
      rating: 4.8
    },
    {
      id: '2',
      title: 'Zen Software Troubleshooting',
      category: 'software',
      content: `# Zen Software Troubleshooting Guide

## Common Issues and Solutions

### Startup Problems
**Issue**: Zen won't start or crashes on startup
**Solutions**:
1. Run as Administrator
2. Check Windows compatibility mode
3. Clear temporary files: C:\Users\[username]\AppData\Local\Zeiss
4. Reinstall Visual C++ Redistributables

### Performance Issues
**Issue**: Slow image acquisition or processing
**Solutions**:
1. Close unnecessary applications
2. Check available RAM (minimum 8GB recommended)
3. Verify hard drive space (minimum 10GB free)
4. Update graphics drivers

### Camera Connection Issues
**Issue**: Camera not detected or disconnects frequently
**Solutions**:
1. Check USB cable and ports
2. Update camera drivers
3. Disable USB power management
4. Try different USB 3.0 port

## Error Codes
- **Error 0x80004005**: Permission issue - run as Administrator
- **Error 0x80070005**: Access denied - check file permissions
- **Error 0xC0000135**: Missing .NET Framework

## Advanced Troubleshooting
Use Windows Event Viewer to check for detailed error logs under:
Applications and Services Logs → Zeiss → ZEN`,
      tags: ['zen', 'software', 'troubleshooting', 'startup', 'performance'],
      lastUpdated: new Date(2024, 11, 10),
      views: 892,
      difficulty: 'Beginner',
      estimatedTime: '10-15 min',
      author: 'Sofia AI Assistant',
      rating: 4.6
    },
    {
      id: '3',
      title: 'Network Configuration for Medical Devices',
      category: 'network',
      content: `# Network Configuration for Medical Devices

## IRCAD Network Architecture

### VLAN Configuration
- **VLAN 10**: Administrative network (192.168.10.0/24)
- **VLAN 20**: Medical devices (192.168.20.0/24)
- **VLAN 30**: Research equipment (192.168.30.0/24)
- **VLAN 40**: Guest network (192.168.40.0/24)

### Device IP Assignment
Medical devices should be configured with static IPs in the 192.168.20.x range:
- Axiocam systems: 192.168.20.10-50
- Surgical robots: 192.168.20.51-70
- Monitoring equipment: 192.168.20.71-90

### Security Protocols
1. **WPA3-Enterprise** for wireless connections
2. **802.1X** authentication for wired connections
3. **Firewall rules** limiting inter-VLAN communication
4. **Regular security audits** and penetration testing

### Troubleshooting Network Issues
1. **ping** test to verify connectivity
2. **ipconfig /all** to check IP configuration
3. **nslookup** to verify DNS resolution
4. **telnet** to test specific port connectivity

## Best Practices
- Use dedicated network switches for medical equipment
- Implement network segmentation for security
- Regular monitoring of network performance
- Backup configurations regularly`,
      tags: ['network', 'VLAN', 'security', 'medical-devices', 'configuration'],
      lastUpdated: new Date(2024, 11, 8),
      views: 654,
      difficulty: 'Advanced',
      estimatedTime: '25-30 min',
      author: 'IRCAD IT Department',
      rating: 4.9
    },
    {
      id: '4',
      title: 'Laparoscope Maintenance and Care',
      category: 'equipment',
      content: `# Laparoscope Maintenance and Care

## Daily Maintenance

### Pre-Use Inspection
1. **Visual inspection** for cracks or damage
2. **Light transmission test** - check for dark spots
3. **Angulation test** - verify smooth movement
4. **Leak test** - submerge in sterile water

### Post-Use Cleaning
1. **Immediate pre-cleaning** - remove gross contamination
2. **Manual cleaning** with enzymatic detergent
3. **Ultrasonic cleaning** for detailed cleaning
4. **High-level disinfection** or sterilization

## Weekly Maintenance

### Comprehensive Inspection
- Check fiber optic bundles for broken fibers
- Test all electrical connections
- Verify proper storage in protective cases
- Document any issues in maintenance log

### Performance Testing
- Light intensity measurement
- Image quality assessment
- Color accuracy verification
- Focus performance check

## Troubleshooting Common Issues

### Dim or Dark Image
**Causes**: Broken fiber optics, faulty light source, dirty lens
**Solutions**: 
1. Check light source bulb
2. Inspect fiber optic cable
3. Clean all lens surfaces
4. Test with different light source

### Poor Image Quality
**Causes**: Contaminated lens, improper white balance, damaged optics
**Solutions**:
1. Clean with appropriate lens solution
2. Recalibrate white balance
3. Check for physical damage
4. Professional service if needed

## Storage and Transport
- Always use protective cases
- Avoid extreme temperatures
- Store in clean, dry environment
- Use lens caps when not in use`,
      tags: ['laparoscope', 'maintenance', 'cleaning', 'inspection', 'troubleshooting'],
      lastUpdated: new Date(2024, 11, 5),
      views: 2156,
      difficulty: 'Intermediate',
      estimatedTime: '20-25 min',
      author: 'IRCAD Surgical Team',
      rating: 4.7
    },
    {
      id: '5',
      title: 'Emergency Procedures for Equipment Failure',
      category: 'procedures',
      content: `# Emergency Procedures for Equipment Failure

## Immediate Response Protocol

### Step 1: Assess the Situation
- **Patient safety first** - ensure no immediate danger
- **Identify failed equipment** - note specific device and error
- **Document failure time** - record exact time of failure
- **Notify team** - alert relevant personnel immediately

### Step 2: Implement Backup Procedures
- **Activate backup systems** - switch to redundant equipment
- **Manual procedures** - revert to non-electronic methods if safe
- **Adjust surgical plan** - modify approach based on available tools
- **Communicate changes** - keep entire team informed

## Equipment-Specific Procedures

### Surgical Robot Failure
1. **Emergency stop** - activate red emergency button
2. **Manual mode** - switch to direct manipulation if possible
3. **Backup instruments** - prepare conventional surgical tools
4. **Technical support** - contact manufacturer immediately

### Imaging System Failure
1. **Switch to backup camera** - if available
2. **Alternative visualization** - use direct vision methods
3. **Document workaround** - record alternative approach
4. **Post-procedure analysis** - review what went wrong

### Network Connectivity Loss
1. **Local storage** - save data to local drives
2. **Manual documentation** - paper-based recording
3. **Isolated operation** - continue with offline systems
4. **Gradual restoration** - systematically restore connections

## Post-Incident Protocol

### Immediate Actions
1. **Complete documentation** - detailed incident report
2. **Equipment isolation** - remove failed equipment from service
3. **Safety review** - assess if protocols worked effectively
4. **Stakeholder notification** - inform management and quality assurance

### Follow-up Actions
1. **Root cause analysis** - determine exact cause of failure
2. **Preventive measures** - implement changes to prevent recurrence
3. **Staff training** - update procedures based on lessons learned
4. **Equipment maintenance** - review and update maintenance schedules

## Contact Information
- **Emergency Technical Support**: ext. 911
- **Equipment Manufacturer Hotlines**: See device manuals
- **IRCAD IT Support**: ext. 247
- **Safety Officer**: ext. 199`,
      tags: ['emergency', 'procedures', 'safety', 'equipment-failure', 'protocol'],
      lastUpdated: new Date(2024, 11, 12),
      views: 1834,
      difficulty: 'Advanced',
      estimatedTime: '30-35 min',
      author: 'IRCAD Safety Committee',
      rating: 4.9,
      bookmarked: true
    }
  ]

  // Voice synthesis with human-like female voice
  const speakText = (text: string, messageId: number) => {
    if (!voiceEnabled || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const cleanText = text
      .replace(/\n+/g, '. ')
      .replace(/•/g, '')
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/🔍|🎤|💬|🎯|👋|✨|🖥️|🤖/g, '')
      .replace(/IRCAD/g, 'Ircad')
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)

    utterance.rate = 0.85
    utterance.pitch = 1.2
    utterance.volume = 0.9

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferredVoiceNames = [
        'Google UK English Female',
        'Microsoft Zira - English (United States)',
        'Samantha',
        'Kate',
        'Anna',
        'Google US English',
        'Alex'
      ]

      for (const voiceName of preferredVoiceNames) {
        const voice = voices.find(v => v.name === voiceName)
        if (voice) {
          utterance.voice = voice
          return
        }
      }

      const femaleVoices = voices.filter(voice => 
        voice.lang.startsWith('en') && (
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('kate') ||
          voice.name.toLowerCase().includes('anna') ||
          voice.name.toLowerCase().includes('google')
        )
      )

      if (femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0]
      } else {
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'))
        if (englishVoices.length > 0) {
          utterance.voice = englishVoices[0]
        }
      }
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice()
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice
    }

    utterance.onstart = () => {
      setPlayingMessageId(messageId)
      setCurrentSpeech(utterance)
    }

    utterance.onend = () => {
      setPlayingMessageId(null)
      setCurrentSpeech(null)
    }

    utterance.onerror = () => {
      setPlayingMessageId(null)
      setCurrentSpeech(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeech = () => {
    window.speechSynthesis.cancel()
    setPlayingMessageId(null)
    setCurrentSpeech(null)
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (!voiceEnabled) {
      stopSpeech()
    }
  }

  // Auto-speak AI responses ONLY when voice input was used
  useEffect(() => {
    if (voiceEnabled && messages.length > 0 && lastInputWasVoice) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role !== 'user' && lastMessage.id !== 1) {
        setTimeout(() => {
          speakText(lastMessage.content, lastMessage.id)
        }, 800)
      }
      setLastInputWasVoice(false)
    }
  }, [messages, voiceEnabled, lastInputWasVoice, speakText])

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        setLastInputWasVoice(true)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  // Screen Sharing Functions
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })

      setScreenStream(stream)
      setIsScreenSharing(true)

      // Capture initial screenshot
      captureScreenshot(stream)

      // Set up periodic screenshots (every 3 seconds)
      const captureInterval = setInterval(() => {
        if (stream.active) {
          captureScreenshot(stream)
        } else {
          clearInterval(captureInterval)
        }
      }, 3000)

      // Handle stream end
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
        clearInterval(captureInterval)
      }

      // Add message about screen sharing
      const shareMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: "🖥️ Screen sharing started! Sofia can now see your screen and help with real-time troubleshooting. I'll analyze what you're showing me every few seconds.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, shareMessage])

    } catch (error) {
      console.error('Error starting screen share:', error)
      alert('Screen sharing not supported or permission denied. Please ensure you\'re using a modern browser and grant permission.')
    }
  }

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop())
      setScreenStream(null)
    }
    setIsScreenSharing(false)
    setScreenCapture(null)

    const stopMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: "🖥️ Screen sharing stopped. Thanks for letting me see your screen! If you need more help, feel free to start sharing again or ask me any questions.",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, stopMessage])
  }

  const captureScreenshot = async (stream: MediaStream) => {
    try {
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const screenshot = canvas.toDataURL('image/jpeg', 0.8)
          setScreenCapture(screenshot)
          
          // Analyze the screenshot automatically
          analyzeScreenshot(screenshot)
        }
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error)
    }
  }

  const analyzeScreenshot = async (screenshot: string) => {
    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Please analyze this screen capture and provide technical support guidance. Look for any error messages, unusual interface elements, or issues that might need attention. Also suggest any automated fixes if applicable.",
          image: screenshot,
          systemPrompt: `You are Sofia, providing real-time screen sharing support for IRCAD Africa.

Analyze the screen capture and provide:
1. What you observe on the screen
2. Any issues or errors visible
3. Specific suggestions for improvement
4. Next steps for troubleshooting

If you identify fixable technical issues, also suggest automated solutions like:
- Commands to run
- Configuration changes
- Software installations
- System repairs

Be helpful and provide actionable insights. Focus on what you can actually see in the image.`
        })
      })

      if (response.ok) {
        const data = await response.json()

        const analysisMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: `📊 Screen Analysis: ${data.response}`,
          timestamp: new Date(),
          imageAnalysis: 'Screen analyzed'
        }

        setMessages(prev => [...prev, analysisMessage])

        // Check if response contains automation suggestions
        const hasAutomation = data.response.includes('```') || 
                            data.response.toLowerCase().includes('command') ||
                            data.response.toLowerCase().includes('script') ||
                            data.response.toLowerCase().includes('fix') ||
                            data.response.toLowerCase().includes('install') ||
                            data.response.toLowerCase().includes('download')

        // If automation suggestions found, show automation panel
        if (hasAutomation) {
          setGeneratedFix({
            id: Date.now(),
            analysis: data.response,
            timestamp: new Date()
          })
          setShowAutomationPanel(true)
        }

        // Auto-speak if voice was recently used
        if (voiceEnabled && lastInputWasVoice) {
          setTimeout(() => {
            speakText(data.response, analysisMessage.id)
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error analyzing screenshot:', error)

      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now(),
        role: 'assistant',
        content: "I had trouble analyzing the screen capture. Please make sure you're sharing your screen and try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const generateAutomatedFix = async (problemDescription: string) => {
    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate automated fix solutions for: ${problemDescription}`,
          systemPrompt: `You are Sofia, an expert automation specialist for IRCAD Africa technical support.

Generate practical automated solutions including:

1. **Windows PowerShell/CMD Commands**
2. **Registry Fixes** (if safe and necessary)
3. **Configuration Files** 
4. **Download Scripts**
5. **Installation Commands**
6. **System Repair Commands**

Provide:
- Clear code blocks for each solution
- Safety warnings for risky operations
- Step-by-step execution instructions
- Alternative methods if primary fails
- Verification commands to check if fix worked

Focus on IRCAD equipment: Axiocam, Zen software, network issues, medical software problems.

Format each solution clearly with headers and explanations.`
        })
      })

      if (response.ok) {
        const data = await response.json()

        setGeneratedFix({
          id: Date.now(),
          analysis: data.response,
          problemDescription,
          timestamp: new Date()
        })
        setShowAutomationPanel(true)

        const fixMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: `🔧 Automated Fix Generated: ${data.response}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, fixMessage])
      }
    } catch (error) {
      console.error('Error generating automated fix:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard! You can now paste and run this command.')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Copy failed. Please manually select and copy the text.')
    }
  }

  const openKnowledgeArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article)
    // Increment view count (in real app, this would update the database)
    article.views += 1
  }

  const askSofiaAboutArticle = (article: KnowledgeArticle) => {
    const message = `I'm looking at the knowledge base article "${article.title}". Can you help me understand this better or answer questions about it?`
    sendMessage(message)
    setActiveTab('chat')
  }

  const searchKnowledgeBase = (query: string) => {
    setKnowledgeSearchTerm(query)
    if (query.trim()) {
      // In a real app, this would trigger a search API call
      const message = `I'm searching for "${query}" in the knowledge base. Can you help me find relevant information about this topic?`
      sendMessage(message)
      setActiveTab('chat')
    }
  }

  const getFilteredArticles = () => {
    let filtered = knowledgeArticles

    // Filter by category
    if (selectedKnowledgeCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedKnowledgeCategory)
    }

    // Filter by search term
    if (knowledgeSearchTerm.trim()) {
      const searchLower = knowledgeSearchTerm.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    return filtered
  }

  const downloadScript = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image too large. Please use an image under 5MB.')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setSelectedImage(imageData)
        setImagePreview(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() && !selectedImage && !isScreenSharing) return

    const finalMessage = textToSend || (selectedImage ? "I've uploaded an image for analysis." : "")

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: finalMessage,
      timestamp: new Date(),
      image: selectedImage || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setShowQuickHelp(false)

    const imageData = selectedImage

    setInput('')
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend || "Please analyze this image and provide technical diagnosis and troubleshooting steps.",
          image: imageData,
          systemPrompt: `You are Sofia, a friendly and expert technical support specialist for IRCAD Africa. You have a warm, professional personality and help with all types of equipment and software issues.

Respond as Sofia with a friendly, helpful tone. Keep responses clear and professional but with personality. You help with medical equipment, computers, network systems, scientific instruments, and any other technical systems.

Provide practical solutions with a caring, supportive approach. Be encouraging and make users feel comfortable asking for help.`
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        imageAnalysis: imageData ? 'Image analyzed' : undefined
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('AI Error:', error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Oops! I had a little trouble with that request. Please check your connection and try again. If this keeps happening, let me know and I\'ll help you contact IT support! 😊',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }
    setLoading(false)
  }

  const handleQuickHelp = (category: QuickHelpCategory) => {
    const message = `I need help with ${category.title.toLowerCase()}: ${category.description}`
    sendMessage(message)
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  const openFileSelector = () => {
    fileInputRef.current?.click()
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const startNewChat = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Hello! I'm Sofia, your IRCAD AI Assistant! How can I help you with your technical challenges today? ✨",
      timestamp: new Date()
    }])
    setActiveTab('chat')
  }

  // Floating Assistant Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group w-16 h-16 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden"
          title="Open AI Assistant"
        >
          <div className="relative z-10">
            <ImageIcon className="w-8 h-8 mx-auto" />
          </div>
          <div className="flex absolute top-1 right-1 space-x-0.5">
            <Camera className="w-3 h-3 bg-green-400 rounded-full p-0.5" aria-hidden="true" />
            {voiceEnabled && <Volume2 className="w-3 h-3 bg-teal-400 rounded-full p-0.5" aria-hidden="true" />}
            <Mic className="w-3 h-3 bg-cyan-400 rounded-full p-0.5" aria-hidden="true" />
            {isScreenSharing && <Monitor className="w-3 h-3 bg-orange-400 rounded-full p-0.5" aria-hidden="true" />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full animate-ping opacity-40"></div>
        </button>
      </div>
    )
  }

  // Minimized State
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg shadow-lg p-3 flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div className="text-white">
            <p className="text-sm font-medium">Sofia - IRCAD Assistant</p>
            <p className="text-xs opacity-80">Click to expand</p>
          </div>
          <button
            onClick={toggleMinimize}
            className="p-1 text-white hover:bg-white/20 rounded transition-colors"
            title="Minimize window"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-white hover:bg-white/20 rounded transition-colors"
            title="Close window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Main Assistant Interface
  const assistantWidth = isMaximized ? 'w-[90vw]' : 'w-[600px]'
  const assistantHeight = isMaximized ? 'h-[85vh]' : 'h-[500px]'
  const positioning = isMaximized ? 'top-4 left-4' : 'bottom-6 right-6'

  return (
    <div className={`fixed ${positioning} z-50 ${assistantWidth} ${assistantHeight} bg-white rounded-xl shadow-2xl border border-gray-200 flex overflow-hidden`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-48 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-2 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-md flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xs">Sofia</h3>
                <p className="text-xs text-gray-600">Support</p>
              </div>
            </div>
            
            <button
              onClick={startNewChat}
              className="w-full flex items-center space-x-1 px-2 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-md hover:from-teal-600 hover:to-emerald-600 transition-colors text-xs"
              title="Start new chat"
            >
              <ImageIcon className="w-3 h-3" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-1 py-1.5 text-xs font-medium ${
                activeTab === 'chat' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-3 h-3 mx-auto mb-0.5" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-1 py-1.5 text-xs font-medium ${
                activeTab === 'history' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-3 h-3 mx-auto mb-0.5" />
              History
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex-1 px-1 py-1.5 text-xs font-medium ${
                activeTab === 'knowledge' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-3 h-3 mx-auto mb-0.5" />
              Knowledge
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-1 py-1.5 text-xs font-medium ${
                activeTab === 'settings' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-3 h-3 mx-auto mb-0.5" />
              Settings
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-1.5">
            {activeTab === 'chat' && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Quick Actions</h4>
                {quickHelpCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickHelp(category)}
                    className={`w-full p-1.5 rounded-md border text-left transition-all hover:scale-105 ${category.color}`}
                  >
                    <div className="flex items-center space-x-1 mb-0.5">
                      <div className="w-3 h-3">{category.icon}</div>
                      <span className="text-xs font-medium">{category.title}</span>
                    </div>
                    <p className="text-xs opacity-75 leading-tight">{category.description}</p>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Recent</h4>
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-1.5 bg-white rounded-md border border-gray-200 hover:border-teal-300 cursor-pointer transition-colors"
                  >
                    <h5 className="text-xs font-medium text-gray-900 mb-0.5 leading-tight">{session.title}</h5>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{session.messageCount} msgs</span>
                      <span>{session.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-2">
                {/* Search */}
                <div className="relative">
                  <ImageIcon className="w-3 h-3 absolute left-2 top-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search knowledge base..."
                    value={knowledgeSearchTerm}
                    onChange={(e) => setKnowledgeSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchKnowledgeBase(knowledgeSearchTerm)}
                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-gray-700">Categories</h4>
                  {knowledgeCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedKnowledgeCategory(category.id)}
                      className={`w-full p-1.5 rounded-md text-left transition-all text-xs flex items-center justify-between ${
                        selectedKnowledgeCategory === category.id 
                          ? 'bg-teal-100 border border-teal-300 text-teal-700' 
                          : 'bg-white border border-gray-200 hover:border-teal-300'
                      }`}
                      title={`View ${category.name} articles`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className={category.color}>{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">({category.articleCount})</span>
                    </button>
                  ))}
                </div>

                {/* Recent Articles */}
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-gray-700">Recent Articles</h4>
                  {getFilteredArticles().slice(0, 3).map((article) => (
                    <button
                      key={article.id}
                      onClick={() => openKnowledgeArticle(article)}
                      className="w-full p-1.5 bg-white rounded-md border border-gray-200 hover:border-teal-300 text-left transition-all"
                      title={`Read article: ${article.title}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="text-xs font-medium text-gray-900 leading-tight">{article.title}</h5>
                        {article.bookmarked && <ImageIcon className="w-3 h-3 text-yellow-500 fill-current" />}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{article.difficulty}</span>
                        <span>•</span>
                        <span>{article.estimatedTime}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <ImageIcon className="w-2.5 h-2.5 text-yellow-400 fill-current mr-0.5" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-2">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">Voice</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Responses</span>
                    <button
                      onClick={toggleVoice}
                      className={`w-6 h-3 rounded-full transition-colors ${
                        voiceEnabled ? 'bg-teal-500' : 'bg-gray-300'
                      }`}
                      title={voiceEnabled ? "Turn off voice responses" : "Turn on voice responses"}
                    >
                      <div className={`w-2 h-2 bg-white rounded-full transition-transform ${
                        voiceEnabled ? 'translate-x-3' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">Interface</h4>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="w-full text-left text-xs text-gray-600 hover:text-gray-900"
                    title="Hide sidebar"
                  >
                    Hide Sidebar
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">About</h4>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p>IRCAD Assistant</p>
                    <p>Sofia AI v1.0</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Show sidebar"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-sm">Sofia</h3>
                <p className="text-xs opacity-90 flex items-center space-x-1">
                  <span>Online</span>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {voiceEnabled && <ImageIcon className="w-3 h-3" aria-hidden="true" />}
              <ImageIcon className="w-3 h-3" aria-hidden="true" />
              <ImageIcon className="w-3 h-3" aria-hidden="true" />
              {isScreenSharing && <ImageIcon className="w-3 h-3 text-orange-300" aria-hidden="true" />}
            </div>
            <div className="w-px h-4 bg-white/30 mx-1"></div>
            <button
              onClick={toggleMinimize}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Minimize window"
            >
              <ImageIcon className="w-3 h-3" />
            </button>
            <button
              onClick={toggleMaximize}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title={isMaximized ? "Restore window" : "Maximize window"}
            >
              <ImageIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Close window"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Knowledge Article Viewer */}
        {selectedArticle && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col">
            {/* Article Header */}
            <div className="p-3 border-b bg-gradient-to-r from-teal-50 to-emerald-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-gray-900 mb-1">{selectedArticle.title}</h2>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded">{selectedArticle.difficulty}</span>
                    <span>•</span>
                    <span>{selectedArticle.estimatedTime}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <ImageIcon className="w-2.5 h-2.5 text-yellow-400 fill-current mr-0.5" />
                      <span>{selectedArticle.rating}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                  title="Close article"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Article Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => askSofiaAboutArticle(selectedArticle)}
                  className="flex items-center space-x-1 px-2 py-1 bg-teal-500 text-white rounded text-xs hover:bg-teal-600"
                  title="Ask Sofia about this article"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Ask Sofia</span>
                </button>
                <button
                  onClick={() => downloadScript(selectedArticle.content, `${selectedArticle.title}.md`)}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  title="Download article"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    selectedArticle.bookmarked = !selectedArticle.bookmarked
                    setSelectedArticle({...selectedArticle})
                  }}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                    selectedArticle.bookmarked 
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={selectedArticle.bookmarked ? "Remove bookmark" : "Bookmark article"}
                >
                  <ImageIcon className={`w-3 h-3 ${selectedArticle.bookmarked ? 'fill-current' : ''}`} />
                  <span>{selectedArticle.bookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="prose prose-sm max-w-none">
                <div className="text-xs leading-relaxed whitespace-pre-wrap text-gray-800">
                  {selectedArticle.content}
                </div>
              </div>
              
              {/* Article Footer */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div>
                    <span>By {selectedArticle.author}</span>
                    <span className="mx-2">•</span>
                    <span>Updated {selectedArticle.lastUpdated.toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white ml-8 shadow-teal-200' 
                  : 'bg-white mr-8 border border-gray-200 shadow-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs flex items-center space-x-1 ${msg.role === 'user' ? 'text-teal-100' : 'text-gray-600'}`}>
                  <span className="font-medium">{msg.role === 'user' ? 'You' : 'Sofia'}</span>
                  <span>•</span>
                  <span>{msg.timestamp.toLocaleTimeString()}</span>
                  {msg.imageAnalysis && (
                    <>
                      <span>•</span>
                      <ImageIcon className="w-3 h-3" />
                      <span className="text-emerald-600 font-medium">Analysis</span>
                    </>
                  )}
                </div>
                {msg.role !== 'user' && (
                  <button
                    onClick={() => playingMessageId === msg.id ? stopSpeech() : speakText(msg.content, msg.id)}
                    className={`p-1.5 rounded-full transition-all shadow-sm ${
                      playingMessageId === msg.id 
                        ? 'bg-teal-500 text-white animate-pulse shadow-teal-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-teal-600 border border-gray-300'
                    }`}
                    title={playingMessageId === msg.id ? 'Stop Sofia' : 'Hear Sofia'}
                  >
                    {playingMessageId === msg.id ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
              
              {msg.image && (
                <div className="mb-3">
                  <Image 
                    src={msg.image} 
                    alt="Equipment analysis" 
                    width={300}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
              )}
              
              <div className={`text-xs leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-teal-600 mr-8 p-3 bg-white rounded-lg border-2 border-teal-200 shadow-sm">
              <ImageIcon className="w-4 h-4 animate-spin" />
              <span className="text-xs font-medium">Sofia is thinking...</span>
              {voiceEnabled && lastInputWasVoice && <ImageIcon className="w-3 h-3 animate-bounce text-emerald-500" />}
            </div>
          )}
        </div>

        {/* Image Preview */}
        {selectedImage && imagePreview && (
          <div className="p-4 border-t bg-gradient-to-r from-teal-50 to-emerald-50">
            <div className="flex items-start space-x-3">
              <div className="relative w-16 h-16">
                <Image 
                  src={imagePreview} 
                  alt="Preview of uploaded image" 
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-2">
                  Image ready for analysis. Sofia will help identify any issues.
                </p>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center space-x-1"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Automation Panel */}
        {showAutomationPanel && generatedFix && (
          <div className="p-3 border-t bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-bold text-purple-700">Automated Fix Available</h4>
              </div>
              <button
                onClick={() => setShowAutomationPanel(false)}
                className="p-1 text-purple-500 hover:bg-purple-100 rounded"
                title="Close automation panel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-purple-200 mb-3">
              <div className="text-xs text-gray-800 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {generatedFix.analysis}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(generatedFix.analysis)}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                title="Copy commands to clipboard"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Copy Commands</span>
              </button>
              <button
                onClick={() => downloadScript(generatedFix.analysis, `ircad-fix-${Date.now()}.txt`)}
                className="flex items-center space-x-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                title="Download fix script"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Download Script</span>
              </button>
              <button
                onClick={() => {
                  const fixMessage: Message = {
                    id: Date.now(),
                    role: 'assistant',
                    content: "🔧 I've generated an automated fix for your issue! Please:\n\n1. Copy the commands using the button above\n2. Open Command Prompt or PowerShell as Administrator\n3. Paste and run the commands\n4. Let me know if you need help with any step!\n\n⚠️ Always review commands before running them for security.",
                    timestamp: new Date()
                  }
                  setMessages(prev => [...prev, fixMessage])
                  setShowAutomationPanel(false)
                }}
                className="flex items-center space-x-1 px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                title="Get guided help with the fix"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Guide Me</span>
              </button>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="p-4 border-t bg-white">
          {/* Quick Help Toggle */}
          {!showSidebar && (
            <div className="mb-3">
              <button
                onClick={() => setShowQuickHelp(!showQuickHelp)}
                className="flex items-center space-x-2 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                title={showQuickHelp ? "Hide quick help" : "Show quick help"}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Quick Help</span>
              </button>
            </div>
          )}

          {/* Quick Help Categories (when sidebar is hidden) */}
          {showQuickHelp && !showSidebar && (
            <div className="mb-4 p-4 bg-slate-50 rounded-lg border">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Help Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickHelpCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickHelp(category)}
                    className={`p-3 rounded-lg border text-left transition-all hover:scale-105 ${category.color}`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {category.icon}
                      <span className="text-sm font-medium">{category.title}</span>
                    </div>
                    <p className="text-xs opacity-75">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls Row */}
          <div className="flex space-x-2 mb-3">
            <button
              onClick={openCamera}
              className="flex items-center space-x-1 px-2 py-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors text-xs"
              title="Take a photo"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Photo</span>
            </button>
            <button
              onClick={openFileSelector}
              className="flex items-center space-x-1 px-2 py-1.5 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors text-xs"
              title="Upload an image"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Upload</span>
            </button>
            <button
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              className={`flex items-center space-x-1 px-2 py-1.5 rounded-md transition-colors text-xs ${
                isScreenSharing 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
              title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
            >
              {isScreenSharing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isScreenSharing ? 'Stop Share' : 'Screen'}</span>
            </button>
            <button
              onClick={() => generateAutomatedFix("General technical issue requiring automated solution")}
              className="flex items-center space-x-1 px-2 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-xs"
              title="Generate automated fix"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Auto-Fix</span>
            </button>
            {selectedImage && (
              <div className="flex items-center text-xs text-emerald-700 bg-emerald-100 px-2 py-1.5 rounded-md border border-emerald-300">
                <ImageIcon className="w-3 h-3 mr-1" />
                <span>Image Ready!</span>
              </div>
            )}
            {isScreenSharing && (
              <div className="flex items-center text-xs text-orange-700 bg-orange-100 px-2 py-1.5 rounded-md border border-orange-300">
                <ImageIcon className="w-3 h-3 mr-1" />
                <span>Sharing Screen</span>
              </div>
            )}
          </div>

          {/* Main Input */}
          <div className="flex space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm placeholder-gray-500"
              placeholder={
                isScreenSharing 
                  ? "Ask about what you're sharing..." 
                  : selectedImage 
                    ? "Describe what you see (optional)" 
                    : "Ask Sofia anything or speak your question..."
              }
              aria-label="Message input"
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-xl transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white shadow-sm`}
              title={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => sendMessage()}
              disabled={loading || (!input.trim() && !selectedImage && !isScreenSharing)}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-teal-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* File Inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            className="hidden"
            aria-label="Camera input"
            title="Take a photo"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            aria-label="File input"
            title="Upload an image"
          />

          {/* Status Bar */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              {isListening && (
                <div className="flex items-center space-x-1 text-red-600 font-medium">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening...</span>
                </div>
              )}
              {showAutomationPanel && (
                <div className="flex items-center space-x-1 text-purple-600 font-medium">
                  <ImageIcon className="w-3 h-3" />
                  <span>Auto-fix ready</span>
                </div>
              )}
              {isScreenSharing && (
                <div className="flex items-center space-x-1 text-orange-600 font-medium">
                  <ImageIcon className="w-3 h-3" />
                  <span>Sharing Screen</span>
                </div>
              )}
              {voiceEnabled && (
                <div className="flex items-center space-x-1 text-teal-600 font-medium">
                  <ImageIcon className="w-3 h-3" />
                  <span>Sofia voice ready</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <ImageIcon className="w-3 h-3" />
              <span>AI Powered by IRCAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}