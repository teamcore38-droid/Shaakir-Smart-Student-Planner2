# Smart Student Planner

A premium, Apple HIG-inspired mobile application for academic task management, built with **React Native (Expo SDK 52)** and integrated with **Firebase Cloud services**. Designed to help university students organize their coursework, track deadlines, create custom modules, and manage their academic workload in real time.

---

## Features

- **Real-Time Authentication** — User registration and login utilizing Firebase Authentication.
- **Academic Progress Dashboard** — Visual overview card displaying completion rate, overdue counts, and stats (Total, Active, Completed, Overdue).
- **Task Management (CRUD)** — Create, view, edit, and delete tasks with details: title, academic module, due date, priority, and notes.
- **Dynamic Course Categories** — Create and delete custom course module labels inside Settings that dynamically populate the task form select sheets.
- **Interactive Dashboard Filtering** — Filter upcoming deadlines directly from the home screen by task name, due date (Today, This Week, Overdue), and priority level (High, Medium, Low).
- **Local Settings Persistence** — Preferences like notification triggers, displaying completed tasks, deletion confirmation alerts, and default sort choices are persisted via AsyncStorage.
- **Profile Summary** — Displays user stats and personal metrics.
- **Responsive Layout** — Visually cohesive light theme built using modular spacing tokens, optimized for both iOS and Android platforms.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.76.9 | Native mobile core framework |
| Expo SDK | 52.0.0 | Managed development workflow |
| Firebase SDK | 12.14.0 | Real-time database & auth service |
| React Navigation | 6.x | Navigation (Stack & Bottom Tabs) |
| AsyncStorage | 1.23.1 | Local preferences storage |
| Expo Vector Icons | 14.x | Ionicons icon pack |
| React | 18.3.1 | UI library |

---

## Architecture

The application implements the **MVVM (Model-View-ViewModel)** architectural pattern:

- **Model** — Firestore database client API, `StorageService` (AsyncStorage local driver), and `ValidationService`.
- **ViewModel** — `AuthContext` (manages auth state) and `TaskContext` (synchronizes task/module data in real time).
- **View** — Screens and custom UI components styled via design tokens.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for more details.

---

## Project Structure

```
SmartStudentPlanner/
├── App.js                          # Application entry point
├── app.json                        # Expo configuration configuration
├── package.json                    # Dependency and script list
├── src/
│   ├── config/
│   │   └── firebaseConfig.js       # Firebase credential connections
│   ├── context/                    # State contexts (ViewModel)
│   │   ├── AuthContext.js
│   │   └── TaskContext.js
│   ├── screens/                    # View screens (View)
│   │   ├── OnboardingScreen.js
│   │   ├── LandingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── TaskListScreen.js
│   │   ├── AddTaskScreen.js
│   │   ├── EditTaskScreen.js
│   │   ├── TaskDetailScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   ├── components/                 # Reusable layout UI components
│   │   ├── CustomButton.js
│   │   ├── TaskCard.js
│   │   ├── PriorityBadge.js
│   │   ├── SearchBar.js
│   │   ├── StatCard.js
│   │   └── EmptyState.js
│   ├── navigation/                 # Screen routing
│   │   └── AppNavigator.js
│   ├── services/                   # Business data layer (Model)
│   │   ├── StorageService.js
│   │   └── ValidationService.js
│   ├── utils/
│   │   ├── constants.js            # Design/validation configuration
│   │   └── helpers.js              # Sorting and metrics math helpers
│   └── theme/
│       └── theme.js                # Core colors, border radii, spacings
├── assets/                         # Graphic banners, icon overlays, and splashtypes
└── docs/                           # Interactive documentation files
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+
- **Expo Go** app installed on your Android/iOS mobile device.

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-student-planner.git
   cd smart-student-planner/SmartStudentPlanner
   ```

2. **Install node dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase (Optional)**
   The project has built-in connection credentials defined inside `src/config/firebaseConfig.js`. If you wish to connect it to your own Firebase project, replace the keys in that file with your own console parameters.

4. **Start the development server**
   ```bash
   npx expo start
   ```
   *Note: Add `--tunnel` if you are testing on physical mobile devices outside of your local network environment: `npx expo start --tunnel`.*

5. **Scan and Load**
   Scan the terminal QR code with the **Expo Go** app (Android) or the native Camera app (iOS) to load the interface.

---

## Seeding Sample Tasks

To quickly test dashboard sorting, stats, and filtering:
1. Run the app and log in to your account.
2. Navigate to **Settings** -> Tap **Seed Sample Tasks** (under Demo Tools).
3. Confirm the prompt to populate 15 tasks across all default modules with relative future/past deadlines and varying priorities.

---

## Known Limitations & Future Enhancements

1. **Text Date Input** — Task due dates are input as strings (`YYYY-MM-DD`) with auto-formatting logic. Future versions will integrate a graphical datetime selector (`@react-native-community/datetimepicker`).
2. **Push Notifications** — Setting toggle is a mock placeholder. A future release will bind it to Expo Notifications and a cron scheduler to trigger push reminders.
3. **Dark Mode** — Layout styles support theme tokens, but a toggle switch to dynamically swap styles has not yet been built.
4. **File Attachments** — Course tasks only support text descriptions. A natural expansion would support document or photo uploads.

---

## License

Developed as part of the LDC6004M Mobile Application Development assessment brief at York St John University.
