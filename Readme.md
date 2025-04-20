# Sukun

A mental health support platform designed specifically for students — providing them tools like journaling, meditation, mood tracking, community interaction, mental health games, and inspirational resources to help them achieve emotional balance and resilience.

---

## 🌟 Project Overview

**Sukun** is a modern, full-stack mental wellness platform where students can:
- Track their mood
- Write journal entries
- Connect with a supportive community
- Meditate, relax, and play therapeutic games
- Access a curated library of resources, videos, and music
- Receive AI-powered insights and personalized recommendations

The goal of Sukun is to offer a safe, supportive, and engaging digital environment promoting mental health awareness and daily emotional care.

---

## 🚀 Features

- 📝 **Journal** — Record thoughts, feelings, and analyze entries with AI.
- 📈 **Mood Tracker** — Track mood history visually with calendars and charts.
- 🧘 **Meditation & Music** — Guided meditation sessions and relaxing music playlists.
- 🎮 **Therapeutic Games** — Breathing exercises, memory games, color therapy, and more.
- 🤝 **Community Forum** — Connect, share experiences, and support each other.
- 📚 **Resources & Videos** — Curated mental health resources and inspiring videos.
- 💬 **Chat Support** — Real-time chat feature for discussions and support.
- 📊 **Insights** — Personalized mental health insights powered by AI.
- 🔒 **Authentication** — Secure login and registration via NextAuth.

---

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, CSS Modules
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Server Functions (APIs)**: Server Actions with Next.js API Routes
- **State Management**: Context API
- **UI Components**: Custom and Shadcn/ui based components
- **Other Tools**:
  - Framer Motion (animations)
  - Chart.js (mood charts and wellness graphs)
  - Gemini API (for journal analysis)
  - YouTube API (for curated videos)
  - Accessibility enhancements
  - Mobile-first responsive design

---

## 🧩 Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/ketanop321-mental-health-support-platform-for-students.git
cd ketanop321-mental-health-support-platform-for-students
```

### 2. Install Dependencies

Using `pnpm`:

```bash
pnpm install
```

Or if you prefer npm:

```bash
npm install --legacy-peer-deps
```

Or yarn:

```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the required environment variables like:

```env
DATABASE_URL=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

(Refer to the `lib/` folder to understand the required APIs.)

### 4. Run the Development Server

```bash
pnpm dev
```

Or:

```bash
npm run dev
```

Or:

```bash
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🧪 Usage

Once the server is running:
- Register or log in
- Access the dashboard
- Start journaling or tracking moods
- Explore meditation, games, and other supportive resources
- Connect with the community and enhance your mental well-being!

---

## 📁 Project Structure (Key Folders)

| Folder         | Description                                           |
| -------------- | ----------------------------------------------------- |
| `app/`         | Main app pages and API routes (Next.js App Router)    |
| `components/`  | UI components and reusable elements                  |
| `hooks/`       | Custom React hooks                                    |
| `lib/`         | Server-side helpers (DB, Auth, AI, Utils)             |
| `public/`      | Static files                                          |
| `styles/`      | Global and custom CSS                                |

---

## 💖 Contributing

Contributions are welcome!  
Feel free to fork the repository, create a pull request, or open issues for suggestions and improvements.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 📞 Contact

Made with 💚 for student wellness.

If you have any queries, feel free to reach out via GitHub Issues or Discussions!
