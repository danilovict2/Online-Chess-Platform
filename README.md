# Online Chess Platform

A platform where you can play chess against other players and Stockfish, with adjustable Elo settings.

## 🚀 Quick Start

Ensure the following are installed and configured:

- [Docker](https://www.docker.com/get-started)
- [Symfony](https://symfony.com/download)
- [Node.js](https://nodejs.org/)
- [Stockfish](https://stockfishchess.org/download/)

### Clone the project

```bash
git clone https://github.com/danilovict2/Online-Chess-Platform.git
cd Online-Chess-Platform
```

### Install Dependencies

```bash
composer install
npm install
```

### Run Migrations

```bash
docker compose up -d
symfony console doctrine:migrations:migrate
```

### Run the App

```bash
make server-start
```

### Access the Platform

Open your web browser and navigate to [http://127.0.0.1:8000](http://127.0.0.1:8000) to access the platform.

### Stop the App

```bash
make server-stop
```

## ✨ Features

- ♟️ Real-time multiplayer chess matches with customizable time controls and Elo rating adjustments based on performance.
- 🤖 Play against the Stockfish AI with different Elo ratings.
- 🔐 User authentication and authorization.
- 🌐 Mercure integration for real-time event broadcasting
- 🎨 Styling with Bootstrap.

## 🤝 Contributing

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.
