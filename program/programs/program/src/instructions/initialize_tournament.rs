use anchor_lang::prelude::*;

use crate::{
    constants::{BASIS_POINTS_DIVISOR, MAX_PAYOUT_RANKS, TOURNAMENT_SEED},
    error::ErrorCode,
    state::{PayoutShare, Tournament, TournamentStatus},
};

#[derive(Accounts)]
#[instruction(tournament_id: u64)]
pub struct InitializeTournament<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Tournament::INIT_SPACE,
        seeds = [TOURNAMENT_SEED, tournament_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub tournament: Account<'info, Tournament>,
    pub system_program: Program<'info, System>,
}

pub fn handle_initialize_tournament(
    ctx: Context<InitializeTournament>,
    tournament_id: u64,
    entry_fee: u64,
    max_participants: u16,
    start_time: i64,
    end_time: i64,
    payout_table: Vec<PayoutShare>,
) -> Result<()> {
    require!(entry_fee > 0, ErrorCode::InvalidEntryFee);
    require!(max_participants > 0, ErrorCode::InvalidMaxParticipants);

    let now = Clock::get()?.unix_timestamp;
    require!(start_time > now, ErrorCode::InvalidTimeWindow);
    require!(end_time > start_time, ErrorCode::InvalidTimeWindow);

    require!(
        !payout_table.is_empty() && payout_table.len() <= MAX_PAYOUT_RANKS,
        ErrorCode::InvalidPayoutTableLength,
    );

    let mut seen_ranks = Vec::with_capacity(payout_table.len());
    let mut total_bps: u32 = 0;
    for share in payout_table.iter() {
        require!(share.rank >= 1, ErrorCode::InvalidPayoutRanks);
        require!(
            !seen_ranks.contains(&share.rank),
            ErrorCode::InvalidPayoutRanks,
        );
        seen_ranks.push(share.rank);
        total_bps = total_bps
            .checked_add(share.basis_points as u32)
            .ok_or(ErrorCode::Overflow)?;
    }
    require!(
        total_bps == BASIS_POINTS_DIVISOR as u32,
        ErrorCode::InvalidPayoutTotal,
    );

    let tournament = &mut ctx.accounts.tournament;
    tournament.authority = ctx.accounts.authority.key();
    tournament.tournament_id = tournament_id;
    tournament.entry_fee = entry_fee;
    tournament.max_participants = max_participants;
    tournament.participant_count = 0;
    tournament.start_time = start_time;
    tournament.end_time = end_time;
    tournament.status = TournamentStatus::Open;
    tournament.final_pool_lamports = 0;
    tournament.vault_bump = ctx.bumps.tournament;
    tournament.bump = ctx.bumps.tournament;
    tournament.payout_table = payout_table;
    tournament.final_standings = Vec::new();

    Ok(())
}
