use anchor_lang::prelude::*;

declare_id!("3BYYSuHYbkLJ9ZL6tBTPtXB24hZn3drbByfq1TaTjqAY");

#[program]
pub mod hw_11 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        storage.balance = 100;

        msg!("Storage balance is initialized at {}", storage.balance);

        Ok(())
    }

    pub fn update(ctx: Context<Update>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        storage.balance += 100;

        msg!("Upadate the storage balance to {}", storage.balance);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [signer.key().as_ref()],
        bump,
        payer = signer,
        space = 8 + 8)]
    pub storage: Account<'info, Storage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, constraint = storage.balance < 1000)]
    pub storage: Account<'info, Storage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Storage {
    balance: u64,
}
