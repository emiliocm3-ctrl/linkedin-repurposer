'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ConversionForm } from '@/components/ConversionForm'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ConversionResult {
  twitterThread: string
  blogPost: string
  newsletter: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)
  const [usageData, setUsageData] = useState({
    conversionsUsed: 0,
    conversionsLimit: 5,
    conversionsRemaining: 5,
    subscriptionTier: 'free',
  })
  const [isLoadingUsage, setIsLoadingUsage] = useState(true)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/usage')
      if (response.ok) {
        const data = await response.json()
        setUsageData(data)
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error)
    } finally {
      setIsLoadingUsage(false)
    }
  }

  const handleConversionComplete = (result: ConversionResult) => {
    setConversionResult(result)
    // Refresh usage data after conversion
    fetchUsageData()
  }

  if (isLoadingUsage) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'there'}!</h1>
        <p className="text-muted-foreground">
          Transform your LinkedIn posts into multi-platform content instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ConversionForm
            onConversionComplete={handleConversionComplete}
            conversionsRemaining={usageData.conversionsRemaining}
          />

          {/* Usage Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Usage</CardTitle>
              <CardDescription>
                You&apos;re on the <span className="font-semibold capitalize">{usageData.subscriptionTier}</span> plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Conversions used</span>
                  <span className="font-medium">
                    {usageData.conversionsUsed} / {usageData.conversionsLimit}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(usageData.conversionsUsed / usageData.conversionsLimit) * 100}%`,
                    }}
                  />
                </div>
                {usageData.conversionsRemaining === 0 && (
                  <p className="text-sm text-destructive mt-2">
                    You&apos;ve reached your monthly limit. Upgrade to continue converting.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {conversionResult ? (
            <OutputDisplay
              twitterThread={conversionResult.twitterThread}
              blogPost={conversionResult.blogPost}
              newsletter={conversionResult.newsletter}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Converted Content Will Appear Here</CardTitle>
                <CardDescription>
                  Fill out the form and click &ldquo;Convert to All Formats&rdquo; to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">No conversions yet</p>
                  <p className="text-sm">Paste a LinkedIn post to begin</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
