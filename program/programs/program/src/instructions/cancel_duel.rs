use anchor_lang::prelude::*;

use crate::{
    constants::DUEL_SEED,
    error::ErrorCode,
    state::{Duel, DuelStatus},
    util::transfer_lamports_from_pda,
};

#[derive(Accounts)]
pub struct CancelDuel<'info> {
    pub signer: Signer<'info>,
    #[account(mut, address = duel.challenger)]
    /// CHECK: verified against `duel.challenger` via the `address` constraint above.
    pub challenger: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [DUEL_SEED, duel.duel_id.to_le_bytes().as_ref()],
        bump = duel.bump,
    )]
    pub duel: Account<'info, Duel>,
}

pub fn handle_cancel_duel(ctx: Context<CancelDuel>) -> Result<()> {
    require!(
        ctx.accounts.duel.status == DuelStatus::Open,
        ErrorCode::CannotCancelDuel,
    );

    let signer_key = ctx.accounts.signer.key();
    require!(
        signer_key == ctx.accounts.duel.challenger || signer_key == ctx.accounts.duel.authority,
        ErrorCode::Unauthorized,
    );

    let stake = ctx.accounts.duel.stake;
    transfer_lamports_from_pda(
        &ctx.accounts.duel.to_account_info(),
        &ctx.accounts.challenger.to_account_info(),
        stake,
    )?;

    ctx.accounts.duel.status = DuelStatus::Cancelled;
    Ok(())
}
