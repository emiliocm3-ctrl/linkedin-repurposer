'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import {
  Loader2,
  Calendar,
  Eye,
  Copy,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { formatDate, copyToClipboard, downloadAsFile } from '@/lib/utils'

interface Conversion {
  id: string
  originalContent: string
  twitterThread: string
  blogPost: string
  newsletter: string
  tone: string
  industry: string
  createdAt: string
}

interface HistoryResponse {
  conversions: Conversion[]
  total: number
  page: number
  totalPages: number
}

const TRUNCATE_LENGTH = 80

function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export default function HistoryPage() {
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConversion, setSelectedConversion] = useState<Conversion | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [copyingId, setCopyingId] = useState<string | null>(null)
  const { toast } = useToast()

  const limit = 10

  const fetchConversions = useCallback(async (pageNum: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/history?page=${pageNum}&limit=${limit}`)
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      const data: HistoryResponse = await response.json()
      setConversions(data.conversions)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setPage(data.page)
    } catch (error) {
      console.error('Failed to fetch conversions:', error)
      toast({
        title: 'Error',
        description: 'Failed to load conversion history. Please try again.',
        variant: 'destructive',
      })
      setConversions([])
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchConversions(page)
  }, [page, fetchConversions])

  const handleCopy = async (content: string, label: string) => {
    const id = `${selectedConversion?.id}-${label}`
    setCopyingId(id)
    const success = await copyToClipboard(content)
    setCopyingId(null)
    if (success) {
      toast({
        title: 'Copied to clipboard',
        description: `${label} has been copied.`,
      })
    } else {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const handleDownload = (content: string, label: string) => {
    const slug = label.toLowerCase().replace(/\s+/g, '-')
    const filename = `linkedin-${slug}-${selectedConversion?.id.slice(0, 8) || 'export'}.txt`
    downloadAsFile(content, filename)
    toast({
      title: 'Download started',
      description: `${label} has been downloaded.`,
    })
  }

  if (isLoading && conversions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Conversion History</h1>
        <p className="text-muted-foreground">
          View and re-export your past conversions
        </p>
      </div>

      {conversions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversions yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Your conversion history will appear here. Create your first conversion to get started.
            </p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {conversions.map((conversion) => (
              <Card key={conversion.id}>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base line-clamp-2">
                        {truncateText(conversion.originalContent, TRUNCATE_LENGTH)}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(conversion.createdAt)}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                          {conversion.tone}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                          {conversion.industry}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedConversion(conversion)}
                      className="shrink-0"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog
        open={selectedConversion !== null}
        onOpenChange={(open) => !open && setSelectedConversion(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Conversion Details</DialogTitle>
            <DialogDescription>
              {selectedConversion && truncateText(selectedConversion.originalContent, 100)}
            </DialogDescription>
          </DialogHeader>

          {selectedConversion && (
            <Tabs defaultValue="twitter" className="flex-1 overflow-hidden flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="twitter">Twitter Thread</TabsTrigger>
                <TabsTrigger value="blog">Blog Post</TabsTrigger>
                <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              </TabsList>

              <TabsContent value="twitter" className="flex-1 overflow-hidden mt-4">
                <div className="flex flex-col h-full min-h-[200px]">
                  <div className="flex gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCopy(
                          selectedConversion.twitterThread,
                          'Twitter Thread'
                        )
                      }
                      disabled={copyingId !== null}
                    >
                      {copyingId === `${selectedConversion.id}-Twitter Thread` ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleDownload(
                          selectedConversion.twitterThread,
                          'Twitter Thread'
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <pre className="flex-1 overflow-auto rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap font-sans">
                    {selectedConversion.twitterThread || 'No content'}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="blog" className="flex-1 overflow-hidden mt-4">
                <div className="flex flex-col h-full min-h-[200px]">
                  <div className="flex gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCopy(selectedConversion.blogPost, 'Blog Post')
                      }
                      disabled={copyingId !== null}
                    >
                      {copyingId === `${selectedConversion.id}-Blog Post` ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleDownload(
                          selectedConversion.blogPost,
                          'Blog Post'
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <pre className="flex-1 overflow-auto rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap font-sans">
                    {selectedConversion.blogPost || 'No content'}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="newsletter" className="flex-1 overflow-hidden mt-4">
                <div className="flex flex-col h-full min-h-[200px]">
                  <div className="flex gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCopy(
                          selectedConversion.newsletter,
                          'Newsletter'
                        )
                      }
                      disabled={copyingId !== null}
                    >
                      {copyingId === `${selectedConversion.id}-Newsletter` ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleDownload(
                          selectedConversion.newsletter,
                          'Newsletter'
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <pre className="flex-1 overflow-auto rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-wrap font-sans">
                    {selectedConversion.newsletter || 'No content'}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
