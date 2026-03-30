import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG",
  }
} as const

export type DataKey = {tag: "Points", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a get_impact transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the total kilograms recycled by a resident.
   */
  get_impact: ({resident}: {resident: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a claim_reward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfers XLM/Tokens to a resident as a reward for their impact.
   */
  claim_reward: ({admin, resident, token_contract, amount}: {admin: string, resident: string, token_contract: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a log_recycling transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Logs recycled weight for a resident. Only an admin/collector should call this.
   */
  log_recycling: ({admin, resident, weight}: {admin: string, resident: string, weight: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAABlBvaW50cwAAAAAAAQAAABM=",
        "AAAAAAAAADNSZXR1cm5zIHRoZSB0b3RhbCBraWxvZ3JhbXMgcmVjeWNsZWQgYnkgYSByZXNpZGVudC4AAAAACmdldF9pbXBhY3QAAAAAAAEAAAAAAAAACHJlc2lkZW50AAAAEwAAAAEAAAAE",
        "AAAAAAAAAEBUcmFuc2ZlcnMgWExNL1Rva2VucyB0byBhIHJlc2lkZW50IGFzIGEgcmV3YXJkIGZvciB0aGVpciBpbXBhY3QuAAAADGNsYWltX3Jld2FyZAAAAAQAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAIcmVzaWRlbnQAAAATAAAAAAAAAA50b2tlbl9jb250cmFjdAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAE5Mb2dzIHJlY3ljbGVkIHdlaWdodCBmb3IgYSByZXNpZGVudC4gT25seSBhbiBhZG1pbi9jb2xsZWN0b3Igc2hvdWxkIGNhbGwgdGhpcy4AAAAAAA1sb2dfcmVjeWNsaW5nAAAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAhyZXNpZGVudAAAABMAAAAAAAAABndlaWdodAAAAAAABAAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_impact: this.txFromJSON<u32>,
        claim_reward: this.txFromJSON<null>,
        log_recycling: this.txFromJSON<null>
  }
}