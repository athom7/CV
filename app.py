"""Job Application Tracker - A simple Flask app to track your job search."""

from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime, timedelta
import sqlite3
import os

app = Flask(__name__)
DATABASE = 'applications.db'

# Status workflow
STATUSES = ['Applied', 'Responded', 'Ghosted', 'Interview', 'Offer', 'Rejected']


def get_db():
    """Get database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database with the applications table."""
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            role TEXT NOT NULL,
            application_date DATE NOT NULL,
            job_post_date DATE,
            job_url TEXT,
            status TEXT DEFAULT 'Applied',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()


def get_stats():
    """Calculate dashboard statistics."""
    conn = get_db()

    # Total applications
    total = conn.execute('SELECT COUNT(*) FROM applications').fetchone()[0]

    # Applications by status
    status_counts = {}
    for status in STATUSES:
        count = conn.execute(
            'SELECT COUNT(*) FROM applications WHERE status = ?', (status,)
        ).fetchone()[0]
        status_counts[status] = count

    # Response rate (Responded + Interview + Offer + Rejected) / Total
    responded = status_counts.get('Responded', 0)
    interview = status_counts.get('Interview', 0)
    offer = status_counts.get('Offer', 0)
    rejected = status_counts.get('Rejected', 0)
    responses = responded + interview + offer + rejected
    response_rate = (responses / total * 100) if total > 0 else 0

    # Applications in past week
    week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    past_week = conn.execute(
        'SELECT COUNT(*) FROM applications WHERE application_date >= ?', (week_ago,)
    ).fetchone()[0]

    conn.close()

    return {
        'total': total,
        'status_counts': status_counts,
        'response_rate': round(response_rate, 1),
        'past_week': past_week
    }


@app.route('/')
def dashboard():
    """Main dashboard view."""
    conn = get_db()

    # Get filter parameter
    status_filter = request.args.get('status', '')

    # Build query
    if status_filter and status_filter in STATUSES:
        applications = conn.execute(
            'SELECT * FROM applications WHERE status = ? ORDER BY application_date DESC',
            (status_filter,)
        ).fetchall()
    else:
        applications = conn.execute(
            'SELECT * FROM applications ORDER BY application_date DESC'
        ).fetchall()

    conn.close()
    stats = get_stats()

    return render_template(
        'dashboard.html',
        applications=applications,
        stats=stats,
        statuses=STATUSES,
        current_filter=status_filter
    )


@app.route('/add', methods=['GET', 'POST'])
def add_application():
    """Add a new job application."""
    if request.method == 'POST':
        conn = get_db()
        conn.execute('''
            INSERT INTO applications (company, role, application_date, job_post_date, job_url, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            request.form['company'],
            request.form['role'],
            request.form['application_date'],
            request.form.get('job_post_date') or None,
            request.form.get('job_url') or None,
            request.form.get('status', 'Applied'),
            request.form.get('notes') or None
        ))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))

    return render_template('add_application.html', statuses=STATUSES, today=datetime.now().strftime('%Y-%m-%d'))


@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit_application(id):
    """Edit an existing application."""
    conn = get_db()

    if request.method == 'POST':
        conn.execute('''
            UPDATE applications
            SET company = ?, role = ?, application_date = ?, job_post_date = ?,
                job_url = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            request.form['company'],
            request.form['role'],
            request.form['application_date'],
            request.form.get('job_post_date') or None,
            request.form.get('job_url') or None,
            request.form['status'],
            request.form.get('notes') or None,
            id
        ))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))

    application = conn.execute('SELECT * FROM applications WHERE id = ?', (id,)).fetchone()
    conn.close()

    if not application:
        return redirect(url_for('dashboard'))

    return render_template('edit_application.html', app=application, statuses=STATUSES)


@app.route('/delete/<int:id>', methods=['POST'])
def delete_application(id):
    """Delete an application."""
    conn = get_db()
    conn.execute('DELETE FROM applications WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('dashboard'))


@app.route('/update-status/<int:id>', methods=['POST'])
def update_status(id):
    """Quick status update via AJAX."""
    data = request.get_json()
    new_status = data.get('status')

    if new_status not in STATUSES:
        return jsonify({'error': 'Invalid status'}), 400

    conn = get_db()
    conn.execute(
        'UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        (new_status, id)
    )
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'status': new_status})


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
