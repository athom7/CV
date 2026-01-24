# Job Application Tracker

A simple, satisfying web app to track your job search progress.

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

- Python/Flask
- SQLite database
- Vanilla HTML/CSS (no framework)

## Getting Started

1. Install dependencies:
   ```bash
   pip install flask
   ```

2. Run the app:
   ```bash
   python app.py
   ```

3. Open http://localhost:5000 in your browser

## Usage

- Click **"+ Add Application"** to log a new job application
- Use the **status dropdown** in each row to quickly update status
- **Filter** by status using the chips at the top
- **Edit** or **Delete** applications as needed

## Database

The SQLite database (`applications.db`) is created automatically on first run.
