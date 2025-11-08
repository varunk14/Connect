# Real-Time Chat Application 💬

A beautiful, modern real-time chat application built with Next.js, Firebase Firestore, and Tailwind CSS. Chat with multiple users in real-time with a sleek, responsive interface.

## Features

- ✨ Real-time messaging with Firebase Firestore
- 👥 Live user list showing all online users
- 🎨 Modern, beautiful UI with Tailwind CSS
- 📱 Responsive design that works on all devices
- 🔔 System notifications for user join/leave events
- 💾 Username persistence (saved in localStorage)
- ⚡ Fast and lightweight
- ☁️ Persistent message history stored in Firestore

## Tech Stack

- **Next.js 14** - React framework
- **Firebase Firestore** - Real-time database and storage
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use an existing one)
   - Enable Firestore Database (start in test mode for development)
   - Go to Project Settings → General → Your apps
   - Click on the Web icon (`</>`) to add a web app
   - Copy your Firebase configuration

4. Create a `.env.local` file with your Firebase config:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Firebase configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Set up Firestore Security Rules (in Firebase Console → Firestore Database → Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Messages collection - anyone can read/write (for public chat)
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null || true; // Allow anonymous for demo
      allow update, delete: if false;
    }
    
    // Active users collection - anyone can read/write their own presence
    match /activeUsers/{userId} {
      allow read: if true;
      allow write: if true; // Allow anonymous for demo
    }
  }
}
```

**Note:** For production, implement proper authentication and security rules.

6. Start the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Free Deployment on Vercel ⚡

This app is optimized for Vercel deployment with Firebase Firestore.

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Add your Firebase environment variables:
   - Go to Project Settings → Environment Variables
   - Add all the `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local` file
6. Click "Deploy"
7. Your app will be live at `https://your-app-name.vercel.app`

**Note:** Vercel automatically detects Next.js projects and configures the build settings.

### Alternative: Deploy to Other Platforms

You can also deploy to:
- **Railway** - Works great with Next.js
- **Render** - Free tier available
- **Netlify** - Excellent Next.js support
- **Fly.io** - Generous free tier

Just make sure to set all the Firebase environment variables in your hosting platform's settings.

## Environment Variables

For production deployment, set these Firebase environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Your Firebase app ID

All variables should be prefixed with `NEXT_PUBLIC_` so they're available in the browser.

## Project Structure

```
ChatApp/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── components/
│   ├── ChatInterface.tsx    # Main chat component
│   ├── MessageList.tsx      # Message display
│   ├── MessageInput.tsx     # Message input
│   ├── UserList.tsx         # Online users list
│   └── UsernameModal.tsx    # Username entry modal
├── lib/
│   ├── firebase.ts          # Firebase initialization
│   └── firestore.ts         # Firestore service functions
├── package.json
└── README.md
```

## Usage

1. Enter a username when prompted
2. Start chatting with other users in real-time
3. See who's online in the sidebar
4. Messages appear instantly for all connected users

## Troubleshooting

### Firebase Connection Issues

- Make sure all Firebase environment variables are set correctly
- Verify your Firebase project has Firestore enabled
- Check that Firestore security rules allow read/write operations
- Check browser console for Firebase initialization errors

### Deployment Issues

- Ensure all `NEXT_PUBLIC_FIREBASE_*` environment variables are set in Vercel
- Check build logs for any errors
- Verify Firebase project settings match your environment variables
- Make sure Firestore is enabled in your Firebase project

### Firestore Queries

If you see errors about missing indexes, Firebase will provide a link to create them automatically. Click the link in the error message to create the required index.

## License

MIT License - feel free to use this project for your own purposes!

## Contributing

Feel free to submit issues or pull requests if you'd like to improve this chat app!

---

**Enjoy chatting! 💬✨**

