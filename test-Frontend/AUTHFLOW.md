## Authentication and Data Flow

The following sequence diagram illustrates the data flow for authentication and verification process in the dApp, showing both authenticated and anonymous paths.

```mermaid
sequenceDiagram
    participant User
    participant Camera
    participant Frontend
    participant MetaMask
    participant Backend
    participant Blockchain
    participant S3
    participant Mapbox

    alt Authenticated Upload
        User->>Frontend: Access Application
        Frontend->>User: Request Wallet Connection
        User->>MetaMask: Approve Connection
        MetaMask->>Frontend: Return Wallet Address
        User->>Camera: Capture Media (Camera Only)
        Camera->>Frontend: Return Media Data
        Frontend->>Frontend: Generate Media Hash
        Frontend->>Frontend: Capture Metadata (GPS, Time)
        Frontend->>MetaMask: Request Transaction Signature
        MetaMask->>Blockchain: Submit Signed Proof
        Blockchain->>Frontend: Return Transaction Receipt
        Frontend->>Backend: Send Media + Metadata + TxHash
        Backend->>S3: Store Media File
        Backend->>Backend: Store Metadata + Wallet Address
        Frontend->>Frontend: Update UI with Success
    else Anonymous Upload
        User->>Frontend: Choose Anonymous Mode
        User->>Camera: Capture Media (Camera Only)
        Camera->>Frontend: Return Media Data
        Frontend->>Frontend: Generate Media Hash
        Frontend->>Frontend: Capture Metadata (GPS, Time)
        Frontend->>Backend: Send Media + Metadata (No Wallet)
        Backend->>Blockchain: Submit Unsigned Proof (Backend Key)
        Backend->>S3: Store Media File
        Backend->>Backend: Store Metadata (Anonymous)
        Frontend->>Frontend: Update UI with Success
    end

    Frontend->>Blockchain: Verify Proof Exists
    Blockchain->>Frontend: Return Verification Status
    Frontend->>Mapbox: Update Map with Verified Data
```

### Notes:
- **Authentication**: Handled through MetaMask wallet connection - no JWT required
- **Session Persistence**: MetaMask connection remains active until disconnected
- **Camera Restriction**: Media can only be captured directly from device camera
- **Anonymous Mode**: Users can submit without connecting a wallet
- **Verification**: All content is verified on-chain regardless of authentication status
- **Wallet as Identity**: The connected wallet address serves as the user identifier