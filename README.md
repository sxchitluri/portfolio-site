# Portfolio Website

A modern, responsive portfolio website built with HTML, TailwindCSS, and JavaScript.

## Features

- Responsive design that works on all devices
- Dark mode support with system preference detection
- Smooth animations and transitions
- Contact form with validation
- SEO optimized
- Performance optimized with lazy loading
- Analytics and error tracking integration

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portfolio-site.git
cd portfolio-site
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Configuration

1. Update the following files with your information:

   - Replace all instances of "Your Name" in `index.html`
   - Update social media links in the footer
   - Add your project images to `assets/images/`
   - Update meta tags with your information

2. Configure analytics and error tracking:

   - Replace `G-XXXXXXXXXX` with your Google Analytics ID
   - Replace `YOUR-SENTRY-DSN` with your Sentry DSN

3. Set up contact form backend:
   - Implement the `/api/contact` endpoint
   - Configure CSRF protection
   - Set up email notifications

## Directory Structure

```
portfolio-site/
├── assets/
│   └── images/
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── index.html
├── about.html
├── project.html
├── contact.html
├── input.css
└── package.json
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
