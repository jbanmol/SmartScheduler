# AI Task Calendar

An intelligent, customizable calendar application where you can describe your tasks in natural language, and the AI will organize them into a daily schedule for you.

**[➡️ Try the live demo here!](https://your-demo-link-here.com)**

## ✨ Features

-   **AI-Powered Task Creation**: Simply type your schedule in plain English (e.g., "Team meeting every Monday at 10 AM") and let the Gemini API parse and place it on the calendar.
-   **Interactive Calendar**: A clean and responsive monthly calendar view to see your schedule at a glance.
-   **Full Task Management**: Easily create, view, update, and delete tasks manually.
-   **Responsive Design**: A seamless experience on both desktop and mobile devices.
-   **Light & Dark Modes**: Switch between themes for your viewing comfort.
-   **Safe Deletion**: Confirmation dialogs to prevent accidental task removal.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/ai-task-calendar.git
    cd ai-task-calendar
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add your Google Gemini API key. The key must be available as `process.env.API_KEY`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running locally.
