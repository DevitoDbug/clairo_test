# Environment Variables Setup

This project uses environment variables to manage sensitive configuration like contract addresses and API keys.

## Setup Instructions

1. Copy the `.env.example` file to a new file named `.env` in the `test-Frontend` directory:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your actual configuration values:

```
# Blockchain Configuration
CONTRACT_ADDRESS=0xYourActualContractAddressHere

# API Keys (add your API keys here when needed)
# MAPBOX_API_KEY=your_mapbox_api_key
# ALCHEMY_API_KEY=your_alchemy_api_key
```

3. The `.env` file is ignored by git to prevent secrets from being committed
4. **NEVER commit your actual `.env` file to the repository**

## How It Works

The environment variables are loaded by the `env-config.js` script and made available to the application via the global `window.ENV` object.

For production deployment, you should use a proper environment variable management system provided by your hosting platform.

## Available Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| CONTRACT_ADDRESS | Ethereum address of the deployed Clairo smart contract | Yes |
| MAPBOX_API_KEY | API key for Mapbox maps integration | No |
| ALCHEMY_API_KEY | API key for Alchemy blockchain services | No |

## Security Notes

- Never commit `.env` files to your repository
- Only commit the `.env.example` file with placeholder values
- Rotate API keys if you suspect they may have been compromised
- For production, use more robust environment variable management through your hosting provider
- Use a `.gitignore` file to ensure sensitive files are not tracked
- Regularly audit your git history to ensure no secrets were accidentally committed 