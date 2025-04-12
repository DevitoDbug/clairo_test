// Load environment variables from .env file (simplified version for browser)
(function() {
    // This is a simple environment variable loader for the browser
    // In a production environment, you would use a proper bundler like Webpack/Rollup
    
    // Default values - you must configure .env file with real values
    window.ENV = {
        CONTRACT_ADDRESS: "0x0000000000000000000000000000000000000000" // This is a placeholder, use .env for real address
    };
    
    // For development with actual .env loading, you would use:
    // 1. Server-side rendering with environment variables
    // 2. A bundler like webpack with dotenv plugin
    console.log("Environment config loaded - make sure to set up your .env file");
})(); 