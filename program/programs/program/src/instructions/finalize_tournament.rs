use anchor_lang::prelude::*;

use crate::{
    constants::{ENTRY_SEED, TOURNAMENT_SEED},
    error::ErrorCode,
    state::{Entry, Standing, Tournament, TournamentStatus},
};

#[derive(Accounts)]
pub struct FinalizeTournament<'info> {
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [TOURNAMENT_SEED, tournament.tournament_id.to_le_bytes().as_ref()],
        bump = tournament.bump,
        has_one = authority,
    )]
    pub tournament: Account<'info, Tournament>,
    // One `Entry` account per `Standing` in `final_standings`, in the same order,
    // proving each ranked wallet actually joined this tournament.
}

pub fn handle_finalize_tournament<'info>(
    ctx: Context<'info, FinalizeTournament<'info>>,
    final_standings: Vec<Standing>,
) -> Result<()> {
    let tournament = &ctx.accounts.tournament;

    require!(
        tournament.status == TournamentStatus::Open
            || tournament.status == TournamentStatus::Locked,
        ErrorCode::InvalidTournamentStatus,
    );

    let now = Clock::get()?.unix_timestamp;
    require!(now >= tournament.end_time, ErrorCode::TooEarlyToFinalize);

    require!(
        !final_standings.is_empty() && final_standings.len() <= tournament.payout_table.len(),
        ErrorCode::InvalidStandingsLength,
    );
    require!(
        final_standings.len() == ctx.remaining_accounts.len(),
        ErrorCode::InvalidStandingsLength,
    );

    let mut seen_wallets = Vec::with_capacity(final_standings.len());
    let mut seen_ranks = Vec::with_capacity(final_standings.len());
    for (standing, entry_info) in final_standings.iter().zip(ctx.remaining_accounts.iter()) {
        require!(
            !seen_wallets.contains(&standing.wallet),
            ErrorCode::DuplicateStandingWallet,
        );
        seen_wallets.push(standing.wallet);

        require!(
            !seen_ranks.contains(&standing.rank),
            ErrorCode::DuplicateStandingRank,
        );
        seen_ranks.push(standing.rank);

        require!(
            tournament
                .payout_table
                .iter()
                .any(|share| share.rank == standing.rank),
            ErrorCode::RankNotInPayoutTable,
        );

        let (expected_entry, _) = Pubkey::find_program_address(
            &[
                ENTRY_SEED,
                tournament.key().as_ref(),
                standing.wallet.as_ref(),
            ],
            ctx.program_id,
        );
        require_keys_eq!(
            entry_info.key(),
            expected_entry,
            ErrorCode::StandingWalletNotEntered,
        );
        require_keys_eq!(*entry_info.owner, *ctx.program_id, ErrorCode::StandingWalletNotEntered);

        let data = entry_info.try_borrow_data()?;
        let mut data_slice: &[u8] = &data;
        let entry = Entry::try_deserialize(&mut data_slice)
            .map_err(|_| error!(ErrorCode::StandingWalletNotEntered))?;
        require_keys_eq!(entry.tournament, tournament.key(), ErrorCode::StandingWalletNotEntered);
        require_keys_eq!(entry.wallet, standing.wallet, ErrorCode::StandingWalletNotEntered);
    }

    let final_pool_lamports = tournament
        .entry_fee
        .checked_mul(tournament.participant_count as u64)
        .ok_or(ErrorCode::Overflow)?;

    let tournament = &mut ctx.accounts.tournament;
    tournament.final_standings = final_standings;
    tournament.final_pool_lamports = final_pool_lamports;
    tournament.status = TournamentStatus::Finalized;

    Ok(())
}
