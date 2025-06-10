<div align="center">

![BeatSync Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=BeatSync&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient)

[![Discord](https://discordapp.com/api/guilds/903043706410643496/widget.png?style=banner2)](https://discord.gg/SNG3dh3MbR)

[![Support](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/nanotect)

</div>

## 📋 Overview

BeatSync is a web-based request system for osu! beatmaps, featuring Twitch authentication and a user-friendly interface. It allows users to submit beatmap requests with mods, view request history, and manage submissions efficiently.

## 🏗️ Serverless

This application is built using a serverless architecture, leveraging Vercel's serverless functions for optimal performance and scalability:

- **Frontend**: React application served through Vercel's Edge Network
- **Backend**: Serverless API routes using Vercel Functions
- **Database**: MongoDB Atlas for persistent storage
- **Authentication**: Twitch OAuth integration
- **Real-time Updates**: Polling mechanism for request status

## ✨ Features

- 🔐 Twitch Authentication (Login/Logout)
- 🎵 Beatmap Link Submission (osu!standard only)
- 🎮 Mod Selection Dropdown
- 📜 Request History Display
- 🎨 User-Friendly Interface
- ⚡ Real-time Updates
- 🔄 Request Cooldown System

## 🚀 Deployment

### Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)
- [osu! API Key](https://osu.ppy.sh/home/account/edit)
- [Twitch OAuth Credentials](https://dev.twitch.tv/console/apps)

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Adivise/BeatSync)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Configure your environment variables in Vercel
4. Deploy!

### Environment Variables

Configure these in your Vercel project settings:

```env
# Database Configuration
DATABASE=your_mongodb_atlas_connection_string

# Server Configuration
BASE_URL=your_vercel_deployment_url

# Twitch Configuration
TWITCH_CLIENT=your_twitch_client_id
TWITCH_SECRET=your_twitch_secret

# osu! Configuration
OSU_OPPONENT=your_osu_username
OSU_USERNAME=your_osu_username
OSU_PWD=your_osu_password
API_KEY=your_osu_api_key
```

## ⚙️ Configuration

All backend/frontend configuration is handled through Vercel environment variables. Make sure to set them all in your Vercel project settings.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

<div align="center">
  <img src="https://contributors-img.web.app/image?repo=Adivise/BeatSync" />
</div>

## 🙏 Credits

- Inspired by: [DRB - Request bot](https://btmc.live/requests/)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

- Ensure all environment variables are properly set in Vercel
- Keep your API keys and credentials secure
- Make sure to update the BASE_URL in Vercel after deployment and redeploy
- The app requires a MongoDB Atlas database for production use
- Update your Twitch OAuth redirect URI to match your Vercel deployment URL
- Serverless functions have execution time limits (10s on Vercel's free tier)

## 🔗 Links

- [Discord Server](https://discord.gg/SNG3dh3MbR)
- [Support on Ko-fi](https://ko-fi.com/nanotect)
- [osu! Website](https://osu.ppy.sh)
- [Twitch Developer Console](https://dev.twitch.tv/console/apps)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
