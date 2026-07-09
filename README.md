# MedScan - Advanced Medical Image Analysis for Disease Diagnosis

MedScan is an advanced web application that leverages AI to provide automated detection and diagnosis of various medical conditions, including pneumonia, eye diseases, and skin diseases. This project is built using a combination of FastAPI for the backend and React (with Vite and pnpm) for the frontend.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

- **Pneumonia Detection:** Analyze chest X-rays to detect signs of pneumonia.
- **Eye Disease Detection:** Diagnose various eye conditions using advanced image analysis.
- **Skin Disease Detection:** Identify different skin diseases through AI-powered analysis.
- **User-Friendly Interface:** Clean and intuitive UI for easy navigation and usage.
- **AI-Powered Medical Guidance:** Provides precautions, possible treatments, and medication suggestions based on the detected condition.
- **Integrated AI Chatbot:** Includes an intelligent medical chatbot powered by the Groq API to answer health-related queries and assist users interactively.
- **Downloadable Medical Reports:** Users can download AI-generated diagnostic reports in PDF format for future reference and sharing.
- **User-Friendly Interface:** Clean and intuitive UI for easy navigation and usage.

## Project Structure

- **Frontend:** React, Vite, Tailwind CSS, CSS.
- **Backend:** FastAPI.
- **Model Training:** Python, TensorFlow/Keras, OpenCV.

## Output
### Pneumonia Detection Result
<img width="1016" height="787" alt="image" src="https://github.com/user-attachments/assets/5ae9d436-6457-4065-9f23-ef4dcaf85146" />

### Eye Disease Detection Result
<img width="1843" height="863" alt="image" src="https://github.com/user-attachments/assets/d5c82f37-3525-4e50-b621-0a8972c66d53" />

### Skin Disease Detection Result
<img width="1010" height="785" alt="image" src="https://github.com/user-attachments/assets/750b9281-630b-4bb3-af36-92a972b009b7" />

### AI Chat Bot
<img width="528" height="747" alt="image" src="https://github.com/user-attachments/assets/36136ea7-3fb5-4c19-8cb0-6f3e4d9cc8f1" />

## Installation

### Prerequisites

- Node.js and pnpm (for the frontend)
- Python 3.10.x and pip (for the backend)

### Clone the Repository

```sh
git clone https://github.com/PoonamxGit/MEDSCAN.git
cd medscan
```

### Backend Setup

1. Navigate to the backend directory:

    ```sh
    cd server
    ```

2. Create a virtual environment and activate it:

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the required packages:

    ```sh
    pip install -r requirements.txt
    ```

4. Run the FastAPI server:

    ```sh
    uvicorn main:app --reload
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```sh
    cd client
    ```

2. Install the required packages using pnpm:

    ```sh
    pnpm install
    ```

3. Start the development server:

    ```sh
    pnpm run dev
    ```

## Environment Variables

Create a `.env` file in the root of the `client` directory and add the following environment variables:

```plaintext
VITE_URL
VITE_PHONE
VITE_EMAIL
VITE_GROQ_API_KEY=your_groq_api_key
```

## Usage

1. Navigate to the frontend URL provided by Vite (usually `http://127.0.0.1:5173`).
2. Use the navigation bar to access different sections: Home, Services, About, and Contact Us.
3. In the Services section, choose the type of medical analysis you want to perform.
4. Upload the relevant medical image and click "Predict" to see the results.

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss your changes.

## Contact

- **Project Repository:** [MedScan](https://github.com/PoonamxGit/MEDSCAN.git)
