# AI CV Grading & Sorting Platform

This project is an AI-powered job application platform that allows companies to collect, grade, and sort applicants using Gemini AI. It provides a modern, user-friendly interface for both applicants and administrators, with persistent state and detailed applicant review.

## Features

- **AI Grading & Sorting:** Uses Gemini AI to evaluate and score applicants based on their submitted documents and job requirements.
- **Admin Controls:** Admins can manually trigger AI sorting at any time before the deadline, or let it run automatically after the deadline.
- **Applicant Review:** Dedicated details page for each applicant, including PDF previews of uploaded documents and full AI grading analysis.
- **Persistent State:** All applicant data and grading results are stored and retrieved from localStorage.
- **Modern UI:** Built with React, TypeScript, Tailwind CSS, and shadcn-ui for a clean, responsive experience.
- **File Upload Guidance:** Applicants are guided to name their files for optimal AI recognition (e.g., include "cv", "resume", "cover", or "cert" in filenames).

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-ui](https://ui.shadcn.com/)

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm (v9 or later recommended)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd ai-cv-grade

# Install dependencies
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Environment Variables

You must provide a Gemini API key for AI grading. Create a `.env` file in the project root:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Usage

- **Admins:**
  - View job details, see all applicants, and trigger AI grading/sorting at any time.
  - Review AI-graded candidates, see detailed analysis, and preview applicant documents.
- **Applicants:**
  - Apply for jobs by uploading up to 2 PDF documents (max 2MB each) and/or providing a text CV.
  - Receive guidance on naming files for best AI recognition.
  - View their application status and details after submission.

## File Naming Guidance

For best AI grading results, name your files with keywords like `cv`, `resume`, `cover`, or `cert` (e.g., `john_cv.pdf`, `cover_letter.pdf`, `certificates.pdf`).

## Project Structure

- `src/pages/` — Main pages (JobDetails, ApplyJob, ApplicantDetails, etc.)
- `src/components/` — Reusable UI components
- `src/contexts/` — Context providers (e.g., Auth)
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utility functions

## Customization

- Update branding, colors, and UI in `tailwind.config.ts` and component files.
- Replace the Open Graph and Twitter images in `index.html` as needed.

## License

This project is provided as-is for educational and demonstration purposes. You may modify and use it for your own needs.
