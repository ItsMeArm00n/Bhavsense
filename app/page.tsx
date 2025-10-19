"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertModal } from "@/components/alert-modal"
import {
  Shield,
  Zap,
  Globe,
  Loader2,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Github as GitHub,
  ExternalLink,
  User,
} from "lucide-react"

export default function SentimentShieldHindi() {
  const [sentence, setSentence] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState("")
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    useCases: false,
    form: false,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section")
            if (section) {
              setIsVisible((prev) => ({ ...prev, [section]: true }))
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = document.querySelectorAll("[data-section]")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sentence.trim()) return

    setIsLoading(true)
    setResult("")
    setPrediction("")
    setShowTimeoutModal(false)

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("API_TIMEOUT"))
        }, 8000) // 8 seconds timeout
      })

      // Race between the API call and timeout
      const response = await Promise.race([
        fetch("https://ItsMeArm00n-hindisenti.hf.space/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sentence: sentence.trim(),
          }),
        }),
        timeoutPromise
      ]) as Response

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      const validSentiments = ["positive", "negative", "neutral", "neutral (low confidence)"]
      if (data.prediction && validSentiments.includes(data.prediction.toLowerCase())) {
        setPrediction(data.prediction)
        setResult(`Sentiment: ${data.prediction}`)
      } else {
        setShowTimeoutModal(true)
        setResult("Error: Unexpected response from API. Please try again.")
        setPrediction("error")
      }
    } catch (error: any) {
      console.error("Error predicting sentiment:", error)
      if (error.message === "API_TIMEOUT") {
        setShowTimeoutModal(true)
        setResult("Error: API timeout. Please try again.")
      } else {
        setResult("⚠️ The API is taking longer than expected or returned an unexpected response. It may currently be asleep. Please restart it using the [API Source (Hugging Face)] link in the footer.")
        document.querySelector(".text-xl.font-semibold.mb-4")?.classList.add("text-red-500")
      }
      setPrediction("error")
    } finally {
      setIsLoading(false)
    }
  }

  const getResultClass = (pred: string) => {
    switch (pred.toLowerCase()) {
      case "positive":
        return "result-positive"
      case "negative":
        return "result-negative"
      case "neutral":
        return "result-neutral"
      case "neutral (low confidence)":
        return "result-neutral-low"
      default:
        return ""
    }
  }

  const getBadgeVariant = (pred: string) => {
    switch (pred.toLowerCase()) {
      case "positive":
        return "default"
      case "negative":
        return "destructive"
      case "neutral":
        return "secondary"
      case "neutral (low confidence)":
        return "outline"
      default:
        return "secondary"
    }
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full glass-effect z-50 transition-all duration-300 border-b border-blue-200/30 dark:border-blue-800/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-2">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur-sm opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <Shield className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <span className="text-xl font-bold text-foreground drop-shadow-sm text-float">BhāvSense AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 transform font-medium relative group px-3 py-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
              >
                Features
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
              </a>
              <a
                href="#use-cases"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 transform font-medium relative group px-3 py-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
              >
                Use Cases
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
              </a>
              <a
                href="#predict"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 transform font-medium relative group px-3 py-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
              >
                Try Now
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section
        data-section="hero"
        className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative section-depth overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse shadow-2xl animate-particle-float"></div>
          <div
            className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/18 rounded-full blur-2xl animate-pulse shadow-xl animate-particle-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl animate-pulse shadow-2xl animate-particle-float"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-400/12 rounded-full blur-xl animate-pulse animate-particle-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-0 left-0 w-2 h-2 bg-blue-400/30 rounded-full animate-background-flow"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-1/4 left-0 w-1 h-1 bg-indigo-400/40 rounded-full animate-background-flow"
            style={{ animationDelay: "5s" }}
          ></div>
          <div
            className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-sky-400/35 rounded-full animate-background-flow"
            style={{ animationDelay: "10s" }}
          ></div>
          <div
            className="absolute top-3/4 left-0 w-1 h-1 bg-blue-500/45 rounded-full animate-background-flow"
            style={{ animationDelay: "15s" }}
          ></div>
        </div>

        <div className={`text-center relative z-10 ${isVisible.hero ? "animate-fade-in-up" : "opacity-0"}`}>
          <Badge
            variant="secondary"
            className="mb-8 text-sm px-6 py-3 hover-lift professional-card shimmer-effect font-medium shadow-lg"
          >
            Advanced Hindi NLP Technology
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 text-balance text-float">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent drop-shadow-lg">
              BhāvSense AI
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto text-pretty leading-relaxed text-float"
            style={{ animationDelay: "1s" }}
          >
            Precise sentiment analysis for Hindi text with confidence-based predictions, real-time processing, and
            cultural context understanding powered by advanced AI
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-lg px-10 py-4 hover-lift transition-all duration-300 professional-card shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-black border-0"
              asChild
            >
              <a href="#predict">Try Analysis</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 hover-lift transition-all duration-300 professional-card shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-black border-0"
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        data-section="features"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative section-depth"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-10 right-10 w-28 h-28 bg-blue-400/12 rounded-full blur-2xl animate-pulse shadow-xl"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-10 left-10 w-36 h-36 bg-indigo-400/10 rounded-full blur-3xl animate-pulse shadow-2xl"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className={`relative z-10 ${isVisible.features ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 professional-card">
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Powerful <span className="text-primary">AI Capabilities</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced sentiment analysis capabilities designed specifically for Hindi language processing with cultural
              nuance and linguistic precision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card
              className={`professional-card hover-lift border-0 shadow-2xl ${isVisible.features ? "animate-slide-in-left animate-delay-200" : "opacity-0"}`}
            >
              <CardHeader className="pb-6">
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl w-fit">
                  <BarChart3 className="h-12 w-12 text-primary transition-transform duration-300 hover:scale-110 drop-shadow-sm" />
                </div>
                <CardTitle className="text-2xl mb-3">3-Class Sentiment</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Accurate classification into Positive, Negative, and Neutral sentiments with high precision and
                  cultural context awareness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className={`professional-card hover-lift border-0 shadow-2xl ${isVisible.features ? "animate-scale-in animate-delay-400" : "opacity-0"}`}
            >
              <CardHeader className="pb-6">
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl w-fit">
                  <Zap className="h-12 w-12 text-primary transition-transform duration-300 hover:scale-110 drop-shadow-sm" />
                </div>
                <CardTitle className="text-2xl mb-3">Confidence Scoring</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Intelligent confidence scoring ensures reliable predictions with fallback mechanisms for uncertain
                  classifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className={`professional-card hover-lift border-0 shadow-2xl ${isVisible.features ? "animate-slide-in-right animate-delay-600" : "opacity-0"}`}
            >
              <CardHeader className="pb-6">
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl w-fit">
                  <Globe className="h-12 w-12 text-primary transition-transform duration-300 hover:scale-110 drop-shadow-sm" />
                </div>
                <CardTitle className="text-2xl mb-3">Hindi Expertise</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Native Devanagari script processing with deep cultural context understanding and linguistic nuance
                  recognition
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section
        id="use-cases"
        data-section="useCases"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10"></div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-1/4 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-1/4 w-44 h-44 bg-indigo-500/4 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`${isVisible.useCases ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Real-World Applications</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your Hindi text analysis across various domains and use cases
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                        <Card
                          className={`professional-card hover-lift border-0 shadow-2xl ${isVisible.features ? "animate-slide-in-left animate-delay-200" : "opacity-0"}`}
                        >
                          <CardHeader className="pb-6">
                            <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl w-fit">
                              <BarChart3 className="h-12 w-12 text-primary transition-transform duration-300 hover:scale-110 drop-shadow-sm" />
                            </div>
                            <CardTitle className="text-2xl mb-3">Customer Feedback</CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                              Analyze customer reviews and feedback in Hindi to understand satisfaction levels and improve services
                            </CardDescription>
                          </CardHeader>
                        </Card>

                        <Card
                          className={`professional-card hover-lift border-0 shadow-2xl ${isVisible.features ? "animate-scale-in animate-delay-400" : "opacity-0"}`}
                        >
                          <CardHeader className="pb-6">
                            <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl w-fit">
                              <Zap className="h-12 w-12 text-primary transition-transform duration-300 hover:scale-110 drop-shadow-sm" />
                            </div>
                            <CardTitle className="text-2xl mb-3">Content Moderation</CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                              Automatically detect negative sentiment in Hindi content for proactive moderation and safety  
                            </CardDescription>
                          </CardHeader>
                        </Card>

                        <Card
                          className={`professional-card hover-lift border-0 shadow-2xl ${isVisible.features ? "animate-slide-in-right animate-delay-600" : "opacity-0"}`}
                        >
                          <CardHeader className="pb-6">
                            <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl w-fit">
                              <Globe className="h-12 w-12 text-primary transition-transform duration-300 hover:scale-110 drop-shadow-sm" />
                            </div>
                            <CardTitle className="text-2xl mb-3">Social Media Monitoring</CardTitle>
                            <CardDescription className="text-base leading-relaxed">
                              Track brand sentiment across Hindi social media posts and comments for better engagement strategies
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </div>
          </div>
        </div>
      </section>

      <section
        id="predict"
        data-section="form"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative section-depth"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial from-blue-500/12 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/15 rounded-full blur-2xl animate-pulse shadow-xl"></div>
          <div
            className="absolute bottom-10 right-10 w-24 h-24 bg-indigo-400/12 rounded-full blur-2xl animate-pulse shadow-xl"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className={`relative z-10 ${isVisible.form ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 professional-card">
              Live Demo
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Try <span className="text-primary">Sentiment Analysis</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Enter Hindi text below to analyze its sentiment in real-time with AI-powered precision
            </p>
          </div>

          <Card className="max-w-3xl mx-auto professional-card hover-lift border-0 shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                Hindi Sentiment Predictor
              </CardTitle>
              <CardDescription className="text-base">
                Input your Hindi sentence and get instant sentiment analysis with confidence scoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handlePredict} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="sentence" className="block text-sm font-semibold text-foreground">
                    Hindi Sentence / हिंदी वाक्य
                  </label>
                  <Input
                    id="sentence"
                    type="text"
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    placeholder="यहाँ अपना हिंदी वाक्य लिखें..."
                    className="text-lg py-4 px-4 hindi-text transition-all duration-300 focus:scale-[1.02] professional-card border-0 shadow-lg"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-4 hover-lift transition-all duration-300 professional-card shadow-xl shimmer-effect bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-gray border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Analyzing Sentiment...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-3 h-5 w-5" />
                      Predict Sentiment / भावना का विश्लेषण करें
                    </>
                  )}
                </Button>

                {result && (
                  <Card
                    className={`mt-8 animate-scale-in border-2 hover-lift professional-card shadow-2xl ${getResultClass(prediction)} backdrop-blur-xl`}
                  >
                    <CardContent className="pt-8 pb-8">
                      <div className="text-center space-y-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-current/10 to-current/5 rounded-full blur-lg animate-pulse"></div>
                          <div className="relative p-4 bg-gradient-to-br from-current/10 to-current/5 rounded-full w-fit mx-auto backdrop-blur-sm">
                            <BarChart3 className="h-10 w-10 text-current animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold mb-3 text-float">Analysis Result</h3>
                          <p className="text-xl font-semibold mb-4 text-float" style={{ animationDelay: "0.2s" }}>
                            {result}
                          </p>
                          {prediction && prediction !== "error" && (
                            <div className="flex justify-center">
                              <Badge
                                variant={getBadgeVariant(prediction)}
                                className="text-base px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm font-semibold"
                              >
                                {prediction === "neutral (low confidence)" ? "Low Confidence" : prediction}
                              </Badge>
                            </div>
                          )}
                          {prediction === "neutral (low confidence)" && (
                            <div className="mt-4 p-4 bg-current/5 rounded-lg backdrop-blur-sm">
                              <p className="text-sm leading-relaxed opacity-90">
                                The model has low confidence in this prediction. Consider rephrasing or providing more
                                context for better accuracy.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-muted/80 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent dark:from-blue-950/20"></div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-20 w-24 h-24 bg-blue-500/6 rounded-full blur-xl animate-pulse shadow-lg"></div>
          <div
            className="absolute bottom-10 right-20 w-32 h-32 bg-indigo-500/4 rounded-full blur-2xl animate-pulse shadow-xl"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Section 1: Brand Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">BhāvSense AI</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Advanced AI-powered Hindi sentiment analysis to help you understand emotions and opinions in Devanagari
                text with precision and cultural context.
              </p>
            </div>

            {/* Section 2: Navigation */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Navigation</h4>
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                >
                  Home
                </a>
                <a
                  href="#predict"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                >
                  Analyze Text
                </a>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                >
                  About
                </a>
              </div>
            </div>

            {/* Section 3: Resources */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h4>
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Developer Portfolio</span>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex items-center space-x-2"
                >
                  <GitHub className="h-4 w-4" />
                  <span>Website Source</span>
                </a>
                <a
                  href="https://huggingface.co/spaces/ItsMeArm00n/hindisenti/tree/main"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>API Source (Hugging Face)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">© 2025 BhāvSense AI. All rights reserved.</p>
              <p className="text-sm text-muted-foreground">
                Built by <span className="text-foreground font-medium">Armaan Kumar</span> |
                <a href="#" className="text-primary hover:text-primary/80 transition-colors duration-200 ml-1">
                  Portfolio
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Timeout Alert Modal */}
      <AlertModal
        isOpen={showTimeoutModal}
        onClose={() => setShowTimeoutModal(false)}
        title="API Response Timeout"
        description="The API is taking too long. It may be asleep. Please restart it using the link [API Source (Hugging Face)] in the footer."
        actionLabel="Visit API"
        onAction={() => {
          window.open("https://ItsMeArm00n-hindisenti.hf.space", "_blank")
        }}
      />
    </div>
  )
}
