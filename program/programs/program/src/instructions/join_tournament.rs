use anchor_lang::prelude::*;

use crate::{
    constants::{ENTRY_SEED, TOURNAMENT_SEED},
    error::ErrorCode,
    state::{Entry, Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct JoinTournament<'info> {
    #[account(mut)]
    pub participant: Signer<'info>,
    #[account(
        mut,
        seeds = [TOURNAMENT_SEED, tournament.tournament_id.to_le_bytes().as_ref()],
        bump = tournament.bump,
    )]
    pub tournament: Account<'info, Tournament>,
    #[account(
        init,
        payer = participant,
        space = 8 + Entry::INIT_SPACE,
        seeds = [ENTRY_SEED, tournament.key().as_ref(), participant.key().as_ref()],
        bump,
    )]
    pub entry: Account<'info, Entry>,
    pub system_program: Program<'info, System>,
}

pub fn handle_join_tournament(ctx: Context<JoinTournament>) -> Result<()> {
    require!(
        ctx.accounts.tournament.status == TournamentStatus::Open,
        ErrorCode::InvalidTournamentStatus,
    );

    let now = Clock::get()?.unix_timestamp;
    require!(
        now < ctx.accounts.tournament.start_time,
        ErrorCode::JoiningClosed,
    );

    require!(
        ctx.accounts.tournament.participant_count < ctx.accounts.tournament.max_participants,
        ErrorCode::TournamentFull,
    );

    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.participant.to_account_info(),
        to: ctx.accounts.tournament.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(anchor_lang::system_program::ID, cpi_accounts);
    anchor_lang::system_program::transfer(cpi_ctx, ctx.accounts.tournament.entry_fee)?;

    let entry = &mut ctx.accounts.entry;
    entry.tournament = ctx.accounts.tournament.key();
    entry.wallet = ctx.accounts.participant.key();
    entry.joined_at = now;
    entry.claimed = false;
    entry.bump = ctx.bumps.entry;

    ctx.accounts.tournament.participant_count = ctx
        .accounts
        .tournament
        .participant_count
        .checked_add(1)
        .ok_or(ErrorCode::Overflow)?;

    Ok(())
}
