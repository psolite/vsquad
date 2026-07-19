use anchor_lang::prelude::*;

#[constant]
pub const TOURNAMENT_SEED: &[u8] = b"tournament";

#[constant]
pub const ENTRY_SEED: &[u8] = b"entry";

#[constant]
pub const DUEL_SEED: &[u8] = b"duel";

/// Cap on `Tournament.payout_table` / `Tournament.final_standings` length so the
/// account has a fixed, known max size for rent calculation.
pub const MAX_PAYOUT_RANKS: usize = 10;

/// Payout shares in `Tournament.payout_table` must sum to exactly this many basis points.
pub const BASIS_POINTS_DIVISOR: u16 = 10_000;
