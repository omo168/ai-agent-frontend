import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Loader2, Send, Bot, Sparkles, Brain, Shield, Search } from 'lucide-react'
import './App.css'

const AI_ICONS = {
  'GPT-4': Brain,
  'Claude': Shield,
  'Gemini': Search,
  'Llama': Sparkles
}

const AI_COLORS = {
  'GPT-4': 'bg-blue-500',
  'Claude': 'bg-green-500',
  'Gemini': 'bg-purple-500',
  'Llama': 'bg-orange-500'
}

function App() {
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setResponses([])

    try {
      const response = await fetch('http://localhost:5001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() })
      })

      if (!response.ok) {
        throw new Error('Gagal mengirim pertanyaan')
      }

      const data = await response.json()
      setResponses(data.responses || [])
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengirim pertanyaan')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setQuestion('')
    setResponses([])
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Agent
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tanyakan satu pertanyaan dan dapatkan jawaban dari beberapa AI sekaligus. 
            Bandingkan perspektif yang berbeda untuk mendapatkan pemahaman yang lebih lengkap.
          </p>
        </div>

        {/* Question Form */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Ajukan Pertanyaan Anda
            </CardTitle>
            <CardDescription>
              Ketik pertanyaan Anda di bawah ini dan tekan tombol kirim untuk mendapatkan jawaban dari berbagai AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Contoh: Apa itu kecerdasan buatan dan bagaimana cara kerjanya?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={loading}
              />
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={loading || !question.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim ke AI...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Pertanyaan
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={loading}
                >
                  Bersihkan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {['GPT-4', 'Claude', 'Gemini', 'Llama'].map((aiName) => (
              <Card key={aiName} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${AI_COLORS[aiName]}`}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{aiName}</CardTitle>
                      <CardDescription>Sedang memproses...</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">Menganalisis pertanyaan...</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Responses */}
        {responses.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Jawaban dari {responses.length} AI</h2>
              <p className="text-gray-600">Berikut adalah perspektif yang berbeda untuk pertanyaan Anda</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {responses.map((response, index) => {
                const IconComponent = AI_ICONS[response.ai_name] || Bot
                return (
                  <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${AI_COLORS[response.ai_name]}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{response.ai_name}</CardTitle>
                          <CardDescription>{response.ai_description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {response.style}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {response.response}
                        </p>
                      </div>
                      {response.error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-600 text-sm">Terjadi kesalahan pada AI ini</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>AI Agent - Bandingkan jawaban dari berbagai AI untuk mendapatkan perspektif yang lebih lengkap</p>
        </div>
      </div>
    </div>
  )
}

export default App

