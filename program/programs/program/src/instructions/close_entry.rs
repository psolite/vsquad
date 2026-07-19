use anchor_lang::prelude::*;

use crate::{constants::ENTRY_SEED, error::ErrorCode, state::Entry};

#[derive(Accounts)]
pub struct CloseEntry<'info> {
    #[account(mut)]
    pub wallet: Signer<'info>,
    #[account(
        mut,
        seeds = [ENTRY_SEED, entry.tournament.as_ref(), wallet.key().as_ref()],
        bump = entry.bump,
        has_one = wallet,
        close = wallet,
    )]
    pub entry: Account<'info, Entry>,
}

pub fn handle_close_entry(ctx: Context<CloseEntry>) -> Result<()> {
    require!(ctx.accounts.entry.claimed, ErrorCode::EntryNotClaimed);
    Ok(())
}
