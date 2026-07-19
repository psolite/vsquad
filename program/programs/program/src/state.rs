use anchor_lang::prelude::*;

use crate::constants::MAX_PAYOUT_RANKS;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub enum TournamentStatus {
    /// Accepting joins.
    Open,
    /// `start_time` passed, joining closed, awaiting results.
    Locked,
    /// `final_standings` set, claims open.
    Finalized,
    /// Creator/authority cancelled before start — refunds open instead of prize claims.
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub struct PayoutShare {
    /// 1 = first place, 2 = second, ...
    pub rank: u8,
    /// e.g. 5000 = 50.00%. All shares in a payout table must sum to 10_000.
    pub basis_points: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub struct Standing {
    pub wallet: Pubkey,
    pub rank: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Tournament {
    /// Creator / backend signer allowed to finalize + cancel.
    pub authority: Pubkey,
    /// Matches the `tournament` PDA seed.
    pub tournament_id: u64,
    /// Lamports, fixed at creation.
    pub entry_fee: u64,
    pub max_participants: u16,
    pub participant_count: u16,
    /// Unix seconds — joining closes here.
    pub start_time: i64,
    /// Unix seconds — `finalize_tournament` allowed after this.
    pub end_time: i64,
    pub status: TournamentStatus,
    /// Pool size snapshotted at `finalize_tournament`, so later claims split a fixed
    /// amount instead of the live (draining) vault balance.
    pub final_pool_lamports: u64,
    pub vault_bump: u8,
    pub bump: u8,
    #[max_len(MAX_PAYOUT_RANKS)]
    pub payout_table: Vec<PayoutShare>,
    #[max_len(MAX_PAYOUT_RANKS)]
    pub final_standings: Vec<Standing>,
}

#[account]
#[derive(InitSpace)]
pub struct Entry {
    pub tournament: Pubkey,
    pub wallet: Pubkey,
    pub joined_at: i64,
    pub claimed: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub enum DuelStatus {
    /// Created, awaiting an acceptor.
    Open,
    /// Accepted, both stakes locked, awaiting the scoring window to end.
    Active,
    /// Result set, claims open.
    Finalized,
    /// Challenger cancelled before anyone accepted — full refund to challenger only.
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq, Eq, InitSpace)]
pub enum DuelResult {
    Winner(Pubkey),
    Draw,
}

#[account]
#[derive(InitSpace)]
pub struct Duel {
    /// Backend signer allowed to finalize + cancel, same role as `Tournament.authority`.
    pub authority: Pubkey,
    /// Matches the `duel` PDA seed.
    pub duel_id: u64,
    /// Lamports each side puts in — always equal on both sides.
    pub stake: u64,
    pub challenger: Pubkey,
    /// `Some(wallet)` = targeted challenge, only that wallet can accept.
    /// `None` = open, first acceptor wins the slot.
    pub opponent: Option<Pubkey>,
    /// Scoring window begins.
    pub start_time: i64,
    /// Scoring window ends — finalize allowed after this.
    pub end_time: i64,
    pub status: DuelStatus,
    pub result: Option<DuelResult>,
    pub challenger_claimed: bool,
    pub opponent_claimed: bool,
    pub bump: u8,
}
