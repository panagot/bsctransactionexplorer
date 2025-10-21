# BSC Explorer - Easy to Read BSC Blockchain Explorer

A professional, user-friendly blockchain explorer for the BSC (BNB Smart Chain) network. Built with Next.js, TypeScript, and modern web technologies.

## Features

- 🔍 **Transaction Analysis**: Detailed transaction breakdowns with easy-to-understand explanations
- 🥞 **DeFi Integration**: Specialized analysis for PancakeSwap and other BSC DeFi protocols
- 📚 **Educational Content**: Learn about BSC, DeFi, and blockchain concepts
- 🛡️ **MEV Detection**: Identify potential MEV activity and sandwich attacks
- 📊 **Real-time Stats**: Live network statistics and gas price monitoring
- 🌙 **Dark Mode**: Beautiful dark and light themes
- 📱 **Responsive Design**: Works perfectly on all devices

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom BSC theme
- **Blockchain**: Ethers.js for BSC interaction
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/bsc-transaction-explorer.git
cd bsc-transaction-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bsc-transaction-explorer/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── MEVDetection.tsx
│   │   ├── NetworkStats.tsx
│   │   └── TransactionFlow.tsx
│   ├── lib/                # Utility libraries
│   │   ├── bscClient.ts    # BSC blockchain client
│   │   └── transactionParser.ts
│   └── types/              # TypeScript type definitions
│       └── transaction.ts
├── public/                 # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Key Features

### Transaction Analysis
- Comprehensive transaction breakdowns
- Gas fee analysis and optimization tips
- Balance change tracking
- Smart contract interaction analysis

### DeFi Protocol Support
- PancakeSwap integration
- SushiSwap support
- Uniswap compatibility
- 1inch aggregator detection

### Educational Content
- BSC network explanations
- DeFi concept tutorials
- MEV protection guidance
- Blockchain security tips

### MEV Detection
- Sandwich attack identification
- Front-running detection
- MEV profit estimation
- Protection recommendations

## BSC Network Integration

This explorer is specifically designed for the BSC network:

- **RPC Endpoints**: Multiple BSC RPC providers for reliability
- **Token Support**: BEP-20 token analysis
- **DeFi Protocols**: PancakeSwap, Venus, ApeSwap integration
- **Gas Optimization**: BSC-specific gas price recommendations

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy with default settings
3. Your explorer will be available at `https://your-project.vercel.app`

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@bscexplorer.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/bsc-transaction-explorer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/bsc-transaction-explorer/discussions)

## Acknowledgments

- BSC community for network support
- PancakeSwap team for DeFi integration
- Ethers.js team for blockchain interaction
- Next.js team for the amazing framework

---

**Built with ❤️ for the BSC community**
