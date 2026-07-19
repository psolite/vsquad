use anchor_lang::prelude::*;

use crate::{
    constants::DUEL_SEED,
    error::ErrorCode,
    state::{Duel, DuelResult, DuelStatus},
};

#[derive(Accounts)]
pub struct FinalizeDuel<'info> {
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [DUEL_SEED, duel.duel_id.to_le_bytes().as_ref()],
        bump = duel.bump,
        has_one = authority,
    )]
    pub duel: Account<'info, Duel>,
}

pub fn handle_finalize_duel(ctx: Context<FinalizeDuel>, result: DuelResult) -> Result<()> {
    require!(
        ctx.accounts.duel.status == DuelStatus::Active,
        ErrorCode::InvalidDuelStatus,
    );

    let now = Clock::get()?.unix_timestamp;
    require!(now >= ctx.accounts.duel.end_time, ErrorCode::TooEarlyToFinalizeDuel);

    if let DuelResult::Winner(wallet) = result {
        let opponent = ctx.accounts.duel.opponent.ok_or(ErrorCode::InvalidDuelWinner)?;
        require!(
            wallet == ctx.accounts.duel.challenger || wallet == opponent,
            ErrorCode::InvalidDuelWinner,
        );
    }

    let duel = &mut ctx.accounts.duel;
    duel.result = Some(result);
    duel.status = DuelStatus::Finalized;
    Ok(())
}
