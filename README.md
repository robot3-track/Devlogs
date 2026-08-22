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
   ```bash
   git clone [https://github.com/robot3-track/Devlogs.git](https://github.com/robot3-track/devlogs.git)
