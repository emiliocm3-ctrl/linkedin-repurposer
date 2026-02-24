'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PricingTable } from '@/components/PricingTable'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/components/ui/use-toast'
import {
  Loader2,
  Copy,
  Check,
  Gift,
  CreditCard,
  ExternalLink,
} from 'lucide-react'
import { formatDate, copyToClipboard } from '@/lib/utils'

interface UsageData {
  conversionsUsed: number
  conversionsLimit: number
  conversionsRemaining: number
  subscriptionTier: string | null
  subscriptionStatus: string | null
  currentPeriodEnd: string | null
  referralCode: string | null
  referralCredits: number
}

function getStatusBadgeClass(status: string | null): string {
  switch (status) {
    case 'active':
      return 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30'
    case 'past_due':
      return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
    case 'canceled':
      return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

function getStatusLabel(status: string | null): string {
  if (!status) return 'Free'
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function SettingsPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [isLoadingUsage, setIsLoadingUsage] = useState(true)
  const [referralInput, setReferralInput] = useState('')
  const [isApplyingReferral, setIsApplyingReferral] = useState(false)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)
  const [copied, setCopied] = useState(false)

  const isPaidPlan =
    usageData?.subscriptionTier &&
    usageData.subscriptionTier !== 'free'
  const isFreeTier =
    !usageData?.subscriptionTier || usageData.subscriptionTier === 'free'

  const fetchUsageData = useCallback(async () => {
    try {
      const response = await fetch('/api/usage')
      if (response.ok) {
        const data = await response.json()
        setUsageData(data)
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load settings data. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingUsage(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsageData()
  }, [fetchUsageData])

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true)
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal')
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to open billing portal.',
        variant: 'destructive',
      })
      setIsOpeningPortal(false)
    }
  }

  const handleCopyReferralCode = async () => {
    if (!usageData?.referralCode) return
    const success = await copyToClipboard(usageData.referralCode)
    if (success) {
      setCopied(true)
      toast({
        title: 'Copied to clipboard',
        description: 'Referral code has been copied.',
      })
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const handleApplyReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = referralInput.trim()
    if (!code) {
      toast({
        title: 'Referral code required',
        description: 'Please enter a referral code.',
        variant: 'destructive',
      })
      return
    }
    setIsApplyingReferral(true)
    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: code }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply referral code')
      }
      toast({
        title: 'Referral applied!',
        description: data.message || `You received ${data.creditsAwarded} bonus conversions.`,
      })
      setReferralInput('')
      fetchUsageData()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to apply referral code.',
        variant: 'destructive',
      })
    } finally {
      setIsApplyingReferral(false)
    }
  }

  if (isLoadingUsage) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and subscription
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* 1. Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Subscription Management */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>
              Manage your billing and plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className="text-sm font-medium">Current Plan</label>
                <p className="text-2xl font-bold capitalize">
                  {usageData?.subscriptionTier || 'Free'}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(usageData?.subscriptionStatus ?? null)}`}
              >
                {getStatusLabel(usageData?.subscriptionStatus ?? null)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversions used</span>
                <span className="font-medium">
                  {usageData?.conversionsUsed ?? 0} / {usageData?.conversionsLimit ?? 5}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((usageData?.conversionsUsed ?? 0) / (usageData?.conversionsLimit || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {usageData?.currentPeriodEnd && isPaidPlan && (
              <p className="text-sm text-muted-foreground">
                Renews on {formatDate(usageData.currentPeriodEnd)}
              </p>
            )}

            {isPaidPlan && (
              <Button
                onClick={handleManageSubscription}
                disabled={isOpeningPortal}
              >
                {isOpeningPortal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manage Subscription
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 3. Referral Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Referral Program
            </CardTitle>
            <CardDescription>
              Share your code and earn bonus conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {usageData?.referralCode && (
              <div>
                <label className="text-sm font-medium">Your referral code</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    readOnly
                    value={usageData.referralCode}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyReferralCode}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Referral credits earned</label>
              <p className="text-muted-foreground">
                {usageData?.referralCredits ?? 0} bonus conversions
              </p>
            </div>

            <form onSubmit={handleApplyReferral} className="space-y-2">
              <label className="text-sm font-medium">Apply someone else&apos;s referral code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter referral code"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  className="font-mono uppercase"
                  disabled={isApplyingReferral}
                />
                <Button type="submit" disabled={isApplyingReferral}>
                  {isApplyingReferral ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 4. Upgrade Your Plan - only show if on free tier */}
        {isFreeTier && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Upgrade Your Plan
            </h2>
            <PricingTable currentTier={usageData?.subscriptionTier ?? 'free'} />
          </div>
        )}
      </div>
    </div>
  )
}
