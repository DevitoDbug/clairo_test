// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ClairoProof {
    struct Evidence {
        bytes32 mediaHash;
        bytes32 metadataHash;
        uint256 timestamp;
        int256 lat; // Scaled by 1e6 (40.7128° = 40712800)
        int256 lng;
        address submitter;
    }

    mapping(bytes32 => Evidence) public proofs;

    event EvidenceSubmitted(
        bytes32 indexed mediaHash,
        address submitter,
        uint256 timestamp,
        int256 lat,
        int256 lng
    );

    function submitProof(
        bytes32 _mediaHash,
        bytes32 _metadataHash,
        int256 _lat,
        int256 _lng
    ) external {
        require(proofs[_mediaHash].submitter == address(0), "Proof exists");

        proofs[_mediaHash] = Evidence({
            mediaHash: _mediaHash,
            metadataHash: _metadataHash,
            timestamp: block.timestamp,
            lat: _lat,
            lng: _lng,
            submitter: msg.sender
        });

        emit EvidenceSubmitted(
            _mediaHash,
            msg.sender,
            block.timestamp,
            _lat,
            _lng
        );
    }

    function verifyProof(bytes32 _mediaHash) external view returns (bool) {
        return proofs[_mediaHash].submitter != address(0);
    }
}
