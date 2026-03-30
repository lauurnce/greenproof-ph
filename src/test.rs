#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient;

#[test]
fn test_happy_path_recycling() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(GreenProof, ());
    let client = GreenProofClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let resident = Address::generate(&env);
    
    client.log_recycling(&admin, &resident, &10); // 10kg
    assert_eq!(client.get_impact(&resident), 10);
}

#[test]
fn test_reward_transfer() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(GreenProof, ());
    let client = GreenProofClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let resident = Address::generate(&env);
    
    let token_addr = env.register_stellar_asset_contract(admin.clone());
    let token_admin = StellarAssetClient::new(&env, &token_addr);
    let token_client = TokenClient::new(&env, &token_addr);
    
    token_admin.mint(&admin, &1000);
    client.claim_reward(&admin, &resident, &token_addr, &500);
    
    assert_eq!(token_client.balance(&resident), 500);
}

#[test]
fn test_accumulation() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(GreenProof, ());
    let client = GreenProofClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let resident = Address::generate(&env);
    
    client.log_recycling(&admin, &resident, &5);
    client.log_recycling(&admin, &resident, &5);
    
    assert_eq!(client.get_impact(&resident), 10);
}