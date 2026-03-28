GenTree (Family Tree Management System)
1. Project Context

Design a high-fidelity web application UI for GenTree, a family tree management system based on a recursive N-ary tree structure.

Each member node includes:

First Name
Middle Name
Last Name
DOB
DOD
Status (Alive / Dead)
Photo Path
Hierarchical memberId (e.g., 1.2.3)

The UI must reflect:

Recursive relationships (parent-child hierarchy)
DFS-based search behavior
Name-based insertion logic (Middle + Last name match)
2. Design System — "Heritage & Modernity"
🎨 Color Palette
Purpose	Color	Hex
Primary	Forest Green	#2D5A27
Secondary	Deep Olive	#4A7C59
Background	Antique Parchment	#FDF5E6
Surface	Warm Ivory	#FAF3E0
Accent	Muted Gold	#C2A878
Error	Deep Red	#8B0000
Alive Status	Soft Green	#6BA368
Dead Status	Muted Gray	#6C757D
🔤 Typography
Usage	Font	Style
Headings	Playfair Display	Elegant serif
Body/UI	Inter	Clean sans-serif
Scale
H1: 36px
H2: 28px
H3: 22px
Body: 16px
Caption: 12px
📐 Layout Rules
Border Radius: 12px (cards), 8px (inputs/buttons)
Spacing System: 4px base grid (4, 8, 12, 16, 24, 32)
Shadows:
Soft card shadow: 0px 4px 12px rgba(0,0,0,0.08)
Transitions: 200ms ease-in-out
3. Screen Architecture (Screen Map)
🔐 3.1 Authentication Screens
Login Screen
Centered card layout
Fields:
Username
Password
CTA: "Login"
Register Screen
Fields:
Email (Regex validation)
Username (alphanumeric, 5–15 chars)
Password (alphanumeric, min 6 chars)
Validation UI
Inline error messages:
Red text (#8B0000)
Input states:
Default / Focus / Error / Success
🌳 3.2 Main Dashboard
Layout
Left Sidebar (collapsible)
Top Navbar
Main Tree Canvas
Sidebar
Logo (GenTree)
Navigation:
Dashboard
Add Member
Search
Settings
Logout
Top Navbar
Search Bar (global)
User profile avatar
4. Core Feature — Tree Canvas
🌲 Tree Visualization (CRITICAL)

Design a zoomable + pannable canvas (like Figma/Miro):

Requirements
SVG-style node connections (lines/edges)
Smooth drag interaction
Zoom controls (+ / - / reset)
👤 Node Design

Each node must display:

Circular avatar (photoPath placeholder)
Full Name (First + Middle + Last)
memberId (small label)
Status indicator (Alive / Dead)
🎨 Node States
Alive Node
Background: Light green tint
Border: #6BA368
Status badge: "Alive"
Dead Node
Background: Light gray
Border: #6C757D
Optional: faded opacity (90%)
Status badge: "Deceased"
🧩 Node Interaction

On hover:

Elevation shadow
Highlight border

On click:

Open side panel / modal with full details
5. CRUD Operations (Modals)
➕ Add Member Modal

Fields (from Java constructor):

First Name
Middle Name
Last Name
DOB (Date Picker)
DOD (Date Picker)
Status (Dropdown: Alive / Dead)
Photo Upload
Parent Selection
Input: Middle Name + Last Name
Suggestion dropdown (search-based)
✏️ Update Member Modal
Pre-filled data
Editable fields
Save + Cancel buttons
❌ Delete Confirmation
Modal:
"Are you sure?"
Warning about subtree deletion
6. Advanced UI Features
🔍 Search Overlay (DFS-Based Filtering)
Behavior
Real-time filtering while typing
Matches:
Middle Name
Last Name
UI Design
Full-width overlay dropdown
Highlight matched nodes in tree
Dim non-matching nodes (opacity 30%)
🧠 Smart Suggestions
Autocomplete for names
Show:
Name + memberId + small avatar
7. Tree Interaction UX
Drag to move canvas
Scroll to zoom
Click node → focus subtree

Breadcrumb navigation (optional):

Root > Child > Grandchild
8. Full-Stack Constraints (IMPORTANT)
React + Tailwind Compatibility

Design must:

Use reusable components
Follow atomic design principles
Avoid absolute positioning where possible
Be responsive (desktop-first)
PostgreSQL Mapping Awareness

UI must support:

parent_id relationships
Hierarchical memberId
Efficient updates without re-rendering full tree
Performance Considerations
Lazy load deep branches
Virtualize large trees
Avoid rendering entire DOM
9. Component Library (Design Tokens)

Create reusable components:

Button (Primary / Secondary / Danger)
Input Field (with validation states)
Modal
Tree Node Card
Status Badge
Avatar
Dropdown / Autocomplete
10. Deliverables Expected from Designer
Full Figma file with:
Design system (colors, typography, components)
All screens (Auth, Dashboard, Modals)
Interactive Tree Canvas mock
Components:
Variants (hover, active, disabled)
Prototypes:
Node interaction
Search filtering
Modal flows
11. Design Tone Summary
Blend ancestral heritage (warm, organic tones) with modern SaaS clarity
Avoid overly futuristic styles
Prioritize readability and hierarchy clarity