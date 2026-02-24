'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Download, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { copyToClipboard, downloadAsFile } from '@/lib/utils'

interface OutputDisplayProps {
  twitterThread: string
  blogPost: string
  newsletter: string
}

export function OutputDisplay({ twitterThread, blogPost, newsletter }: OutputDisplayProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCopy = async (text: string, format: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedTab(format)
      toast({
        title: 'Copied!',
        description: `${format} content copied to clipboard.`,
      })
      setTimeout(() => setCopiedTab(null), 2000)
    } else {
      toast({
        title: 'Copy failed',
        description: 'Please try again or copy manually.',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = (text: string, format: string) => {
    const extension = format === 'Blog Post' ? 'md' : 'txt'
    const filename = `linkedin-to-${format.toLowerCase().replace(' ', '-')}.${extension}`
    downloadAsFile(text, filename)
    toast({
      title: 'Downloaded!',
      description: `${format} saved as ${filename}`,
    })
  }

  const outputs = [
    {
      value: 'twitter',
      label: 'Twitter Thread',
      content: twitterThread,
      description: 'Ready to post as a Twitter thread',
    },
    {
      value: 'blog',
      label: 'Blog Post',
      content: blogPost,
      description: 'Formatted as a markdown blog article',
    },
    {
      value: 'newsletter',
      label: 'Newsletter',
      content: newsletter,
      description: 'Conversational email newsletter format',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Repurposed Content</CardTitle>
        <CardDescription>
          Choose a format below to copy or download
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="twitter" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {outputs.map((output) => (
              <TabsTrigger key={output.value} value={output.value}>
                {output.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {outputs.map((output) => (
            <TabsContent key={output.value} value={output.value} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{output.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(output.content, output.label)}
                  >
                    {copiedTab === output.label ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedTab === output.label ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(output.content, output.label)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-md border bg-muted/50 p-4 max-h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {output.content}
                  </pre>
                </div>
                <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  {output.content.length} characters
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
