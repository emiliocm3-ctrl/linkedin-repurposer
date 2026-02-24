import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PricingTable } from '@/components/PricingTable'
import { ArrowRight, Zap, Clock, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl">LinkedIn Repurposer</div>
          <nav className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm hover:underline">
              Pricing
            </Link>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Repurpose Your LinkedIn Content
            <span className="block text-primary mt-2">in Seconds, Not Hours</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Turn one LinkedIn post into Twitter threads, blog articles, and newsletters.
            Powered by AI. Save 10+ hours per week on content creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 5 free conversions to start
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Content Creators Love Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-muted-foreground">
                Get all 3 formats in under 30 seconds. No more spending hours rewriting the same content.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Quality</h3>
              <p className="text-muted-foreground">
                GPT-4 ensures your content maintains quality across all platforms with the right tone.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save 10+ Hours/Week</h3>
              <p className="text-muted-foreground">
                Stop manually adapting content for each platform. Focus on what matters - creating value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Paste Your LinkedIn Post</h3>
                <p className="text-muted-foreground">
                  Copy your LinkedIn content that performed well. No formatting needed.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Style</h3>
                <p className="text-muted-foreground">
                  Select tone (professional, casual, witty) and industry for best results.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get All 3 Formats Instantly</h3>
                <p className="text-muted-foreground">
                  Download or copy Twitter thread, blog post, and newsletter version. Done!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-8">
            Start free, upgrade when you need more. No hidden fees.
          </p>
          <PricingTable />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How does the AI conversion work?</h3>
              <p className="text-muted-foreground">
                We use GPT-4, the most advanced AI model, to understand your content and adapt it for each platform
                while maintaining your message and tone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I edit the AI-generated content?</h3>
              <p className="text-muted-foreground">
                Yes! All outputs are editable. Copy the text and make any adjustments before posting.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What counts as a conversion?</h3>
              <p className="text-muted-foreground">
                One conversion = transforming one LinkedIn post into all 3 formats (Twitter, blog, newsletter).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Absolutely. No contracts, no cancellation fees. Cancel from your account settings with one click.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you store my LinkedIn data?</h3>
              <p className="text-muted-foreground">
                We only store the conversions you create for your history. We never access your LinkedIn account or posts without your input.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to 10x Your Content Output?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of creators who save 10+ hours every week repurposing content.
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm mt-4 opacity-75">5 free conversions • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 LinkedIn Repurposer. Built with Next.js, OpenAI, and Stripe.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            {' • '}
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
