use anchor_lang::prelude::*;

use crate::{
    constants::{BASIS_POINTS_DIVISOR, ENTRY_SEED, TOURNAMENT_SEED},
    error::ErrorCode,
    state::{Entry, Tournament, TournamentStatus},
    util::transfer_lamports_from_pda,
};

#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    #[account(mut)]
    pub winner: Signer<'info>,
    #[account(
        mut,
        seeds = [TOURNAMENT_SEED, tournament.tournament_id.to_le_bytes().as_ref()],
        bump = tournament.bump,
    )]
    pub tournament: Account<'info, Tournament>,
    #[account(
        mut,
        seeds = [ENTRY_SEED, tournament.key().as_ref(), winner.key().as_ref()],
        bump = entry.bump,
        constraint = entry.tournament == tournament.key() && entry.wallet == winner.key()
            @ ErrorCode::EntryMismatch,
    )]
    pub entry: Account<'info, Entry>,
}

pub fn handle_claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
    require!(
        ctx.accounts.tournament.status == TournamentStatus::Finalized,
        ErrorCode::NotFinalized,
    );
    require!(!ctx.accounts.entry.claimed, ErrorCode::AlreadyClaimed);

    let winner_key = ctx.accounts.winner.key();
    let rank = ctx
        .accounts
        .tournament
        .final_standings
        .iter()
        .find(|s| s.wallet == winner_key)
        .map(|s| s.rank)
        .ok_or(ErrorCode::NotAWinner)?;

    let basis_points = ctx
        .accounts
        .tournament
        .payout_table
        .iter()
        .find(|share| share.rank == rank)
        .map(|share| share.basis_points)
        .ok_or(ErrorCode::RankNotInPayoutTable)?;

    let share = ctx
        .accounts
        .tournament
        .final_pool_lamports
        .checked_mul(basis_points as u64)
        .ok_or(ErrorCode::Overflow)?
        .checked_div(BASIS_POINTS_DIVISOR as u64)
        .ok_or(ErrorCode::Overflow)?;

    let tournament_info = ctx.accounts.tournament.to_account_info();
    let rent_exempt_minimum = Rent::get()?.minimum_balance(tournament_info.data_len());
    require!(
        tournament_info
            .lamports()
            .checked_sub(share)
            .ok_or(ErrorCode::Overflow)?
            >= rent_exempt_minimum,
        ErrorCode::Overflow,
    );

    transfer_lamports_from_pda(&tournament_info, &ctx.accounts.winner.to_account_info(), share)?;

    ctx.accounts.entry.claimed = true;
    Ok(())
}
