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

  it("Initial balance is 100", async () => {
    const data = await program.account.storage.fetch(storagePDA);

    // Convert BN to decimal
    const value = parseInt(data.balance.toString('hex'), 16);

    expect(value).equal(100, 'Value is not 100')
  })

  it('Using the update function to increase the balance by 100 each time', async () => {
    const tx = await program.methods
      .update()
      .accounts({
        storage: storagePDA
      })
      .rpc();

    const data = await program.account.storage.fetch(storagePDA);

    const value = parseInt(data.balance.toString('hex'), 16);

    expect(value).equal(200, 'Value is not 100')
  })

  it('If the balance exceeds 1000, the update function cannot be used', async () => {
    const maxBalance = 1000;

    // Execute eight transactions successfully
    for (let i = 0; i < 8; i++) {
      const tx = await program.methods
        .update()
        .accounts({ storage: storagePDA })
        .rpc();
    }

    // The 9th exexcution should be false
    try {
      await program.methods
        .update()
        .accounts({ storage: storagePDA })
        .rpc()
      expect.fail('Expected transaction to fail');
    } catch (err) {
      // console.log('error: ', err.message);
    }

    // Confirm the final balance once more
    const data = await program.account.storage.fetch(storagePDA);
    const value = parseInt(data.balance.toString('hex'), 16);
    expect(value).equal(maxBalance);
  })

});
