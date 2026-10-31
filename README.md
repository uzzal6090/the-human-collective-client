# 🌍 The Human Collective — Community Social Development Events Platform

> **Live Application URL:** [https://the-human-collective-client.vercel.app](https://the-human-collective-client.vercel.app)  
> **Backend Live API URL:** [https://the-human-collective-server.vercel.app](https://the-human-collective-server.vercel.app)  
> **Server Repository:** [https://github.com/uzzal6090/the-human-collective-server](https://github.com/uzzal6090/the-human-collective-server)  
> **Client Repository:** [https://github.com/uzzal6090/the-human-collective-client](https://github.com/uzzal6090/the-human-collective-client)

**The Human Collective** is a modern, community-driven social service and development events platform where citizens can discover, organize, join, and track impactful volunteer initiatives in their local neighborhoods (e.g., winter clothes distribution, tree plantation, cleanliness drives, and educational supply donations).

---

## ✨ 5 Key Features of the Platform

1. **Community Event Discovery & Advanced Real-Time Search:**
   - Seamlessly browse upcoming social initiatives with dynamic keyword search and category filtering (`Cleanup`, `Plantation`, `Donation`, `Education`, `Community Support`, `Health`).
   - Home page showcases 6 recent upcoming events dynamically queried directly from MongoDB using the `.limit(6)` operator.

2. **Full-Featured Event Organization & Ownership Protection:**
   - Authenticated community members can publish events with future-date validation (preventing past date scheduling), rich descriptions, and image covers.
   - Comprehensive **Manage Events** dashboard with in-place modal editing and confirmation-protected deletion, restricted exclusively to the original event organizer.

3. **Seamless Event Participation & Chronological Tracking:**
   - One-click **Join Event** action for volunteers with instant database synchronization and duplicate registration prevention.
   - Dedicated **Joined Events** dashboard displaying all initiatives the user has committed to, chronologically sorted by event date.

4. **Complete Dual-Theme Customization (Light & Dark Mode):**
   - System-wide theme switcher with instant visual transitions, persistent `localStorage` synchronization via React 19 `useSyncExternalStore`, and zero hydration flickering.

5. **Robust Authentication & State Persistence:**
   - Email/password authentication with strict security validation (uppercase, lowercase, and minimum 6 characters) powered by BetterAuth with MongoDB adapter and Jose JWT verification.
   - Protected dashboard routes with session guards that prevent premature login redirects on page reload.

---

## 🛠️ Technology Stack

- **Front-End Framework:** Next.js (App Router, React 19, TypeScript)
- **Styling & Design System:** Tailwind CSS v4 with custom HSL design tokens, glassmorphism, and responsive layouts
- **Icons & Branding:** Official modern X SVG logo, custom SVG icons, modern typography
- **State & Notifications:** Centralized Context API (`AuthContext`, `ThemeContext`), `react-hot-toast` (zero browser `alert()` calls)
- **Authentication & Security:** BetterAuth React Client, JWT Token verification, secure cookie sessions
- **Backend API:** Express.js 5 with MongoDB Native Driver & Atlas

---

## 📦 Getting Started Locally

### Prerequisites
- Node.js (v20 or higher)
- npm or pnpm
- Running server instance on `http://localhost:5000`

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/uzzal6090/the-human-collective-client.git
cd the-human-collective-client
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Development Server
Start the client application:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
Verify the production bundle:
```bash
npm run build
npm start
```

---

## 📄 License
This project is developed for educational and social impact assessment purposes.
