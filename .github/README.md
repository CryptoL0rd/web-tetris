# Web Tetris - GitHub Deployment Guide

## 🚀 Quick Start

1. **Create GitHub Repository**
   ```bash
   # Create new repository on GitHub (don't initialize with README)
   # Repository name: web-tetris
   ```

2. **Add Remote Origin**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/web-tetris.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select "GitHub Actions" as source
   - Pages will be available at: `https://YOUR_USERNAME.github.io/web-tetris/`

## 📋 Project Structure

```
web-tetris/
├── index.html              # Main Tetris game
├── tetris-enhanced.html    # Enhanced version with responsive design
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment workflow
├── docs/                   # Comprehensive documentation
├── package.json           # Project configuration
├── .eslintrc.js           # Code quality settings
└── README.md              # Project overview
```

## 🎮 Game Features

- **Classic Tetris gameplay** with enhanced graphics
- **Responsive design** for mobile, tablet, and desktop
- **Theme system** with multiple color schemes
- **Settings management** with localStorage persistence
- **Error handling** with graceful degradation
- **Performance optimization** for different devices
- **Touch controls** for mobile devices

## 🔧 Development

### Running Locally

```bash
# Start development server
npm start
# or
python3 -m http.server 8000

# Open http://localhost:8000 in browser
```

### Code Quality

```bash
# Install ESLint (if not already installed)
npm install -g eslint

# Run linting
npx eslint *.html
```

## 📱 Browser Support

- **Modern browsers** with HTML5 Canvas support
- **Mobile browsers** with touch input
- **Responsive design** for all screen sizes
- **Progressive enhancement** for older browsers

## 🛠️ Customization

The game supports extensive customization through:

- **Theme settings** - Multiple color schemes
- **Control mapping** - Customizable keyboard controls
- **Game difficulty** - Adjustable speed and starting level
- **Audio settings** - Sound effects and volume control
- **Visual options** - Grid size, particle effects, ghost piece

## 📊 Performance

- **60 FPS gameplay** on capable devices
- **Adaptive performance** for lower-end hardware
- **Battery optimization** for mobile devices
- **Memory management** for long gaming sessions

## 🎓 Academic Context

This project demonstrates:

- **Data Structures & Algorithms** - Game logic implementation
- **Object-Oriented Programming** - Clean architecture
- **Design Patterns** - Strategy, Observer, Factory patterns
- **Error Handling** - Comprehensive error management
- **Performance Optimization** - Adaptive rendering
- **Responsive Design** - Cross-platform compatibility

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Original Tetris game concept by Alexey Pajitnov
- Modern web technologies enabling rich browser games
- Open source community for tools and inspiration

---

**Happy Gaming!** 🎮