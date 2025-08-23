// Very small CW20-like token skeleton for demo. For a full token use the canonical cw20 repo.
use cosmwasm_std::{entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg { pub name: String, pub symbol: String, pub decimals: u8 }

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ExecuteMsg { Mint { recipient: String, amount: u128 } }

#[entry_point]
pub fn instantiate(_deps: DepsMut, _env: Env, _info: MessageInfo, _msg: InstantiateMsg) -> StdResult<Response> {
    Ok(Response::default())
}

#[entry_point]
pub fn execute(_deps: DepsMut, _env: Env, _info: MessageInfo, _msg: ExecuteMsg) -> StdResult<Response> {
    match _msg {
        ExecuteMsg::Mint { recipient, amount } => {
            let log = vec![("action", "mint"), ("to", recipient.as_str()), ("amount", &amount.to_string())];
            Ok(Response::new().add_attributes(log))
        }
    }
}
use cosmwasm_std::{entry_point, DepsMut, Env, MessageInfo, Response, StdResult};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct InstantiateMsg { pub name: String, pub symbol: String }

#[entry_point]
pub fn instantiate(_deps: DepsMut, _env: Env, _info: MessageInfo, _msg: InstantiateMsg) -> StdResult<Response> {
    Ok(Response::default())
}

// For an actual CW721 implement mint/transfer/query according to the standard. This is a placeholder for hackathon.

