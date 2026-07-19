pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod util;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("68REyCi6dsft3Su1CDsz3M34GVrNh6Cbh7oTJknLF3x7");

#[program]
pub mod program_module {
    use super::*;

    // ----- tournament -----

    pub fn initialize_tournament(
        ctx: Context<InitializeTournament>,
        tournament_id: u64,
        entry_fee: u64,
        max_participants: u16,
        start_time: i64,
        end_time: i64,
        payout_table: Vec<PayoutShare>,
    ) -> Result<()> {
        instructions::initialize_tournament::handle_initialize_tournament(
            ctx,
            tournament_id,
            entry_fee,
            max_participants,
            start_time,
            end_time,
            payout_table,
        )
    }

    pub fn join_tournament(ctx: Context<JoinTournament>) -> Result<()> {
        instructions::join_tournament::handle_join_tournament(ctx)
    }

    pub fn lock_tournament(ctx: Context<LockTournament>) -> Result<()> {
        instructions::lock_tournament::handle_lock_tournament(ctx)
    }

    pub fn cancel_tournament(ctx: Context<CancelTournament>) -> Result<()> {
        instructions::cancel_tournament::handle_cancel_tournament(ctx)
    }

    pub fn finalize_tournament<'info>(
        ctx: Context<'info, FinalizeTournament<'info>>,
        final_standings: Vec<Standing>,
    ) -> Result<()> {
        instructions::finalize_tournament::handle_finalize_tournament(ctx, final_standings)
    }

    pub fn claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
        instructions::claim_prize::handle_claim_prize(ctx)
    }

    pub fn claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
        instructions::claim_refund::handle_claim_refund(ctx)
    }

    pub fn close_entry(ctx: Context<CloseEntry>) -> Result<()> {
        instructions::close_entry::handle_close_entry(ctx)
    }

    // ----- duel -----

    pub fn create_duel(
        ctx: Context<CreateDuel>,
        duel_id: u64,
        authority: Pubkey,
        stake: u64,
        opponent: Option<Pubkey>,
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        instructions::create_duel::handle_create_duel(
            ctx, duel_id, authority, stake, opponent, start_time, end_time,
        )
    }

    pub fn accept_duel(ctx: Context<AcceptDuel>) -> Result<()> {
        instructions::accept_duel::handle_accept_duel(ctx)
    }

    pub fn cancel_duel(ctx: Context<CancelDuel>) -> Result<()> {
        instructions::cancel_duel::handle_cancel_duel(ctx)
    }

    pub fn finalize_duel(ctx: Context<FinalizeDuel>, result: DuelResult) -> Result<()> {
        instructions::finalize_duel::handle_finalize_duel(ctx, result)
    }

    pub fn claim_duel(ctx: Context<ClaimDuel>) -> Result<()> {
        instructions::claim_duel::handle_claim_duel(ctx)
    }
}
