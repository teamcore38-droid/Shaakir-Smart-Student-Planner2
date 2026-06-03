# Architecture Overview — Smart Student Planner

## Architectural Pattern: MVVM (Model-View-ViewModel)

The Smart Student Planner follows the **Model-View-ViewModel (MVVM)** architectural pattern, chosen for its clear separation of concerns, testability, and suitability for React's component-based paradigm.

### Layer Breakdown

```
┌─────────────────────────────────────────────┐
│                   VIEW                       │
│  React Native Screens & Components          │
│  (LoginScreen, DashboardScreen, TaskCard…)   │
├─────────────────────────────────────────────┤
│                VIEWMODEL                     │
│  React Context Providers                     │
│  (AuthContext, TaskContext)                   │
│  Business logic, validation, state mgmt      │
├─────────────────────────────────────────────┤
│                  MODEL                       │
│  Data Layer & Services                      │
│  (Firebase SDK, StorageService,              │
│   ValidationService)                        │
│  Cloud Firestore database, AsyncStorage      │
└─────────────────────────────────────────────┘
```

### Why MVVM?

1. **Separation of Concerns** — UI logic lives in screens; business logic and synchronization live in contexts; data persistence is managed by Firebase and local services. Each layer can be modified independently.
2. **Testability** — ViewModels (contexts) can be unit-tested without rendering UI components.
3. **Reusability** — The same ViewModel (e.g., TaskContext) serves multiple views (Dashboard, TaskList, TaskDetail).
4. **Scalability** — New features (e.g., custom modules, dashboard filtering) are added by extending contexts and database collections without affecting core UI components.

---

## Project Structure

```
SmartStudentPlanner/
├── App.js                          # Entry point — provider wiring
├── app.json                        # Expo configurations (v52)
├── package.json                    # Dependencies (React Native 0.76.9, Expo 52)
├── src/
│   ├── config/
│   │   └── firebaseConfig.js       # Firebase SDK initialization settings
│   ├── context/                    # ViewModel layer
│   │   ├── AuthContext.js          # Authentication state & Firebase Auth actions
│   │   └── TaskContext.js          # Task CRUD, custom modules categories, sorting
│   ├── screens/                    # View layer — full-page components
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
│   ├── components/                 # Reusable UI components
│   │   ├── CustomButton.js
│   │   ├── TaskCard.js
│   │   ├── PriorityBadge.js
│   │   ├── SearchBar.js
│   │   ├── StatCard.js
│   │   └── EmptyState.js
│   ├── navigation/                 # Navigation configurations
│   │   └── AppNavigator.js
│   ├── services/                   # Model layer — data services
│   │   ├── StorageService.js       # Local settings persistence (AsyncStorage)
│   │   └── ValidationService.js    # Data schema validation rules
│   ├── utils/                      # Shared utilities
│   │   ├── constants.js
│   │   └── helpers.js
│   └── theme/                      # Styling tokens
│       └── theme.js
├── assets/                         # Images, icons, fonts
└── docs/                           # Design documentation
    ├── ARCHITECTURE.md
    ├── NAVIGATION_FLOW.md
    └── WIREFRAMES.md
```

---

## Data Flow

```
User Action → Screen (View) → Context Method (ViewModel) → Cloud Firestore (Model) → Real-time Sync
```

### Example: Adding a Task
1. User fills form on AddTaskScreen and taps "Create Task".
2. Screen calls `addTask()` from `TaskContext`.
3. `TaskContext` validates fields via `ValidationService`.
4. If valid, generates task payload mapped to `user.id`.
5. Calls Firestore `addDoc` to persist task in the remote cloud database.
6. Firestore listener automatically fires update event to all subscribed devices.
7. React state updates on the home screen; stats and lists re-render.
8. Screen shows success alert, navigates back.

---

## State Management

- **React Context API** with custom hooks (`useAuth`, `useTasks`).
- **AuthContext**: Manages user sessions via Firebase Authentication SDK (real-time logins, registrations, profile updates).
- **TaskContext**: Manages tasks (CRUD, sorting, dashboard filtering, custom modules categories) using live Cloud Firestore snapshot streams.
- **AsyncStorage**: Used for lightweight, non-sensitive preferences (e.g. notifications, sorting options, deletion prompts).

---

## Navigation Architecture

```
Root Navigator (conditional)
├── Auth Stack (when user === null)
│   ├── OnboardingScreen
│   ├── LandingScreen
│   ├── LoginScreen
│   └── RegisterScreen
└── Main Tab Navigator (when user !== null)
    ├── Home Tab → DashboardScreen
    ├── Tasks Tab → Task Stack Navigator
    │   ├── TaskListScreen
    │   ├── TaskDetailScreen
    │   ├── AddTaskScreen
    │   └── EditTaskScreen
    ├── Profile Tab → ProfileScreen
    └── Settings Tab → SettingsScreen
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| React Native (Expo SDK 52) | Cross-platform, large ecosystem, native module alignment |
| Firebase Authentication | Industry-standard secure sign-ins, session management |
| Cloud Firestore | Secure cloud-synced database with real-time updates and native offline caching |
| Context API | Sufficient for app complexity, avoids excessive Redux boilerplate |
| AsyncStorage | Persists user-specific settings (e.g. sort selections) locally |
| Centralised theme | Ensures Apple HIG-inspired visual coherence across screens |
| Centralised validation | Enforces strict schema constraints across fields |

---

## Target Users

University students who need a dedicated tool to organize academic tasks, track deadlines across courses, and maintain visibility of their workload. The app prioritizes simplicity, real-time sync, custom course grouping, and clean usability.
