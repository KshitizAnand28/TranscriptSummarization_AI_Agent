 Meeting Summarizer AI Agent - Complete Setup Guide

A comprehensive Spring Boot application that provides intelligent meeting summarization using Google's Gemini 2.5 flash AI model. Features real-time Slack integration and Chrome extension support for seamless meeting transcript processing.

 🚀 Features

- **AI-Powered Summarization**: Uses Google Gemini 2.5 flash for intelligent meeting analysis                                                   
- **Slack Integration**: Automatically posts summaries to your team channels
- **Chrome Extension Support**: Load extension and capture Google Meet captions
- **Multiple Input Methods**: Text paste, file upload.
- **Docker Deployment**: Easy containerized deployment from Docker Hub
- **Secure Configuration**: Environment variables for API key management

📋 Prerequisites

- Docker installed on your system
- Google account (for Gemini API)
- Slack workspace admin access
- Google Chrome browser
- Google Meet with captions enabled
  We are not sharing our own keys and tokens because of security reasons and Github rules and regulations.

🔧 Quick Start with Docker Hub

 Pull and Run the Application
 Pull the latest image from Docker Hub

docker pull spidermanmil/meeting-summarizer:latest
Run with your environment variables (Linux/macOS)

docker run -d -p 8080:8080
-e GEMINI_API_KEY=your_gemini_api_key_here
-e SLACK_BOT_TOKEN=your_slack_bot_token_here
-e SLACK_CHANNEL=your-channel-name
spidermanmil/meeting-summarizer:latest

Windows Command Prompt Version
docker run -d -p 8080:8080 -e GEMINI_API_KEY=your_gemini_api_key_here -e SLACK_BOT_TOKEN=your_slack_bot_token_here -e SLACK_CHANNEL=your-channel-name -e  spidermanmil/meeting-summarizer:latest


## 🔑 Complete API Setup Guide

### 1. Create Google Gemini 2.5 flash API Key

#### Step 1: Access Google AI Studio
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Accept the terms of service if prompted

#### Step 2: Create API Key
1. Click on **"Get API Key"** in the left sidebar
2. Click **"Create API Key"**
3. Choose **"Create API key in new project"** (recommended)
4. Your API key will be generated (starts with `AIzaSy...`)
5. **Important**: Copy and save this key securely
6. Click **"Done"**

#### Step 3: Verify Gemini 2.5 flash Model Access
1. In AI Studio, click **"Chat"**
2. Select **"Gemini 2.5 Flash"** from the model dropdown
3. Test with a simple prompt to ensure access
4. Your API key now has access to Gemini 2.5 flash

### 2. Create Slack Bot API

#### Step 1: Create Slack App
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Select **"From scratch"**
4. Enter **App Name**: `Meeting Summarizer Bot`
5. Select your **workspace**
6. Click **"Create App"**

#### Step 2: Configure Bot Permissions
1. In your app dashboard, go to **"OAuth & Permissions"**
2. Scroll to **"Scopes"** section
3. Under **"Bot Token Scopes"**, click **"Add an OAuth Scope"**
4. Add: `chat:write` (required - post messages)

#### Step 3: Install App to Workspace
1. Scroll to top of **"OAuth & Permissions"** page
2. Click **"Install to Workspace"**
3. Review permissions and click **"Allow"**
4. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)

#### Step 4: Add Bot to Channel
1. In Slack, go to the channel where you want summaries
2. Type: `/invite @Meeting Summarizer Bot`
3. Note the **channel name** (without #) for your environment variable

## 🌐 Chrome Extension Setup

### Step 1: Load Extension in Chrome
1. Download the extension files to your computer. Thw extension file is available in the repository as "extension"
2. Open Google Chrome
3. Go to `chrome://extensions/`
4. Enable **"Developer mode"** (top right toggle)
4. Click **"Load unpacked"**
5. Select the extension folder
6. Pin the extension to your toolbar


## 📝 Complete Workflow Guide

### Method 1: Google Meet + Chrome Extension Workflow

#### Step 1: Prepare Meeting
1. Start your Docker container using the command above
2. Open Google Meet in Chrome browser
3. **Enable captions**: Click CC button in Google Meet
4. Load the Chrome extension if not already active

#### Step 2: During Meeting
1. **Start recording**: Click extension icon → "Start Capture"
2. **Google Meet captions run** - extension captures in background
3. **Participate normally** in your meeting
4. Extension shows recording indicator

#### Step 3: After Meeting                                                                 
1. **Stop recording**: Click extension icon → "Stop Capture"
2. **Review transcript** in extension popup

### Manual Transcript Upload

#### Step 1: Get Transcript
1. **Copy transcript** from Google Meet captions
2. **Or download** transcript file if available
3. **Or paste** from other meeting platforms

#### Step 2: Process via Web Interface
1. **Open** `http://localhost:8080` in browser
2. **Choose input method**:
   - **Text Area**: Paste transcript directly
   - **File Upload**: Upload transcript file (TXT, PDF, DOC, DOCX)
3. **Click** "Summarize Text" or "Extract and Summarize Text File"

## 🔧 Configuration Examples

### Environment Variables Required
GEMINI_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXX # Your Gemini 2.5 flash API key
SLACK_BOT_TOKEN=xoxb-123456789067890-XXXXXXXXXXXXXXXXXXXXXXXX # Your Slack bot token
SLACK_CHANNEL=general # Channel name (without #)


## 🔍 Testing & Verification

### Test Container Status
Check if container is running
docker ps

View container logs
docker logs meeting-summarizer-app



### Access Web Interface
1. Open browser and go to: `http://localhost:8080`
2. You should see three sections:
   - **Summarize from Text**: Paste transcripts directly
   - **Summarize from Text File**: Upload document files
   - **Results**: Where summaries appear


## 🐛 Troubleshooting Guide

### Common Issues & Solutions

**Container won't start:**
Check Docker is running

docker --version
Check port availability

lsof -i :8080
Review logs for errors

docker logs meeting-summarizer-app


**Gemini API errors:**
- Confirm API key starts with `AIzaSy`
- Verify Gemini 2.5 flash model access in AI Studio
- Check API quotas in Google Cloud Console

**Slack integration fails:**
- Ensure bot token starts with `xoxb-`
- Verify bot is invited to target channel
- Check workspace permissions

**Chrome extension issues:**
- Reload extension at `chrome://extensions/`
- Verify extension settings URL matches your application
- Ensure Google Meet captions are enabled

**Connection refused (localhost:8080):**
- Verify container is running: `docker ps`
- Restart container if needed: `docker restart meeting-summarizer-app`

### Container Management Commands
Stop container

docker stop meeting-summarizer-app
Start container

docker start meeting-summarizer-app
Restart container

docker restart meeting-summarizer-app
Remove container

docker rm meeting-summarizer-app
View real-time logs

docker logs -f meeting-summarizer-app


## 🔒 Security Best Practices

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive configuration
- **Rotate API keys** periodically
- **Monitor API usage** to detect unauthorized access
- **Restrict Slack bot permissions** to minimum required scopes

## 📱 Platform Support

### Meeting Platforms with Premium Transcription
- **Google Meet Premium**: Built-in transcript download
- **Zoom Premium**: Automatic transcript generation
- **Microsoft Teams**: Meeting transcript export
- **Webex**: Transcript capture and export

### File Formats Supported
- **Text Files**: TXT format
- **Documents**: PDF, DOC, DOCX processing
- **Output**: Structured summaries with action items

## 🎉 Expected Benefits

After deployment, you should see:
- **Reduced meeting follow-up time** by 80%
- **Improved action item tracking** with clear ownership
- **Better team alignment** through shared summaries
- **Enhanced meeting accountability** with automated documentation
- **Instant team collaboration** via Slack integration

## 🚀 Quick Start Checklist

- [ ] Docker installed and running
- [ ] Google Gemini 2.5 flash API key created
- [ ] Slack bot created with `chat:write` permission
- [ ] Bot invited to target Slack channel
- [ ] Chrome extension loaded (if using)
- [ ] Container running with proper environment variables
- [ ] Application accessible at `http://localhost:8080`
- [ ] Test summarization working
- [ ] Slack notifications appearing

## 📞 Support

For issues and questions:
- Check container logs: `docker logs meeting-summarizer-app`
- Verify API keys are correctly set
- Ensure all prerequisites are met
- Test each component individually

Transform your meeting workflow today with AI-powered summarization and seamless team collaboration!

---

## 💡 Pro Tips

1. **Test locally first**: Ensure everything works on localhost before deploying
2. **Use descriptive channel names**: Makes it easier to organize different meeting types
3. **Keep API keys secure**: Never share or commit them to version control
4. **Monitor usage**: Check Gemini and Slack API usage regularly
5. **Train your team**: Show them how to use Google Meet captions effectively

Start revolutionizing your meeting productivity now!













