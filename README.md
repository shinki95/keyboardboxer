# I AM KEYBOARD BOXER 🥊

A text-based punch machine game powered by AI. Describe your punch and let the AI judge its destructive power!

## Features

- 🤖 **AI-Powered Scoring**: Google Gemini evaluates your punch descriptions
- 🎨 **Cyberpunk UI**: Retro arcade aesthetics with neon colors
- 📊 **Ranking System**: C to SSS ranks based on creativity and scale
- 🔗 **Share Results**: Share your score via URL with friends
- 📱 **Mobile Friendly**: Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **AI**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+
- Gemini API Key

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file
echo "GEMINI_API_KEY=your-api-key-here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

## How to Play

1. Enter a creative description of your punch (max 50 characters)
2. Click "PUNCH!" to let the AI analyze it
3. View your score, rank, and AI's comment
4. Share your result with friends!

## Deployment

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/keyboard-boxer)

Remember to add `GEMINI_API_KEY` to your Vercel environment variables!

## License

MIT
