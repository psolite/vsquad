use anchor_lang::prelude::*;

use crate::{
    constants::DUEL_SEED,
    error::ErrorCode,
    state::{Duel, DuelStatus},
};

#[derive(Accounts)]
#[instruction(duel_id: u64)]
pub struct CreateDuel<'info> {
    #[account(mut)]
    pub challenger: Signer<'info>,
    #[account(
        init,
        payer = challenger,
        space = 8 + Duel::INIT_SPACE,
        seeds = [DUEL_SEED, duel_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub duel: Account<'info, Duel>,
    pub system_program: Program<'info, System>,
}

pub fn handle_create_duel(
    ctx: Context<CreateDuel>,
    duel_id: u64,
    authority: Pubkey,
    stake: u64,
    opponent: Option<Pubkey>,
    start_time: i64,
    end_time: i64,
) -> Result<()> {
    require!(stake > 0, ErrorCode::InvalidStake);

    let now = Clock::get()?.unix_timestamp;
    require!(start_time > now, ErrorCode::InvalidDuelTimeWindow);
    require!(end_time > start_time, ErrorCode::InvalidDuelTimeWindow);

    if let Some(invited) = opponent {
        require_keys_neq!(
            invited,
            ctx.accounts.challenger.key(),
            ErrorCode::CannotAcceptOwnDuel,
        );
    }

    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.challenger.to_account_info(),
        to: ctx.accounts.duel.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(anchor_lang::system_program::ID, cpi_accounts);
    anchor_lang::system_program::transfer(cpi_ctx, stake)?;

    let duel = &mut ctx.accounts.duel;
    duel.authority = authority;
    duel.duel_id = duel_id;
    duel.stake = stake;
    duel.challenger = ctx.accounts.challenger.key();
    duel.opponent = opponent;
    duel.start_time = start_time;
    duel.end_time = end_time;
    duel.status = DuelStatus::Open;
    duel.result = None;
    duel.challenger_claimed = false;
    duel.opponent_claimed = false;
    duel.bump = ctx.bumps.duel;

    Ok(())
}
