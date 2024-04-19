import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Hw11 } from "../target/types/hw_11";
import { expect } from "chai";

describe("hw_11", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Hw11 as Program<Hw11>;

  let storagePDA;

  it("Is initialized!", async () => {
    [storagePDA] = await anchor.web3.PublicKey.findProgramAddressSync(
      [provider.publicKey.toBuffer()],
      program.programId
    )
    console.log('pda address:', storagePDA);

    const tx = await program.methods
      .initialize()
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Balance is 100", async () => {
    const data = await program.account.storage.fetch(storagePDA);

    // convert BN to decimal
    const value = parseInt(data.balance.toString('hex'), 16);

    expect(value).equal(100, 'Value is not 100')
  })

});
