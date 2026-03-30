#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, token};

#[contract]
pub struct GreenProof;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Points(Address), 
}

const REWARD_MSG: Symbol = symbol_short!("REWARDED");

#[contractimpl]
impl GreenProof {
    
    /// Logs recycled weight for a resident. Only an admin/collector should call this.
    pub fn log_recycling(env: Env, admin: Address, resident: Address, weight: u32) {
        admin.require_auth(); 
        
        let key = DataKey::Points(resident.clone());
        let mut total: u32 = env.storage().persistent().get(&key).unwrap_or(0);
        
        total += weight;
        env.storage().persistent().set(&key, &total);
    }

    /// Returns the total kilograms recycled by a resident.
    pub fn get_impact(env: Env, resident: Address) -> u32 {
        let key = DataKey::Points(resident);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Transfers XLM/Tokens to a resident as a reward for their impact.
    pub fn claim_reward(env: Env, admin: Address, resident: Address, token_contract: Address, amount: i128) {
        admin.require_auth();
        
        let client = token::Client::new(&env, &token_contract);
        client.transfer(&admin, &resident, &amount);
        
        env.events().publish((REWARD_MSG, resident), amount);
    }
}

mod test;