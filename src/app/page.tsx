'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Wrench, 
  BookOpen, 
  AlertCircle, 
  Search, 
  Users, 
  Shield,
  ArrowRight,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  Activity,
  LucideIcon,
  Menu,
  X,
  ChevronDown,
  Play,
  Star,
  ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -12, transition: { duration: 0.3 } }}
    className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
  >
    {/* Background gradient on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Floating icon */}
    <motion.div
      whileHover={{ scale: 1.15, rotate: 10 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      className="relative z-10 w-20 h-20 bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl"
    >
      <Icon className="w-10 h-10 text-white" />
      
      {/* Orbital ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-teal-300/30 rounded-2xl scale-125"
      />
    </motion.div>
    
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed mb-6">
        {description}
      </p>
      
      {/* Interactive CTA */}
      <motion.div
        whileHover={{ x: 8 }}
        className="flex items-center text-teal-600 font-semibold cursor-pointer group-hover:text-teal-700"
      >
        <span>Explore Feature</span>
        <ArrowUpRight className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
      </motion.div>
    </div>

    {/* Decorative elements */}
    <div className="absolute top-4 right-4 w-12 h-12 bg-teal-100/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute bottom-4 left-4 w-8 h-8 bg-blue-100/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  </motion.div>
)

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0.95, 1])
  const { user, loading } = useAuth()

  const features = [
    {
      title: 'Device Troubleshooting',
      description: 'Step-by-step interactive guides for Axiocam, Zen software, Telehealth Robot, and Laparoscope with real-time diagnostics and smart error detection.',
      icon: Wrench
    },
    {
      title: 'AI Knowledge Base',
      description: 'Intelligent searchable repository with 4K+ video tutorials, error code solutions, and machine learning-powered recommendations.',
      icon: BookOpen
    },
    {
      title: 'Smart Incident Management',
      description: 'Advanced ticket system with automated routing, priority classification, predictive analytics, and real-time resolution tracking.',
      icon: AlertCircle
    },
    {
      title: 'Instant Search',
      description: 'Natural language search with voice commands, image recognition, filters, tags, and instant results across all documentation.',
      icon: Search
    },
    {
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools, expert video calls, screen sharing, and knowledge sharing across all staff levels worldwide.',
      icon: Users
    },
    {
      title: 'Enterprise Security',
      description: 'Military-grade encryption, role-based permissions, audit trails, and compliance ensuring sensitive medical data protection.',
      icon: Shield
    }
  ]

  const stats = [
    { icon: Zap, number: '99.9%', label: 'System Uptime' },
    { icon: Clock, number: '< 30s', label: 'Avg Response Time' },
    { icon: TrendingUp, number: '85%', label: 'Efficiency Boost' },
    { icon: CheckCircle, number: '2,500+', label: 'Issues Resolved' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Enhanced Header */}
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo with hover effect */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
            >
              <div className="bg-teal-600 text-white px-4 py-2 rounded-lg mr-3 shadow-lg">
                <div className="font-bold text-lg leading-tight">
                  <div>ircad</div>
                  <div className="text-xs opacity-90">Assistant</div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Dashboard', 'Guides', 'Knowledge Base', 'Support', 'Analytics'].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  <a href={item === 'Dashboard' ? "/dashboard" : "#"} className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                    <span>{item}</span>
                    <ChevronDown className="w-4 h-4 opacity-60" />
                  </a>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></div>
                </motion.div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
        >
          <div className="px-6 py-4 space-y-4">
            {['Dashboard', 'Guides', 'Knowledge Base', 'Support', 'Analytics'].map((item) => (
              <a key={item} href={item === 'Dashboard' ? "/dashboard" : "#"} className="block py-2 text-gray-700 hover:text-teal-600 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.header>

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" />
          
          {/* Animated mesh gradient */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-600/20 via-transparent to-blue-600/20 animate-pulse" />
            <motion.div
              animate={{
                background: [
                  "radial-gradient(600px circle at 20% 30%, rgba(20,184,166,0.15), transparent 40%)",
                  "radial-gradient(600px circle at 80% 70%, rgba(20,184,166,0.15), transparent 40%)",
                  "radial-gradient(600px circle at 40% 60%, rgba(20,184,166,0.15), transparent 40%)",
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0"
            />
          </div>

          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-teal-400"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          {/* Flowing particles */}
          {typeof window !== 'undefined' && Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-teal-400 rounded-full"
            />
          ))}

          {/* Medical cross pattern */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 opacity-5">
            <svg viewBox="0 0 24 24" className="w-full h-full text-teal-400">
              <path fill="currentColor" d="M19 8h-2V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-white space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center px-4 py-2 bg-teal-600/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse"></div>
                Internal Technical Support System
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  <span className="block text-white">IRCAD</span>
                  <span className="block bg-gradient-to-r from-teal-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                    Assistant
                  </span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl"
              >
                Revolutionize technical operations with AI-powered diagnostics,
                intelligent troubleshooting, and seamless equipment management for 
                <span className="text-teal-300 font-semibold"> IRCAD Africa&apos;s world-class surgical training center</span>.
              </motion.p>

              {/* Key Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="grid md:grid-cols-2 gap-4"
              >
                {[{
                  icon: Zap, text: "Instant Problem Resolution" },
                  { icon: Shield, text: "Enterprise-Grade Security" },
                  { icon: Activity, text: "Real-Time Monitoring" },
                  { icon: TrendingUp, text: "Predictive Maintenance" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-600/20 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{benefit.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {user ? (
                  // Logged-in user sees dashboard button
                  <Link
                    href="/dashboard"
                    className="group bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-2xl"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  // Non-logged-in users see login/register options
                  <>
                    <Link
                      href="/login"
                      className="group bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center shadow-2xl"
                    >
                      <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/register"
                      className="border-2 border-gray-600 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-teal-400 hover:text-teal-400 transition-all duration-300 backdrop-blur-sm"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Add user info if logged in */}
              {user && (
                <div className="text-center mt-4">
                  <p className="text-gray-600">
                    Welcome back, <span className="font-semibold text-teal-600">{user.firstName}</span>!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="relative flex items-center justify-center"
            >
              {/* Central Dashboard Preview */}
              <div className="relative">
                {/* Main dashboard mockup */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                >
                  {/* Dashboard header */}
                  <div className="h-12 bg-teal-600/20 border-b border-white/10 flex items-center px-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-white/80 text-sm font-medium">IRCAD Assistant Dashboard</div>
                  </div>
                  
                  {/* Dashboard content */}
                  <div className="p-6 space-y-4">
                    {/* Status indicators */}
                    <div className="flex justify-between items-center">
                      <div className="text-white/60 text-sm">System Status</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Operational</span>
                      </div>
                    </div>
                    
                    {/* Progress bars */}
                    {[85, 92, 78].map((progress, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-white/60 text-xs">
                          <span>Equipment {index + 1}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: 1 + index * 0.2, duration: 1 }}
                            className="bg-gradient-to-r from-teal-400 to-blue-400 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* Recent alerts */}
                    <div className="space-y-3 pt-4">
                      <div className="text-white/60 text-sm">Recent Alerts</div>
                      {[{
                        type: "success", message: "Axiocam calibrated successfully" },
                        { type: "warning", message: "Zen software update available" },
                        { type: "info", message: "Maintenance scheduled for Lab 2" }
                      ].map((alert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2 + index * 0.3 }}
                          className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            alert.type === 'success' ? 'bg-green-400' :
                            alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`}></div>
                          <span className="text-white/70 text-xs">{alert.message}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating stats cards */}
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                    className={`absolute w-24 h-20 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 ${
                      index === 0 ? '-top-8 -left-12' :
                      index === 1 ? '-top-4 -right-16' :
                      index === 2 ? '-bottom-8 -left-16' :
                      '-bottom-4 -right-12'
                    }`}
                  >
                    <stat.icon className="w-6 h-6 text-teal-400 mb-1" />
                    <div className="text-white font-bold text-sm">{stat.number}</div>
                    <div className="text-white/60 text-xs leading-tight">{stat.label}</div>
                  </motion.div>
                ))}

                {/* Orbital rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-teal-400/20 rounded-full scale-125"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-blue-400/20 rounded-full scale-150"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 cursor-pointer z-10"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-3 font-medium">Explore Features</span>
            <div className="w-6 h-10 border-2 border-teal-400/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-teal-400 rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Revolutionary Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-teal-100 rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Cutting-Edge Technology
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
              Powerful Features for{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Technical Excellence
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute bottom-2 left-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                />
              </span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              Revolutionary AI-powered solutions engineered specifically for IRCAD Africa&apos;s 
              world-class medical training environment. Experience the future of technical support.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Stats Section */}
      <section className="relative py-24 bg-gradient-to-r from-teal-600 via-teal-700 to-blue-700 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transforming Medical Operations
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Real-time insights and performance metrics that drive excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
              icon: Activity, number: "99.9%", label: "Equipment Uptime", detail: "Maximum reliability" },
              { icon: Clock, number: "< 30s", label: "Response Time", detail: "Lightning fast support" },
              { icon: TrendingUp, number: "85%", label: "Efficiency Gain", detail: "Measurable improvement" },
              { icon: Users, number: "24/7", label: "Support Coverage", detail: "Always available" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group text-center bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-4xl font-black text-white mb-2"
                >
                  {stat.number}
                </motion.div>
                
                <div className="text-white/90 font-semibold mb-2">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="relative py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full blur-2xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Trusted by Medical Professionals
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Excellence in{' '}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Every Operation
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from the medical professionals who rely on IRCAD Assistant daily
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {[{
              text: "IRCAD Assistant has revolutionized our technical support operations. Equipment downtime is now virtually eliminated, and our surgical training programs run seamlessly.",
              author: "Dr. Sarah Mukamana",
              role: "Lead Surgeon, IRCAD Africa",
              avatar: "SM",
              rating: 5
            },
            {
              text: "The AI-powered diagnostic capabilities are incredible. Our technical team has become 10x more efficient in resolving complex equipment issues.",
              author: "Jean Baptiste Ndayisenga",
              role: "Technical Director, IRCAD Africa",
              avatar: "JB",
              rating: 5
            }].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Quote decoration */}
                <div className="absolute top-6 left-6 text-6xl text-teal-100 font-serif leading-none">&quot;</div>
                
                {/* Stars */}
                <div className="flex mb-6 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic relative z-10">
                  {testimonial.text}
                </p>
                
                <div className="flex items-center relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-blue-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 overflow-hidden">
        {/* Dynamic background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 bg-teal-600/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium backdrop-blur-sm mb-8">
              <div className="w-2 h-2 bg-teal-400 rounded-full mr-3 animate-pulse"></div>
              Ready to Transform Operations
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
              Experience the{' '}
              <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Future of Support
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join IRCAD Africa in revolutionizing medical technology support. 
              Experience AI-powered diagnostics, predictive maintenance, and seamless operations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 30px 60px rgba(20, 184, 166, 0.4)",
                y: -5 
              }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 flex items-center justify-center"
            >
              <Activity className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              <span>Launch IRCAD Assistant</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-gray-500 text-gray-300 px-12 py-5 rounded-2xl font-bold text-xl hover:border-teal-400 hover:text-teal-400 transition-all duration-300 backdrop-blur-sm"
            >
              Schedule Demo
            </motion.button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[{
              icon: Zap, text: "Instant Deployment" },
              { icon: Shield, text: "Enterprise Security" },
              { icon: Users, text: "24/7 Expert Support" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 text-gray-300">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-teal-400" />
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ultra-Modern Footer */}
      <footer className="relative bg-gray-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          {/* Main footer content */}
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg mr-4 shadow-lg">
                    <div className="font-bold text-lg leading-tight">
                      <div>ircad</div>
                      <div className="text-xs opacity-90">Assistant</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">IRCAD Assistant</div>
                    <div className="text-gray-400 text-sm">Technical Excellence Platform</div>
                  </div>
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                  Next-generation AI-powered technical support system for IRCAD Africa&apos;s 
                  world-class surgical training facilities. Empowering medical excellence 
                  across the African continent.
                </p>

                {/* Key stats */}
                <div className="grid grid-cols-3 gap-6">
                  {[{
                    number: "99.9%", label: "Uptime" },
                    { number: "24/7", label: "Support" },
                    { number: "2,500+", label: "Issues Resolved" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="text-2xl font-bold text-teal-400 mb-1">{stat.number}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Navigation sections */}
            {[{
              title: 'Platform',
              links: [
                { name: 'Dashboard', href: '#', icon: Activity },
                { name: 'Troubleshooting', href: '#', icon: Wrench },
                { name: 'Knowledge Base', href: '#', icon: BookOpen },
                { name: 'Analytics', href: '#', icon: TrendingUp },
                { name: 'Support Tickets', href: '#', icon: AlertCircle }
              ]
            },
            {
              title: 'IRCAD Africa',
              links: [
                { name: 'About Center', href: '#', icon: Users },
                { name: 'Training Programs', href: '#', icon: BookOpen },
                { name: 'Research', href: '#', icon: Search },
                { name: 'News & Events', href: '#', icon: Activity },
                { name: 'Contact', href: '#', icon: Users }
              ]
            }].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold mb-6 text-white">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 5, color: "#14b8a6" }}
                        className="flex items-center text-gray-400 hover:text-teal-400 transition-all duration-200 group"
                      >
                        <link.icon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span>{link.name}</span>
                        <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-teal-900/50 to-blue-900/50 rounded-2xl p-8 mb-12 border border-teal-800/30"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-300 mb-6">
                  Join IRCAD Africa&apos;s technical excellence initiative. Get instant access 
                  to our AI-powered support platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 30px 60px rgba(20, 184, 166, 0.4)",
                      y: -5 
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    <span>Launch Platform</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-teal-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Schedule Demo
                  </motion.button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-semibold">IRCAD Africa Center</div>
                    <div className="text-sm text-gray-400">Masaka, Kigali, Rwanda</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center mr-4">
                    <Activity className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-semibold">assistant@ircad.africa</div>
                    <div className="text-sm text-gray-400">Technical Support Team</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                <p>&copy; 2025 IRCAD Africa Assistant. All rights reserved.</p>
                <p className="mt-1">Internal technical support system • Empowering surgical excellence across Africa</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">System Operational</span>
                </div>
                
                <div className="flex space-x-4">
                  {[{
                    name: 'Privacy', href: '#' },
                    { name: 'Terms', href: '#' },
                    { name: 'Security', href: '#' }
                  ].map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      whileHover={{ y: -2 }}
                      className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600"></div>
      </footer>
    </div>
  )
}