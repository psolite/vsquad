use anchor_lang::prelude::*;

use crate::{
    constants::TOURNAMENT_SEED,
    error::ErrorCode,
    state::{Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct LockTournament<'info> {
    pub caller: Signer<'info>,
    #[account(
        mut,
        seeds = [TOURNAMENT_SEED, tournament.tournament_id.to_le_bytes().as_ref()],
        bump = tournament.bump,
    )]
    pub tournament: Account<'info, Tournament>,
}

pub fn handle_lock_tournament(ctx: Context<LockTournament>) -> Result<()> {
    let tournament = &mut ctx.accounts.tournament;

    require!(
        tournament.status == TournamentStatus::Open,
        ErrorCode::InvalidTournamentStatus,
    );

    let now = Clock::get()?.unix_timestamp;
    if now < tournament.start_time {
        require_keys_eq!(
            ctx.accounts.caller.key(),
            tournament.authority,
            ErrorCode::Unauthorized,
        );
    }

    tournament.status = TournamentStatus::Locked;
    Ok(())
}
