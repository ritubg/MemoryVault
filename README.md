#  Memory Vault

**MemoryVault** is a modern, immersive digital time capsule and personal timeline application. Designed to preserve your most precious moments, it allows you to store photos, audio, video, and heartfelt letters to your future self, ensuring they remain private and secure until you're ready to revisit them.

---

##  Key Features

###  Interactive Timeline
- **Journey of Life**: Visualize your memories on a beautiful, interactive horizontal timeline.
- **Detailed Events**: Click any event to open a modal view with full notes and a rich media gallery.
- **Media Support**: Seamlessly attach photos, voice recordings, and videos to any moment.

###  Time Capsules
- **Seal for Later**: Create capsules filled with notes, media, and "Letters to Future Self."
- **Locked Memories**: Capsules are strictly locked until their specified "Open Date."
- **Vintage Scroll Reveal**: Unroll animated parchment letters when a capsule is finally opened.
- **Media Gallery**: A professional grid-view with a fullscreen lightbox for effortless browsing.

###  Secure & Private
- **User Authentication**: Personal accounts to keep your memories private.
- **Cloud-Ready Storage**: Integrated with LocalStack (S3) for robust media management in a containerized environment.

---

##  Tech Stack

- **Frontend**: React, CSS (Modern Glassmorphism & Animations), Lucide-Icons
- **Backend**: Flask (Python), MongoDB
- **Infrastructure**: Docker & Docker Compose
- **Media Storage**: LocalStack (S3 Mock)

---

##  Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd MemoryVault
2. **Start the application using Docker Compose**:
   ```bash
   docker-compose up
   ```
   *Note: This will spin up the Frontend, Backend, MongoDB, and LocalStack services.*

3. **Access the App**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5001](http://localhost:5001)
   - **LocalStack Gateway**: [http://localhost:4566](http://localhost:4566)

---

##  Project Structure

```text
MemoryVault/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # UI Components (Timeline, Capsules, etc.)
│   │   └── services/   # API logic
│   └── public/
├── backend/            # Flask server
│   ├── app.py          # Main backend logic
│   ├── Dockerfile      # Backend container config
│   └── .env            # Environment variables
├── docker-compose.yml  # Full stack orchestration
└── README.md           # You are here!
```

---

##  Media Management
All media uploads are processed through a secure pipeline:
1. Files are encoded to Base64 in the frontend.
2. The backend stores the binary data in **LocalStack S3**.
3. Media metadata and S3 URLs are persisted in **MongoDB**.

---


