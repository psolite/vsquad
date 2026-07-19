use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    // ----- shared / arithmetic -----
    #[msg("Arithmetic overflow or underflow")]
    Overflow,
    #[msg("Only the authority may perform this action")]
    Unauthorized,

    // ----- tournament: initialize -----
    #[msg("Entry fee must be greater than zero")]
    InvalidEntryFee,
    #[msg("max_participants must be greater than zero")]
    InvalidMaxParticipants,
    #[msg("start_time must be in the future and end_time must be after start_time")]
    InvalidTimeWindow,
    #[msg("Payout table cannot be empty and cannot exceed MAX_PAYOUT_RANKS")]
    InvalidPayoutTableLength,
    #[msg("Payout shares must sum to exactly 10,000 basis points")]
    InvalidPayoutTotal,
    #[msg("Payout table contains a duplicate or non-sequential rank")]
    InvalidPayoutRanks,

    // ----- tournament: join / lock -----
    #[msg("Tournament is not in the expected status for this action")]
    InvalidTournamentStatus,
    #[msg("Tournament has reached max_participants")]
    TournamentFull,
    #[msg("Joining is closed: start_time has passed")]
    JoiningClosed,

    // ----- tournament: cancel -----
    #[msg("Tournament can only be cancelled while still Open")]
    CannotCancel,

    // ----- tournament: finalize -----
    #[msg("finalize_tournament can only be called at or after end_time")]
    TooEarlyToFinalize,
    #[msg("final_standings cannot be empty and cannot exceed the payout table length")]
    InvalidStandingsLength,
    #[msg("final_standings contains a wallet with no matching Entry")]
    StandingWalletNotEntered,
    #[msg("final_standings contains the same wallet more than once")]
    DuplicateStandingWallet,
    #[msg("final_standings contains the same rank more than once")]
    DuplicateStandingRank,
    #[msg("A rank in final_standings has no corresponding payout_table entry")]
    RankNotInPayoutTable,

    // ----- tournament: claim -----
    #[msg("Tournament has not been finalized yet")]
    NotFinalized,
    #[msg("Tournament has not been cancelled")]
    NotCancelled,
    #[msg("Caller's wallet does not appear in final_standings")]
    NotAWinner,
    #[msg("This entry has already been claimed")]
    AlreadyClaimed,
    #[msg("Entry must be claimed before it can be closed")]
    EntryNotClaimed,
    #[msg("Entry does not belong to the given tournament and wallet")]
    EntryMismatch,

    // ----- duel: create / accept -----
    #[msg("Stake must be greater than zero")]
    InvalidStake,
    #[msg("start_time must be in the future and end_time must be after start_time")]
    InvalidDuelTimeWindow,
    #[msg("Duel is not in the expected status for this action")]
    InvalidDuelStatus,
    #[msg("Joining is closed: start_time has passed")]
    DuelJoiningClosed,
    #[msg("Only the invited opponent may accept this duel")]
    NotInvitedOpponent,
    #[msg("The challenger cannot accept their own duel")]
    CannotAcceptOwnDuel,

    // ----- duel: cancel / finalize / claim -----
    #[msg("Duel can only be cancelled while still Open")]
    CannotCancelDuel,
    #[msg("finalize_duel can only be called at or after end_time")]
    TooEarlyToFinalizeDuel,
    #[msg("Winner must be either the challenger or the opponent")]
    InvalidDuelWinner,
    #[msg("Duel has not been finalized yet")]
    DuelNotFinalized,
    #[msg("Caller did not win this duel")]
    NothingToClaim,
    #[msg("Caller has already claimed")]
    DuelAlreadyClaimed,
    #[msg("Caller is not a participant in this duel")]
    NotADuelParticipant,
}
