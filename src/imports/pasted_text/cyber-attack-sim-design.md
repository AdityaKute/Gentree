Design a modern, professional web application UI for a "Cyber Attack Simulation Environment" platform used by cybersecurity students and professionals.

STYLE & THEME:
- Dark theme (primary background: #0D1117, panels: #161B22)
- Accent colors: neon green (#00FF9C), cyber blue (#00CFFF), warning red (#FF4D4D)
- Typography: monospace (for terminal), clean sans-serif (for UI)
- Aesthetic: futuristic, hacker-style, minimal but technical (inspired by Kali Linux, VS Code, Hack The Box)

LAYOUT STRUCTURE:
Create a dashboard-based layout with the following sections:

1. LEFT SIDEBAR:
- Logo: "CyberSim Lab"
- Menu items:
  - Dashboard
  - Labs
  - Active Sessions
  - Snapshots
  - Logs
  - Settings
- Icons for each item
- Collapsible sidebar

2. TOP NAVBAR:
- Search bar (Search labs)
- User profile (avatar + dropdown)
- Notifications icon
- Status indicator (System Health: Active / Idle)

3. MAIN DASHBOARD VIEW:
- Cards showing:
  - Active Labs Count
  - Running Containers
  - CPU / Memory Usage (mini charts)
  - Recent Activity Logs
- Graph widgets (line charts for system usage)

4. LABS PAGE:
- Grid/list of labs:
  - Lab Name (e.g., DVWA, Metasploitable)
  - Difficulty (Easy, Medium, Hard)
  - Tags (SQLi, XSS, RCE)
  - Start Button
- Filter panel (difficulty, category)

5. ACTIVE SESSION VIEW (IMPORTANT):
Split screen layout:
- LEFT: Terminal panel (xterm.js style)
  - Black background
  - Green monospace text
  - Command input prompt
- RIGHT: Lab details panel
  - Container ID
  - Base Image
  - Status (Running / Stopped)
  - Buttons:
    - Snapshot
    - Reset
    - Stop Lab

6. SNAPSHOT MANAGEMENT:
- Table layout:
  - Snapshot ID
  - Timestamp
  - Session ID
  - Actions: Restore / Delete

7. LOGS PANEL:
- Streaming logs UI
- Filter by:
  - Container
  - Error / Info
- Highlight suspicious activity (red)

8. MODALS:
- Start Lab Confirmation
- Reset Warning (Destructive Action)
- Snapshot Saved Notification

INTERACTIONS:
- Smooth transitions
- Hover effects on buttons
- Terminal should look real-time and interactive
- Buttons: glow effect on hover

COMPONENTS:
- Reusable cards
- Data tables
- Buttons (Primary, Danger, Secondary)
- Terminal component
- Status badges

RESPONSIVE DESIGN:
- Desktop-first (primary)
- Tablet adaptive layout
- Collapse sidebar on smaller screens

EXTRA DETAILS:
- Add subtle grid/noise background
- Include loading states (spinners, skeletons)
- Show empty states (No Labs Running)
- Use realistic dummy data (container IDs, logs, timestamps)

GOAL:
The design should look like a real-world DevSecOps or cybersecurity training platform used in enterprise environments.