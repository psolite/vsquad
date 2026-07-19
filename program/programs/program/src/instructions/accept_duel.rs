use anchor_lang::prelude::*;

use crate::{
    constants::DUEL_SEED,
    error::ErrorCode,
    state::{Duel, DuelStatus},
};

#[derive(Accounts)]
pub struct AcceptDuel<'info> {
    #[account(mut)]
    pub acceptor: Signer<'info>,
    #[account(
        mut,
        seeds = [DUEL_SEED, duel.duel_id.to_le_bytes().as_ref()],
        bump = duel.bump,
    )]
    pub duel: Account<'info, Duel>,
    pub system_program: Program<'info, System>,
}

pub fn handle_accept_duel(ctx: Context<AcceptDuel>) -> Result<()> {
    require!(
        ctx.accounts.duel.status == DuelStatus::Open,
        ErrorCode::InvalidDuelStatus,
    );

    let now = Clock::get()?.unix_timestamp;
    require!(now < ctx.accounts.duel.start_time, ErrorCode::DuelJoiningClosed);

    let acceptor_key = ctx.accounts.acceptor.key();
    require_keys_neq!(
        acceptor_key,
        ctx.accounts.duel.challenger,
        ErrorCode::CannotAcceptOwnDuel,
    );

    match ctx.accounts.duel.opponent {
        Some(invited) => require_keys_eq!(acceptor_key, invited, ErrorCode::NotInvitedOpponent),
        None => ctx.accounts.duel.opponent = Some(acceptor_key),
    }

    let stake = ctx.accounts.duel.stake;
    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.acceptor.to_account_info(),
        to: ctx.accounts.duel.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(anchor_lang::system_program::ID, cpi_accounts);
    anchor_lang::system_program::transfer(cpi_ctx, stake)?;

    ctx.accounts.duel.status = DuelStatus::Active;
    Ok(())
}
