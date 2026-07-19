use anchor_lang::prelude::*;

use crate::error::ErrorCode;

/// Move `amount` lamports directly between two accounts already loaded in the
/// instruction (no System Program CPI, since `from` is a program-owned PDA and
/// CPI transfers require the source to be owned by the System Program).
/// Only valid when the calling program owns `from`.
pub fn transfer_lamports_from_pda<'info>(
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    **from.try_borrow_mut_lamports()? = from
        .lamports()
        .checked_sub(amount)
        .ok_or(ErrorCode::Overflow)?;
    **to.try_borrow_mut_lamports()? = to
        .lamports()
        .checked_add(amount)
        .ok_or(ErrorCode::Overflow)?;
    Ok(())
}
