export type Tone = 'professional' | 'casual' | 'witty'
export type Industry = 'tech' | 'marketing' | 'finance' | 'sales' | 'general'
export type OutputFormat = 'twitter' | 'blog' | 'newsletter'

interface PromptConfig {
  originalContent: string
  tone: Tone
  industry: Industry
}

// Base system prompt
const getSystemPrompt = (tone: Tone, industry: Industry): string => {
  const toneDescriptions = {
    professional: 'formal, authoritative, and polished',
    casual: 'conversational, friendly, and approachable',
    witty: 'clever, engaging, and entertaining with light humor',
  }

  const industryContext = {
    tech: 'technology and software development',
    marketing: 'marketing, branding, and growth',
    finance: 'finance, business, and economics',
    sales: 'sales, customer relationships, and deal-making',
    general: 'general professional topics',
  }

  return `You are an expert content writer specializing in ${industryContext[industry]}. Your writing style is ${toneDescriptions[tone]}. You transform LinkedIn posts into engaging content for different platforms while maintaining the core message and value.`
}

// Twitter Thread Prompt
export const getTwitterPrompt = ({
  originalContent,
  tone,
  industry,
}: PromptConfig): string => {
  return `${getSystemPrompt(tone, industry)}

Convert this LinkedIn post into an engaging Twitter thread (8-12 tweets).

Requirements:
- First tweet must hook attention immediately (use a bold statement, question, or surprising stat)
- Each tweet must be under 280 characters
- Add relevant emojis (1-2 per tweet, don't overdo it)
- Use line breaks for readability where appropriate
- End with a clear call-to-action
- Maintain the original message and key insights
- Number each tweet like "1/" "2/" etc.

Original LinkedIn post:
${originalContent}

Format your response as:
1/ [first tweet]

2/ [second tweet]

3/ [third tweet]

etc.`
}

// Blog Post Prompt
export const getBlogPrompt = ({
  originalContent,
  tone,
  industry,
}: PromptConfig): string => {
  return `${getSystemPrompt(tone, industry)}

Expand this LinkedIn post into a comprehensive blog article (1000-1200 words).

Requirements:
- Create a catchy, SEO-friendly title
- Write a compelling introduction (hook + preview of what's coming)
- Organize into 3-4 main sections with clear headers
- Include specific examples or anecdotes to illustrate points
- Add actionable takeaways or tips
- Conclude with a summary and call-to-action
- Use markdown formatting (headers, bold, lists, etc.)
- Maintain the original insights while adding depth and context

Original LinkedIn post:
${originalContent}

Format your response in markdown with:
# [Title]

[Introduction paragraph]

## [First Section Header]
[Content]

## [Second Section Header]
[Content]

etc.`
}

// Newsletter Prompt
export const getNewsletterPrompt = ({
  originalContent,
  tone,
  industry,
}: PromptConfig): string => {
  return `${getSystemPrompt(tone, industry)}

Adapt this LinkedIn post into an engaging newsletter section (600-800 words).

Requirements:
- Write in a conversational, personal tone (use "I", "you", "we")
- Start with a relatable hook or story
- Make it feel like a letter to a friend (even if the tone is professional)
- Include personal insights or experiences if appropriate
- Break into short paragraphs (2-3 sentences each) for easy scanning
- Add a clear, actionable takeaway
- End with an engaging question or CTA that encourages replies
- Use formatting like bold, italics, and bullet points for emphasis

Original LinkedIn post:
${originalContent}

Format your response with:
**Subject Line:** [Engaging subject line]

[Newsletter content with appropriate formatting]`
}

// Main function to get prompts for all formats
export const getPrompts = (config: PromptConfig) => {
  return {
    twitter: getTwitterPrompt(config),
    blog: getBlogPrompt(config),
    newsletter: getNewsletterPrompt(config),
  }
}

// Industry-specific prompt templates
export const industryTemplates = {
  tech: {
    twitter: 'Focus on technical insights, innovation, and problem-solving. Use tech-relevant emojis (💻 🚀 ⚡️).',
    blog: 'Include code examples or technical diagrams where relevant. Explain concepts clearly for both technical and non-technical readers.',
    newsletter: 'Share behind-the-scenes insights about building, shipping, or debugging. Make complex topics accessible.',
  },
  marketing: {
    twitter: 'Emphasize data, results, and strategies. Use growth-focused emojis (📈 🎯 💡).',
    blog: 'Include case studies, metrics, and actionable frameworks. Use storytelling to illustrate points.',
    newsletter: 'Share lessons learned, campaign insights, and practical tips. Be conversational but data-driven.',
  },
  finance: {
    twitter: 'Focus on insights, trends, and analysis. Use finance emojis (💰 📊 💼).',
    blog: 'Include data analysis, market trends, and expert perspectives. Cite sources where appropriate.',
    newsletter: 'Explain complex financial concepts simply. Share market observations and actionable advice.',
  },
  sales: {
    twitter: 'Emphasize tactics, wins, and relationship-building. Use sales emojis (🤝 📞 🎯).',
    blog: 'Include real sales scenarios, objection handling, and proven techniques. Make it actionable.',
    newsletter: 'Share war stories, lessons from deals, and practical frameworks. Be motivational.',
  },
  general: {
    twitter: 'Keep it broadly relatable and engaging. Use universal emojis (✨ 🔥 💪).',
    blog: 'Focus on clear explanations and universal principles. Use examples from various fields.',
    newsletter: 'Write like talking to a smart friend. Share experiences and insights anyone can apply.',
  },
} as const
