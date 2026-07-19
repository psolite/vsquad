use anchor_lang::prelude::*;

use crate::{
    constants::DUEL_SEED,
    error::ErrorCode,
    state::{Duel, DuelResult, DuelStatus},
    util::transfer_lamports_from_pda,
};

#[derive(Accounts)]
pub struct ClaimDuel<'info> {
    #[account(mut)]
    pub claimant: Signer<'info>,
    #[account(
        mut,
        seeds = [DUEL_SEED, duel.duel_id.to_le_bytes().as_ref()],
        bump = duel.bump,
    )]
    pub duel: Account<'info, Duel>,
}

pub fn handle_claim_duel(ctx: Context<ClaimDuel>) -> Result<()> {
    require!(
        ctx.accounts.duel.status == DuelStatus::Finalized,
        ErrorCode::DuelNotFinalized,
    );

    let claimant_key = ctx.accounts.claimant.key();
    let is_challenger = claimant_key == ctx.accounts.duel.challenger;
    let is_opponent = Some(claimant_key) == ctx.accounts.duel.opponent;
    require!(is_challenger || is_opponent, ErrorCode::NotADuelParticipant);

    let already_claimed = if is_challenger {
        ctx.accounts.duel.challenger_claimed
    } else {
        ctx.accounts.duel.opponent_claimed
    };
    require!(!already_claimed, ErrorCode::DuelAlreadyClaimed);

    let stake = ctx.accounts.duel.stake;
    let amount = match ctx.accounts.duel.result {
        Some(DuelResult::Draw) => stake,
        Some(DuelResult::Winner(wallet)) if wallet == claimant_key => {
            stake.checked_mul(2).ok_or(ErrorCode::Overflow)?
        }
        Some(DuelResult::Winner(_)) => return err!(ErrorCode::NothingToClaim),
        None => return err!(ErrorCode::DuelNotFinalized),
    };

    transfer_lamports_from_pda(
        &ctx.accounts.duel.to_account_info(),
        &ctx.accounts.claimant.to_account_info(),
        amount,
    )?;

    if is_challenger {
        ctx.accounts.duel.challenger_claimed = true;
    } else {
        ctx.accounts.duel.opponent_claimed = true;
    }

    Ok(())
}
