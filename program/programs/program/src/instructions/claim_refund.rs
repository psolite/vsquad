use anchor_lang::prelude::*;

use crate::{
    constants::{ENTRY_SEED, TOURNAMENT_SEED},
    error::ErrorCode,
    state::{Entry, Tournament, TournamentStatus},
    util::transfer_lamports_from_pda,
};

#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    #[account(mut)]
    pub participant: Signer<'info>,
    #[account(
        mut,
        seeds = [TOURNAMENT_SEED, tournament.tournament_id.to_le_bytes().as_ref()],
        bump = tournament.bump,
    )]
    pub tournament: Account<'info, Tournament>,
    #[account(
        mut,
        seeds = [ENTRY_SEED, tournament.key().as_ref(), participant.key().as_ref()],
        bump = entry.bump,
        constraint = entry.tournament == tournament.key() && entry.wallet == participant.key()
            @ ErrorCode::EntryMismatch,
    )]
    pub entry: Account<'info, Entry>,
}

pub fn handle_claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
    require!(
        ctx.accounts.tournament.status == TournamentStatus::Cancelled,
        ErrorCode::NotCancelled,
    );
    require!(!ctx.accounts.entry.claimed, ErrorCode::AlreadyClaimed);

    let refund = ctx.accounts.tournament.entry_fee;
    let tournament_info = ctx.accounts.tournament.to_account_info();
    let rent_exempt_minimum = Rent::get()?.minimum_balance(tournament_info.data_len());
    require!(
        tournament_info
            .lamports()
            .checked_sub(refund)
            .ok_or(ErrorCode::Overflow)?
            >= rent_exempt_minimum,
        ErrorCode::Overflow,
    );

    transfer_lamports_from_pda(
        &tournament_info,
        &ctx.accounts.participant.to_account_info(),
        refund,
    )?;

    ctx.accounts.entry.claimed = true;
    Ok(())
}
