use anchor_lang::prelude::*;

use crate::{
    constants::TOURNAMENT_SEED,
    error::ErrorCode,
    state::{Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct CancelTournament<'info> {
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [TOURNAMENT_SEED, tournament.tournament_id.to_le_bytes().as_ref()],
        bump = tournament.bump,
        has_one = authority,
    )]
    pub tournament: Account<'info, Tournament>,
}

pub fn handle_cancel_tournament(ctx: Context<CancelTournament>) -> Result<()> {
    let tournament = &mut ctx.accounts.tournament;

    require!(
        tournament.status == TournamentStatus::Open,
        ErrorCode::CannotCancel,
    );

    let now = Clock::get()?.unix_timestamp;
    require!(now < tournament.start_time, ErrorCode::CannotCancel);

    tournament.status = TournamentStatus::Cancelled;
    Ok(())
}
