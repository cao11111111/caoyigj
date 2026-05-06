import { View, Text } from '@tarojs/components'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { ArrowLeft, Ellipsis, Send } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import './index.config'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  time: string
}

export default function Chat() {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: '您好！我是您的智能助手，可以帮助您处理文档、解答问题、安排日程等。有什么可以帮您的吗？',
      time: '10:30'
    }
  ])

  useEffect(() => {
    setTimeout(() => {
      Taro.pageScrollTo({ scrollTop: 9999, duration: 300 })
    }, 100)
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, newMessage])
    setInputValue('')

    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '好的，我理解您的问题。让我为您查询相关信息...',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <View className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-3 flex items-center border-b border-slate-100">
        <View className="p-2 -ml-2" onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={22} color="#1e293b" />
        </View>
        <View className="flex-1 text-center">
          <Text className="block text-slate-800 text-base font-semibold">智能助手</Text>
          <Text className="block text-slate-400 text-xs">在线</Text>
        </View>
        <View className="p-2 -mr-2">
          <Ellipsis size={22} color="#64748b" />
        </View>
      </View>

      {/* Messages */}
      <View className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <View className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center mr-2 shrink-0">
                <Text className="text-white text-sm font-medium">AI</Text>
              </View>
            )}
            <View
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white text-slate-700 rounded-bl-md shadow-sm'
              }`}
            >
              <Text className={`block text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                {msg.content}
              </Text>
              <Text className={`block text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.time}
              </Text>
            </View>
            {msg.role === 'user' && (
              <View className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center ml-2 shrink-0">
                <Text className="text-slate-600 text-sm font-medium">我</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Input */}
      <View className="bg-white px-4 pb-6 pt-3 border-t border-slate-100">
        <View className="flex items-end gap-3">
          <View className="flex-1 bg-slate-100 rounded-2xl px-4 py-3">
            <Input
              className="w-full text-sm text-slate-800 bg-transparent"
              placeholder="输入您的问题..."
              placeholderClass="text-slate-400"
              value={inputValue}
              onInput={(e) => setInputValue(e.detail.value)}
              onConfirm={handleSend}
              confirmType="send"
            />
          </View>
          <View
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
              inputValue.trim() ? 'bg-blue-500' : 'bg-slate-200'
            }`}
            onClick={handleSend}
          >
            <Send size={20} color={inputValue.trim() ? '#ffffff' : '#94a3b8'} />
          </View>
        </View>
      </View>
    </View>
  )
}
