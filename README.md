# GreenProof PH

## Overview
Residents in Manila face friction in waste management. GreenProof PH provides a transparent on-chain ledger to track recycling impact, where residents earn XLM rewards for every kilogram of plastic segregated and surrendered to local collection points.

## Stellar Features
- **Soroban Smart Contracts:** Tracks resident "Impact Points."
- **XLM Transfers:** Direct incentive payouts.

## Instructions
- **Build:** `cargo build --target wasm32-unknown-unknown --release`
- **Test:** `cargo test`
- **Deploy:** `stellar contract deploy --wasm target/wasm32-unknown-unknown/release/greenproof_ph.wasm --source my-key --network testnet`

## Live Deployment
- **Network:** Stellar Testnet
- **Contract ID:** `CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG`
- **Explorer Link:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG)