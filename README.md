## 🌼 Daisy SMS Bot - Discord Number Rental Bot

### 🌟 Description

Daisy SMS Bot is a powerful and user-friendly Discord bot that allows users to rent phone numbers for SMS verification directly from Discord. It is specifically designed to work with the **DaisySMS API**, offering seamless integration for renting temporary numbers for various online services.

### ✨ Features

| Feature                       | Description                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| 📱 Rent Numbers               | Rent temporary phone numbers directly from Discord.                       |
| 🔄 Real-Time Updates          | Get instant updates on rented numbers and received SMS codes.             |
| 💬 Simple Commands            | Easy-to-use command interface for managing rented numbers.                |
| ✅ Interactive Buttons         | Button-based controls for marking tasks as done, repeating, or canceling. |
| 📊 Logging and Error Handling | Real-time logs and robust error handling to ensure smooth operation.      |

### 🔧 Commands

| Command      | Description                                 |
| ------------ | ------------------------------------------- |
| `/getnumber` | Rent a phone number for a specific service. |
| `/done`      | Mark the process as completed.              |
| `/repeat`    | Repeat the number retrieval process.        |
| `/cancel`    | Cancel the current operation.               |

### 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/blucifer1337/daisy-sms-bot.git
   ```
2. Navigate to the directory:

   ```bash
   cd daisy-sms-bot
   ```
3. Install the dependencies:

   ```bash
   npm install
   ```

### 🛠️ Configuration

Create a `.env` file with the following variables:

```
DISCORD_TOKEN=your_discord_token
DAISYSMS_API_KEY=your_daisysms_api_key
```

### ▶️ Running the Bot

To start the bot locally:

```bash
node index.js
```

To keep the bot running as a background service:

```bash
pm2 start index.js --name daisy-sms-bot
```

### 🤝 Contributing

We welcome contributions! Feel free to fork the project and submit pull requests.

### 📄 License

Licensed under the MIT License.

### ❓ Issues

For any issues or feature requests, please open an issue on the [GitHub repository](https://github.com/blucifer1337/daisy-sms-bot).

### 📚 DaisySMS API Documentation

For more details on how the DaisySMS API works, please visit the [official documentation](https://daisysms.com/docs/api).
