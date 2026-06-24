# TomaChocolate - Frontend

> **Live Demo:** [tomachocolate.vercel.app](https://tomachocolate.vercel.app/)

*Note: The application interface is in Spanish as it is tailored for local users in Latin America to split everyday expenses.*

Welcome to the TomaChocolate frontend repository! This is the web interface of an application designed to simplify and optimize the split of group expenses in gatherings, barbecues, or events. The main goal is to offer an extremely simple, fast, and robust user experience without leaving functionalities aside in the process.

This project connects directly with the backend developed in Java: [TomaChocolate-API](https://github.com/Zadios/TomaChocolate-API).


## Main Features

- **Quick Gathering Creation:** Allows initializing an event by defining the name and the number of participants in seconds.
- **Participant and Expense Management:** Add, edit, or delete group members and dynamically assign the corresponding expenses.
- **Smart Balance Calculation:** Automates the split of bills, clearly showing who owes whom, minimizing the necessary transfers.
- **Export Results:** Allows copying the summary in a text format optimized for WhatsApp or downloading a visual ticket in PNG format.
- **Real-Time Synchronization:** Features an automatic update system (polling) to reflect changes made by other users in the same gathering.


## Technologies Used

The user interface was developed using the modern web development ecosystem:

- **React** (with TypeScript for safe and robust typing).
- **Vite** (as a bundler and ultra-fast development environment).
- **Tailwind CSS** (for modular, modern, and adaptive style design).
- **React Router DOM** (for navigation between screens).
- **Lucide React** (for the site's iconography).
- **html-to-image** (for generating and downloading the final ticket image).


## Local Setup (clone project on another computer)

#### 1\. Clone the repository

```bash
git clone https://github.com/Zadios/TomaChocolate-Front.git
cd TomaChocolate-Front
```

#### 2\. Install dependencies:

```bash
npm install
```

#### 3\. Configure environment variables:

Create a .env.local file in the project root and configure the URL of your local (or production) API:

```bash
VITE_API_URL=http://localhost:8080/api
```

#### 4\. Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173 (or the port indicated by the console).

## Project Structure

```text
src/
├── assets/        # Logos, images, and vectors
├── components/    # Reusable components (Modals, Toast, etc.)
│ └── layout/      # Structural components (Header, Footer)
├── pages/         # Main application views (Home, MeetingDetail)
├── services/      # Axios configuration and API route calls
└── utils/         # Helper functions and global error handler
```

## Developer

- Ariel Viscovich - [LinkedIn](https://www.linkedin.com/in/arielviscovich)
