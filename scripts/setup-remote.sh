#!/bin/bash

# ============================================================================
# Web Tetris - Remote Repository Setup Script
# ============================================================================

echo "🎮 Setting up remote GitHub repository for Web Tetris..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

echo -e "${BLUE}ℹ️  Current git status:${NC}"
git status --short

# Check if remote origin already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Remote origin already exists:${NC} $(git remote get-url origin)"
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}ℹ️  Keeping existing remote origin${NC}"
        exit 0
    fi
fi

# Prompt for GitHub username/repository
echo
echo -e "${BLUE}📝 Enter your GitHub repository information:${NC}"
read -p "GitHub username: " username
read -p "Repository name (default: web-tetris): " repo_name

# Use default if not provided
repo_name=${repo_name:-web-tetris}

# Construct repository URL
repo_url="https://github.com/${username}/${repo_name}.git"

echo
echo -e "${BLUE}🔗 Repository URL:${NC} ${repo_url}"

# Confirm before proceeding
read -p "Is this correct? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}❌ Setup cancelled${NC}"
    exit 0
fi

# Add remote origin
echo -e "${BLUE}🔧 Adding remote origin...${NC}"
git remote add origin "${repo_url}" 2>/dev/null || git remote set-url origin "${repo_url}"

# Rename current branch to main if it's master
current_branch=$(git branch --show-current)
if [ "$current_branch" = "master" ]; then
    echo -e "${BLUE}📝 Renaming branch to 'main'...${NC}"
    git branch -M main
fi

# Push to remote repository
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
if git push -u origin main; then
    echo
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo
    echo -e "${BLUE}🌐 Your game will be available at:${NC}"
    echo -e "https://${username}.github.io/${repo_name}/"
    echo
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Go to your repository on GitHub"
    echo "2. Navigate to Settings → Pages"
    echo "3. Select 'GitHub Actions' as the source"
    echo "4. Wait for deployment to complete"
    echo "5. Your game will be live!"
else
    echo
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    echo -e "${YELLOW}💡 Possible solutions:${NC}"
    echo "- Check if the repository exists on GitHub"
    echo "- Verify your GitHub credentials"
    echo "- Make sure the repository is empty or has no conflicting files"
    exit 1
fi

echo
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e "${BLUE}Happy gaming! 🚀${NC}"