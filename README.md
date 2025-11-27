SmartDhobi — Campus Laundry Management System
SmartDhobi is a web application built to simplify the laundry process in hostel environments.
It allows students to submit their laundry bags and track progress, enables staff to update washing stages, and provides administrators with complete oversight.
This version is implemented fully on the front end using React and LocalStorage for demonstration purposes.

1. Features
Student Module:
⦁	Login using roll number
⦁	One-time profile setup
⦁	Submit laundry with Bag ID and clothes count
⦁	Automatic pickup date estimation
⦁	Live status tracking through each stage
⦁	Confirm pickup once the bag is ready
⦁	View full history of previous drop-offs

Staff Module:
⦁	Login using credentials
⦁	Dashboard view of all active bags
⦁	Search by Bag ID or roll number
⦁	Detailed bag view with student information
⦁	Update stages: Washing, Drying, Ready for Pickup
⦁	Ability to assign a bag to themselves

Admin Module:
⦁	Login with admin credentials
⦁	Dashboard with system-level statistics
⦁	View and manage all laundry bags
⦁	Manage staff accounts
⦁	Access a complete audit log for each bag

UI/UX:
⦁	Dark theme
⦁	Consistent card-based layout
⦁	Global header for quick role navigation
⦁	Responsive design suitable for various screen sizes


2. Setup Instructions
⦁	Install Node.js (v18 or above).
⦁	Clone or download the repository.
⦁	Open a terminal inside the project directory.
⦁	Install project dependencies: npm install
⦁	Run the development server: npm run dev
⦁	Open the URL displayed in the terminal (for example: http://localhost:5173).
No backend setup is required; LocalStorage is used for data in this demo.

3. Tech Stack Used
Frontend:
⦁	React
⦁	React Router DOM
⦁	Vite
⦁	JavaScript (ES6+)
⦁	CSS

Tools:
⦁	Node.js
⦁	npm

4. Assumptions and Bonus Features
Assumptions
⦁	LocalStorage is used as the data store since no backend API is connected.
⦁	Authentication for all roles is handled on the client side and kept simple for demonstration.
⦁	Bag IDs are assumed to be unique and validated at the interface level.
⦁	The laundry process follows a fixed sequence of stages.

Bonus Features
⦁	A clean dark-mode interface for better visual consistency.
⦁	“Assign to Me” feature for staff to avoid conflicts during processing.
⦁	Automatic pickup date calculation during drop-off.
⦁	Basic audit log showing key actions performed on each bag.
