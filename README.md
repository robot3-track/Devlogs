# DevLogs

DevLogs is a web application created for the FirstCommit Hackathon that simplifies project documentation for student developers. It allows users to input details about their build process, technical obstacles, and key learnings, then instantly formats that information into a structured GitHub README and Devpost submission description.

## The Problem

Beginner developers often struggle to write clear documentation after completing a hackathon project. Important details about technical challenges, setup instructions, and learning milestones are frequently omitted, leading to lower presentation scores during evaluation.

## Solution

DevLogs provides a streamlined input form tailored to hackathon judging criteria. As you type, the application generates clean, standard Markdown that can be copied directly into a GitHub repository or Devpost submission page.

## Key Features

* Real-time Markdown preview
* Local storage persistence to prevent data loss on refresh
* One-click copy functionality for formatted Markdown text
* Mobile-responsive layout optimized for desktop and handheld devices
* Zero external backend requirements or tracking scripts

## Built With

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide React

## Local Setup Instructions

1. Clone the repository:
   git clone https://github.com/your-username/devlogs.git

2. Navigate to the project directory:
   cd devlogs

3. Install dependencies:
   npm install

4. Run the development server:
   npm run dev

5. Open http://localhost:3000 in your browser to view the application.

## Deployment

This application is configured for standard deployment on Vercel. 

To deploy:
1. Push your code to a public GitHub repository.
2. Import the repository into your Vercel dashboard.
3. Keep default build settings (Next.js) and select Deploy.

## Learning Milestones

Building DevLogs provided direct experience in:
* Handling controlled form states in React with TypeScript
* Utilizing browser localStorage APIs for state persistence across browser reloads
* Formatting raw user strings into clean, multi-line Markdown output
* Building responsive two-column layouts using standard Tailwind CSS grid utilities

## Live Official Deployment
https://devlogging.vercel.app
