'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { Tone, Industry } from '@/lib/prompts'

interface ConversionResult {
  twitterThread: string
  blogPost: string
  newsletter: string
}

interface ConversionFormProps {
  onConversionComplete: (result: ConversionResult) => void
  conversionsRemaining: number
}

export function ConversionForm({ onConversionComplete, conversionsRemaining }: ConversionFormProps) {
  const [content, setContent] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [industry, setIndustry] = useState<Industry>('general')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const charCount = content.length
  const maxChars = 3000

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: 'Content required',
        description: 'Please enter your LinkedIn post content.',
        variant: 'destructive',
      })
      return
    }

    if (conversionsRemaining <= 0) {
      toast({
        title: 'Limit reached',
        description: 'You have used all your conversions this month. Upgrade to continue.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          tone,
          industry,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Conversion failed')
      }

      const result = await response.json()
      onConversionComplete(result)

      toast({
        title: 'Success!',
        description: 'Your content has been repurposed into 3 formats.',
      })

      // Reset form
      setContent('')
    } catch (error) {
      console.error('Conversion error:', error)
      toast({
        title: 'Conversion failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convert LinkedIn Post</CardTitle>
        <CardDescription>
          Paste your LinkedIn post below and get Twitter, blog, and newsletter versions instantly.
          {conversionsRemaining > 0 ? (
            <span className="block mt-1 text-primary font-medium">
              {conversionsRemaining} conversion{conversionsRemaining !== 1 ? 's' : ''} remaining this month
            </span>
          ) : (
            <span className="block mt-1 text-destructive font-medium">
              No conversions remaining. Upgrade your plan to continue.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">LinkedIn Post Content</Label>
            <Textarea
              id="content"
              placeholder="Paste your LinkedIn post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={maxChars}
              disabled={isLoading}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {charCount}/{maxChars} characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as Tone)} disabled={isLoading}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="witty">Witty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={(value) => setIndustry(value as Industry)} disabled={isLoading}>
                <SelectTrigger id="industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || conversionsRemaining <= 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              'Convert to All Formats'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
