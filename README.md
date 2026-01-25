# Job Application Tracker

A simple, satisfying web app to track your job search progress. Pure frontend - no server required.

## Features

- **Manual entry form** for job applications with:
  - Company name
  - Role title
  - Application date
  - Job post date
  - Job URL
  - Status tracking (Applied → Responded/Ghosted → Interview → Offer/Rejected)
  - Notes

- **Dashboard view** showing:
  - All applications in a clean table
  - Filter by status
  - Quick stats: total applied, response rate, applications this week

## Tech Stack

- Pure HTML/CSS/JavaScript
- Browser localStorage for data persistence
- No dependencies, no build step

## Getting Started

Just open `index.html` in your browser. That's it.

Or deploy to any static hosting (Netlify, GitHub Pages, Vercel, etc.).

## Usage

- Click **"+ Add Application"** to log a new job application
- Use the **status dropdown** in each row to quickly update status
- **Filter** by status using the chips at the top
- **Edit** or **Delete** applications as needed

## Data Storage

All data is stored in your browser's localStorage. Data persists across sessions but is local to your browser/device.

To export your data, open browser DevTools → Console and run:
```javascript
copy(localStorage.getItem('jobApplications'))
```
