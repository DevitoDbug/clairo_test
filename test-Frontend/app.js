// Contract information
const contractAddress = window.ENV?.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"; // Safe fallback for testing
let contractABI = []; // Will be loaded from abi.json

// File hashes
let currentMediaHash = null;
let currentMetadataHash = null;

// Load ABI from file
async function loadABI() {
    try {
        const response = await fetch('./abi.json');
        contractABI = await response.json();
        console.log("ABI loaded successfully");
    } catch (error) {
        console.error("Failed to load ABI:", error);
    }
}

// Global variables
let provider, signer, contract;
let isConnected = false;
const connectionStatus = document.getElementById('connection-status');

// Initialize app
window.addEventListener('load', async () => {
    await loadABI();
    checkIfWalletIsConnected();
    
    // Add event listeners
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
    document.getElementById('generate-hashes').addEventListener('click', generateHashes);
    document.getElementById('submit-proof').addEventListener('click', submitProof);
    document.getElementById('verify-proof').addEventListener('click', verifyProof);
    
    // Check if we have a last submitted hash
    const lastHash = localStorage.getItem('lastSubmittedHash');
    if (lastHash) {
        document.getElementById('verify-hash').value = lastHash;
    }
});

// Check if wallet is connected
async function checkIfWalletIsConnected() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            // Check if already connected
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.log("Not connected yet:", error);
        }
    } else {
        connectionStatus.innerText = "Please install MetaMask to use this application";
    }
}

// Connect wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            
            isConnected = true;
            connectionStatus.innerText = `Connected to ${network.name} with address: ${address}`;
            
            // Check if we're on Sepolia
            if (network.chainId !== 11155111) { // Sepolia chainId
                connectionStatus.innerText += "\nWARNING: You are not connected to Sepolia testnet!";
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            connectionStatus.innerText = "Failed to connect: " + error.message;
        }
    } else {
        alert("Please install MetaMask to use this application");
    }
}

// Read file as array buffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Generate SHA-256 hash from data
async function generateSHA256Hash(data) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Generate hashes for file and metadata
async function generateHashes() {
    try {
        // Get file and generate hash
        const fileInput = document.getElementById('media-file');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileBuffer = await readFileAsArrayBuffer(file);
            currentMediaHash = await generateSHA256Hash(fileBuffer);
            document.getElementById('file-hash-result').innerText = `File Hash: ${currentMediaHash}`;
        }
        
        // Get metadata and generate hash
        const metadataText = document.getElementById('metadata-text').value;
        if (metadataText) {
            const encoder = new TextEncoder();
            const metadataBuffer = encoder.encode(metadataText);
            currentMetadataHash = await generateSHA256Hash(metadataBuffer);
            document.getElementById('metadata-hash-result').innerText = `Metadata Hash: ${currentMetadataHash}`;
        }
    } catch (error) {
        console.error("Error generating hashes:", error);
        alert("Error generating hashes: " + error.message);
    }
}

// Convert string to bytes32
function stringToBytes32(str) {
    // If it already looks like a hex representation of bytes32
    if (str && str.startsWith('0x') && str.length === 66) {
        return str;
    }
    
    // Otherwise hash the string to create a bytes32
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return ethers.utils.id(str);
}

// Submit proof function
async function submitProof() {
    if (!isConnected) {
        alert("Please connect your wallet first");
        return;
    }
    
    if (!currentMediaHash || !currentMetadataHash) {
        alert("Please generate file and metadata hashes first");
        return;
    }
    
    const resultElement = document.getElementById('submit-result');
    resultElement.innerText = "Submitting proof to blockchain...";
    
    try {
        const latitude = parseInt(document.getElementById('latitude').value);
        const longitude = parseInt(document.getElementById('longitude').value);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            throw new Error("Please enter valid latitude and longitude values");
        }
        
        console.log("Submitting:", {
            mediaHash: currentMediaHash, 
            metadataHash: currentMetadataHash, 
            latitude, 
            longitude
        });
        
        const tx = await contract.submitProof(
            currentMediaHash, 
            currentMetadataHash, 
            latitude, 
            longitude
        );
        resultElement.innerText = "Transaction sent! Hash: " + tx.hash;
        
        // Store the hash for easy verification later
        localStorage.setItem('lastSubmittedHash', currentMediaHash);
        document.getElementById('verify-hash').value = currentMediaHash;
        
        // Wait for transaction to be mined
        await tx.wait();
        resultElement.innerText = "Proof successfully submitted to blockchain! Transaction: " + tx.hash + 
            "\n\nWait about 15-30 seconds, then click 'Verify Proof on Blockchain' to confirm it was recorded.";
    } catch (error) {
        console.error("Error submitting proof:", error);
        resultElement.innerText = "Error: " + error.message;
    }
}

// Verify proof function
async function verifyProof() {
    if (!isConnected) {
        alert("Please connect your wallet first");
        return;
    }
    
    const resultElement = document.getElementById('verify-result');
    resultElement.innerText = "Checking blockchain...";
    
    try {
        const mediaHash = document.getElementById('verify-hash').value;
        if (!mediaHash) {
            throw new Error("Please enter a media hash to verify");
        }
        
        // Make sure it's bytes32 format
        const formattedHash = stringToBytes32(mediaHash);
        
        const isVerified = await contract.verifyProof(formattedHash);
        
        if (isVerified) {
            // Get proof details
            const proof = await contract.proofs(formattedHash);
            
            resultElement.innerText = "Proof VERIFIED on blockchain!\n\n" +
                "Media Hash: " + proof.mediaHash + "\n" +
                "Metadata Hash: " + proof.metadataHash + "\n" +
                "Timestamp: " + new Date(proof.timestamp * 1000).toLocaleString() + "\n" +
                "Latitude: " + (proof.lat / 1000000) + "°\n" +
                "Longitude: " + (proof.lng / 1000000) + "°\n" +
                "Submitted by: " + proof.submitter;
        } else {
            resultElement.innerText = "Proof NOT FOUND on blockchain";
        }
    } catch (error) {
        console.error("Error verifying proof:", error);
        resultElement.innerText = "Error: " + error.message;
    }
}