# 📸 PhotoID - Free AI Photo ID Maker

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🔒 **100% Private & Secure** — All processing happens locally in your browser. Your photos never leave your device!

Create professional passport photos, visa photos, and ID pictures instantly with AI-powered background removal. Supports multiple country-specific photo sizes and formats.

## ✨ Features

- 🤖 **AI Background Removal** - Automatic subject detection and background replacement
- 🌍 **Multi-Country Support** - Photo sizes for US, UK, Canada, Germany, France, Japan, India, Brazil, China, Myanmar
- 🎨 **Custom Backgrounds** - Choose any background color for your photos
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Fast Processing** - Utilizes Web Workers and GPU acceleration when available
- 🔄 **Batch Processing** - Process multiple photos simultaneously
- 💾 **Easy Download** - Download individual or multiple processed photos
- 🔐 **Complete Privacy** - No uploads, no servers, no data collection

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaiHtun/take-photoid.git
   cd take-photoid
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
# or
npm run build
```

## 🎯 How to Use

1. **Upload Photos** - Click "Add Photos" to upload your images or use the provided sample photos
2. **Select Photo Size** - Choose the appropriate size for your country/document type:
   - US: 51x51 mm
   - UK/Canada/Germany/France/Japan/India: 35x45 mm
   - Brazil: 50x70 mm
   - China: 33x48 mm
   - Myanmar: 35x45 mm
3. **Choose Background** - Pick a background color (white is standard for most documents)
4. **Process Images** - Click "Process All Images" to apply AI background removal
5. **Select & Download** - Choose your processed photos and download them

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **UI Components**: Shadcn + Radix UI primitives
- **AI Processing**: @imgly/background-removal
- **Performance**: Web Workers for background processing
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── playground/      # Main app workspace
│   └── landing-page.tsx # Home page
├── lib/
│   ├── services/        # Business logic
│   │   ├── backgroundRemovalService.ts
│   │   └── imageProcessingService.ts
│   └── utils/           # Utility functions
├── stores/              # Zustand state management
├── workers/             # Web Workers for background processing
├── constants/           # App constants and configurations
└── styles/              # CSS and styling
```

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run linter
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Check code formatting
- `pnpm format:fix` - Fix code formatting
- `pnpm check` - Run all checks
- `pnpm check:fix` - Fix all issues

### Code Quality

This project uses:
- **Biome** for linting and formatting
- **TypeScript** for type safety
- **ESLint** for additional code quality checks

### Browser Support

- Modern browsers supporting WebAssembly
- Chrome/Edge 88+
- Firefox 89+
- Safari 14+

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   pnpm check:fix
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write TypeScript with proper type definitions
- Add comments for complex logic
- Test your changes across different browsers
- Ensure your code passes all linting and formatting checks
- Update documentation if needed

### Areas for Contribution

- 📷 **Camera Integration** - Add direct camera capture functionality
- 🌐 **i18n Support** - Add internationalization for multiple languages
- 📏 **More Photo Sizes** - Add support for additional countries/document types
- 🎨 **UI/UX Improvements** - Enhance the user interface and experience
- ⚡ **Performance Optimizations** - Improve processing speed and memory usage
- 🧪 **Testing** - Add unit and integration tests
- 📱 **PWA Features** - Add Progressive Web App capabilities

## 📋 Current Status

### ✅ Completed Features
- ✅ AI-powered background removal
- ✅ Multiple photo size support
- ✅ Custom background colors
- ✅ Batch processing
- ✅ Responsive design
- ✅ Local processing (privacy-first)
- ✅ Web Worker optimization
- ✅ Download functionality

### 🚧 In Development
- 📷 Camera integration (coming soon)
- 🌐 Multi-language support
- 📱 PWA features

### 🎯 Planned Features
- 🔄 Photo editing tools (crop, rotate, adjust)
- 📊 Photo quality analysis
- 🎨 More background options (gradients, patterns)
- 📤 Cloud storage integration (optional)

## 🐛 Known Issues

- Camera feature is not yet implemented (sample photos available)
- Some older browsers may have limited WebAssembly support
- Large images may take longer to process on slower devices

## 🔒 Privacy & Security

- **No Data Collection**: No analytics, tracking, or data collection
- **Local Processing**: All image processing happens in your browser
- **No Uploads**: Your photos never leave your device
- **Open Source**: Full transparency - review the code yourself

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sai Htun**
- Website: [saihtun.xyz](https://saihtun.xyz)
- Email: saihtun1430@gmail.com
- GitHub: [@SaiHtun](https://github.com/SaiHtun)

## 🙏 Acknowledgments

- [imgly/background-removal](https://github.com/imgly/background-removal-js) for AI background removal
- [Shadcn](https://www.radix-ui.com/) for accessible UI components
- [Unsplash](https://unsplash.com/) for sample photos
- [Lucide](https://lucide.dev/) for beautiful icons

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/SaiHtun/take-photoid/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your browser and the steps to reproduce

---

**Made with ❤️ for creating professional photos, free and secure!**