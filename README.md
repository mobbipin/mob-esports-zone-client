# MOB Esports Zone - Client

A modern, responsive React application for the ultimate competitive gaming platform. Built with TypeScript, Tailwind CSS, and modern React patterns.

## 🎮 Features

### 👤 Player Features
- **Authentication & Profile**
  - Register, login, and logout with email verification
  - Password reset and account restoration via OTP
  - Complete profile management (username, email, game username, region, bio, rank, avatar)
  - View achievements, tournament history, and player statistics
  - Account deletion with confirmation

- **Team Management**
  - Create teams (if not already in one)
  - Join teams via invites or requests
  - Manage team membership and roster
  - View and edit team details, logo, and information
  - Handle team invites and requests

- **Tournaments**
  - Browse and search tournaments (solo, duo, squad)
  - Register for tournaments with team selection
  - View registered tournaments and match history
  - Withdraw from tournaments (if allowed)
  - View tournament details, brackets, and results

- **Social Features**
  - Search for players and send friend requests
  - Accept/decline friend requests
  - View and manage friends list
  - Real-time notifications for invites, matches, and friend requests

- **Content & News**
  - View news, posts, and tournament updates
  - Like posts and view detailed post content
  - Browse through featured content

- **Dashboard**
  - Personalized dashboard with player statistics
  - Team information and management
  - Recent matches and tournament history
  - Pending invites and quick actions

### 🏆 Tournament Organizer Features
- **Account Management**
  - Register as organizer (requires admin approval)
  - Email verification required
  - Profile management with approval status display

- **Tournament Management**
  - Create tournaments (after approval and email verification)
  - Edit or delete own tournaments (if not yet approved)
  - Submit updates/deletions for approved tournaments via pending system
  - View and manage tournaments they created
  - View registered teams/players for their tournaments

- **Content Creation**
  - Create posts (after approval and email verification)
  - Posts require admin approval before being public
  - Edit or delete own posts (if not yet approved)
  - Submit updates/deletions for approved posts via pending system

- **Dashboard**
  - Organizer dashboard with tournament management
  - Approval status indicators
  - Quick actions for content creation

### 🛡️ Admin Features
- **User Management**
  - View, search, and filter all users (players, organizers, admins)
  - Ban/unban users with confirmation dialogs
  - Delete and restore user accounts
  - Approve/unapprove tournament organizers
  - Manage user roles and permissions

- **Tournament Management**
  - Create, edit, and delete tournaments
  - Approve/reject tournaments created by organizers
  - Manage all tournaments with full control
  - View tournament registrations and brackets

- **Content Management**
  - Create, edit, and delete posts
  - Approve/reject posts created by organizers
  - Manage all content with full control
  - View content analytics

- **Analytics & Monitoring**
  - View platform analytics (users, tournaments, posts)
  - Monitor pending approvals
  - Track platform usage and statistics

- **Dashboard**
  - Admin dashboard with quick actions
  - Pending approvals overview
  - Platform analytics and insights

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom components
- **State Management:** React Context API
- **Routing:** React Router v6
- **HTTP Client:** Custom API client with fetch
- **UI Components:** Custom component library with shadcn/ui patterns
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Build Tool:** Vite
- **Package Manager:** npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:8787
   VITE_APP_NAME=MOB Esports Zone
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Navbar, Footer, etc.)
│   └── ui/             # Base UI components (Button, Input, etc.)
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (API, utils)
├── pages/              # Page components
│   ├── admin/          # Admin-specific pages
│   ├── auth/           # Authentication pages
│   ├── client/         # Player-specific pages
│   ├── organizer/      # Organizer-specific pages
│   └── public/         # Public pages
└── index.tsx           # Application entry point
```

## 🔧 Key Components

### Authentication System
- **AuthContext:** Manages user authentication state
- **ProtectedRoute:** Route protection based on user roles
- **LoginPage/RegisterPage:** Authentication forms with validation
- **AccountRestoreDialog:** Account restoration via OTP

### Navigation & Layout
- **Navbar:** Responsive navigation with role-based menu items
- **Layout:** Main application layout wrapper
- **AdminLayout:** Admin-specific layout with sidebar
- **Breadcrumb:** Dynamic breadcrumb navigation

### UI Components
- **Button:** Multiple variants (primary, outline, ghost)
- **Input:** Form inputs with validation states
- **Card:** Content containers with consistent styling
- **Dialog:** Modal dialogs for confirmations and forms
- **Skeleton:** Loading state components
- **Toast:** Notification system

## 🎨 Design System

### Colors
- **Primary:** `#f34024` (Red)
- **Background:** `#1a1a1e` (Dark)
- **Surface:** `#15151a` (Darker)
- **Border:** `#292932` (Gray)
- **Text:** `#ffffff` (White) / `#9ca3af` (Gray)

### Typography
- **Headings:** Inter font family
- **Body:** System font stack
- **Responsive:** Mobile-first design approach

### Components
- **Consistent spacing:** 4px grid system
- **Border radius:** 8px for cards, 4px for inputs
- **Shadows:** Subtle elevation system
- **Animations:** Smooth transitions and hover effects

## 🔒 Security Features

- **Role-based access control** on frontend routes
- **Protected routes** for authenticated users
- **Input validation** on all forms
- **Secure token storage** in localStorage
- **Automatic logout** on token expiration
- **Account restoration** via secure OTP system

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interface elements
- **Optimized** for all screen sizes

## 🚀 Performance Optimizations

- **Code splitting** with React Router
- **Lazy loading** for route components
- **Optimized images** and assets
- **Minimal bundle size** with Vite
- **Efficient re-renders** with React.memo and useMemo

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Consistent** code style across the project

## 🔗 API Integration

The client communicates with the backend through a custom API client (`src/lib/api.ts`) that handles:
- **Authentication headers** automatically
- **Error handling** and user feedback
- **Request/response** transformation
- **File uploads** for images and avatars

## 📊 State Management

- **AuthContext:** User authentication and profile data
- **Local state:** Component-specific state with useState
- **Form state:** Controlled components with validation
- **API state:** Loading, error, and success states

## 🎯 Key Features Implementation

### Real-time Updates
- **WebSocket integration** for live notifications
- **Polling** for data updates where needed
- **Optimistic updates** for better UX

### File Uploads
- **Image compression** before upload
- **Progress indicators** for uploads
- **Preview functionality** for images

### Search & Filtering
- **Debounced search** for performance
- **Advanced filtering** options
- **Pagination** for large datasets

## 🐛 Troubleshooting

### Common Issues
1. **API Connection:** Ensure backend server is running
2. **Environment Variables:** Check `.env` file configuration
3. **Dependencies:** Run `npm install` if modules are missing
4. **Build Issues:** Clear `node_modules` and reinstall

### Development Tips
- Use React DevTools for debugging
- Check browser console for errors
- Verify API endpoints in Network tab
- Test on different screen sizes

## 📄 License

This project is part of the MOB Esports Zone platform.

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test on multiple screen sizes
4. Update documentation for new features
5. Ensure all tests pass

---

**Built with ❤️ for the gaming community**