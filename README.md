TG @big_elon7

# CAPTCHA Verification Node.js Application

A simple Node.js application that implements CAPTCHA verification using hCaptcha.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
HCAPTCHA_SECRET_KEY=your_secret_key_here
```

3. Replace `YOUR_SITE_KEY` in `views/index.html` with your hCaptcha site key.

## Running the Application

Start the server:
```bash
node server.js
```

The application will be available at `http://localhost:3000`

## Features

- Modern, responsive UI
- CAPTCHA verification using hCaptcha
- Server-side verification
- Error handling and user feedback

## Project Structure

```
├── public/
│   ├── challenge.css
│   ├── api.js
│   └── captcha.js
├── views/
│   └── index.html
├── server.js
├── package.json
└── README.md
```

## Dependencies

- express
- body-parser
- cors
- dotenv 
