mod common;

use anchor_lang::{
    prelude::Pubkey,
    solana_program::{instruction::Instruction, system_program},
    AccountDeserialize, InstructionData, ToAccountMetas,
};
use common::{duel_pda, now, send, setup, warp_to_timestamp, LAMPORTS_PER_SOL};
use program::state::{Duel, DuelResult, DuelStatus};
use solana_signer::Signer;

const STAKE: u64 = LAMPORTS_PER_SOL / 5; // 0.2 SOL

fn create_duel_ix(
    challenger: &Pubkey,
    duel: &Pubkey,
    duel_id: u64,
    authority: Pubkey,
    opponent: Option<Pubkey>,
    start_time: i64,
    end_time: i64,
) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::CreateDuel {
            duel_id,
            authority,
            stake: STAKE,
            opponent,
            start_time,
            end_time,
        }
        .data(),
        program::accounts::CreateDuel {
            challenger: *challenger,
            duel: *duel,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn accept_duel_ix(acceptor: &Pubkey, duel: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::AcceptDuel {}.data(),
        program::accounts::AcceptDuel {
            acceptor: *acceptor,
            duel: *duel,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn cancel_duel_ix(signer: &Pubkey, challenger: &Pubkey, duel: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::CancelDuel {}.data(),
        program::accounts::CancelDuel {
            signer: *signer,
            challenger: *challenger,
            duel: *duel,
        }
        .to_account_metas(None),
    )
}

fn finalize_duel_ix(authority: &Pubkey, duel: &Pubkey, result: DuelResult) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::FinalizeDuel { result }.data(),
        program::accounts::FinalizeDuel {
            authority: *authority,
            duel: *duel,
        }
        .to_account_metas(None),
    )
}

fn claim_duel_ix(claimant: &Pubkey, duel: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::ClaimDuel {}.data(),
        program::accounts::ClaimDuel {
            claimant: *claimant,
            duel: *duel,
        }
        .to_account_metas(None),
    )
}

fn read_duel(svm: &litesvm::LiteSVM, duel: &Pubkey) -> Duel {
    let acc = svm.get_account(duel).unwrap();
    let mut data: &[u8] = &acc.data;
    Duel::try_deserialize(&mut data).unwrap()
}

#[test]
fn test_finalize_duel_requires_the_stored_authority() {
    let mut svm = setup();
    let backend_authority = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let challenger = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let opponent = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let duel_id = 1u64;
    let (duel, _) = duel_pda(duel_id);
    let base = now(&svm);
    let start_time = base + 100;
    let end_time = base + 200;

    send(
        &mut svm,
        &[create_duel_ix(
            &challenger.pubkey(),
            &duel,
            duel_id,
            backend_authority.pubkey(),
            None,
            start_time,
            end_time,
        )],
        &challenger,
        &[],
    )
    .expect("create_duel should succeed");

    send(&mut svm, &[accept_duel_ix(&opponent.pubkey(), &duel)], &opponent, &[])
        .expect("accept_duel should succeed");

    let d = read_duel(&svm, &duel);
    assert_eq!(d.status, DuelStatus::Active);
    assert_eq!(d.opponent, Some(opponent.pubkey()));

    warp_to_timestamp(&mut svm, end_time + 1);

    // A participant is not the stored authority and must not be able to finalize.
    send(
        &mut svm,
        &[finalize_duel_ix(&challenger.pubkey(), &duel, DuelResult::Draw)],
        &challenger,
        &[],
    )
    .expect_err("finalize_duel must be signed by the duel authority");

    send(
        &mut svm,
        &[finalize_duel_ix(&backend_authority.pubkey(), &duel, DuelResult::Draw)],
        &backend_authority,
        &[],
    )
    .expect("finalize_duel signed by the real authority should succeed");
}

#[test]
fn test_duel_draw_splits_stakes_back() {
    let mut svm = setup();
    let backend_authority = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let challenger = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let opponent = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let duel_id = 2u64;
    let (duel, _) = duel_pda(duel_id);
    let base = now(&svm);
    let start_time = base + 100;
    let end_time = base + 200;

    send(
        &mut svm,
        &[create_duel_ix(
            &challenger.pubkey(),
            &duel,
            duel_id,
            backend_authority.pubkey(),
            Some(opponent.pubkey()),
            start_time,
            end_time,
        )],
        &challenger,
        &[],
    )
    .expect("create_duel should succeed");

    // A wallet other than the invited opponent cannot accept.
    let outsider = common::fund(&mut svm, LAMPORTS_PER_SOL);
    send(&mut svm, &[accept_duel_ix(&outsider.pubkey(), &duel)], &outsider, &[])
        .expect_err("non-invited wallet should not be able to accept a targeted duel");

    send(&mut svm, &[accept_duel_ix(&opponent.pubkey(), &duel)], &opponent, &[])
        .expect("invited opponent should be able to accept");

    warp_to_timestamp(&mut svm, end_time + 1);

    send(
        &mut svm,
        &[finalize_duel_ix(&backend_authority.pubkey(), &duel, DuelResult::Draw)],
        &backend_authority,
        &[],
    )
    .expect("finalize_duel should succeed");

    let challenger_balance_before = svm.get_balance(&challenger.pubkey()).unwrap();
    let opponent_balance_before = svm.get_balance(&opponent.pubkey()).unwrap();

    send(&mut svm, &[claim_duel_ix(&challenger.pubkey(), &duel)], &challenger, &[])
        .expect("challenger should be able to claim their stake back on a draw");
    send(&mut svm, &[claim_duel_ix(&opponent.pubkey(), &duel)], &opponent, &[])
        .expect("opponent should be able to claim their stake back on a draw");

    assert_eq!(
        svm.get_balance(&challenger.pubkey()).unwrap(),
        challenger_balance_before + STAKE - common::TX_FEE_LAMPORTS,
    );
    assert_eq!(
        svm.get_balance(&opponent.pubkey()).unwrap(),
        opponent_balance_before + STAKE - common::TX_FEE_LAMPORTS,
    );

    // Double claim must fail.
    send(&mut svm, &[claim_duel_ix(&challenger.pubkey(), &duel)], &challenger, &[])
        .expect_err("double claim should fail");
}

#[test]
fn test_duel_winner_claims_full_pot_and_loser_cannot() {
    let mut svm = setup();
    let backend_authority = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let challenger = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let opponent = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let duel_id = 3u64;
    let (duel, _) = duel_pda(duel_id);
    let base = now(&svm);
    let start_time = base + 100;
    let end_time = base + 200;

    send(
        &mut svm,
        &[create_duel_ix(
            &challenger.pubkey(),
            &duel,
            duel_id,
            backend_authority.pubkey(),
            None,
            start_time,
            end_time,
        )],
        &challenger,
        &[],
    )
    .expect("create_duel should succeed");

    send(&mut svm, &[accept_duel_ix(&opponent.pubkey(), &duel)], &opponent, &[])
        .expect("accept_duel should succeed");

    warp_to_timestamp(&mut svm, end_time + 1);

    send(
        &mut svm,
        &[finalize_duel_ix(
            &backend_authority.pubkey(),
            &duel,
            DuelResult::Winner(challenger.pubkey()),
        )],
        &backend_authority,
        &[],
    )
    .expect("finalize_duel should succeed");

    let challenger_balance_before = svm.get_balance(&challenger.pubkey()).unwrap();

    send(&mut svm, &[claim_duel_ix(&opponent.pubkey(), &duel)], &opponent, &[])
        .expect_err("loser should not be able to claim anything");

    send(&mut svm, &[claim_duel_ix(&challenger.pubkey(), &duel)], &challenger, &[])
        .expect("winner should be able to claim the full pot");

    assert_eq!(
        svm.get_balance(&challenger.pubkey()).unwrap(),
        challenger_balance_before + STAKE * 2 - common::TX_FEE_LAMPORTS,
    );
}

#[test]
fn test_cancel_duel_before_accept_refunds_challenger() {
    let mut svm = setup();
    let backend_authority = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let challenger = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let duel_id = 4u64;
    let (duel, _) = duel_pda(duel_id);
    let base = now(&svm);

    send(
        &mut svm,
        &[create_duel_ix(
            &challenger.pubkey(),
            &duel,
            duel_id,
            backend_authority.pubkey(),
            None,
            base + 100,
            base + 200,
        )],
        &challenger,
        &[],
    )
    .expect("create_duel should succeed");

    let balance_after_create = svm.get_balance(&challenger.pubkey()).unwrap();

    send(
        &mut svm,
        &[cancel_duel_ix(&challenger.pubkey(), &challenger.pubkey(), &duel)],
        &challenger,
        &[],
    )
    .expect("cancel_duel should succeed");

    assert_eq!(
        svm.get_balance(&challenger.pubkey()).unwrap(),
        balance_after_create + STAKE - common::TX_FEE_LAMPORTS,
    );

    let d = read_duel(&svm, &duel);
    assert_eq!(d.status, DuelStatus::Cancelled);

    // Cannot accept a cancelled duel.
    let opponent = common::fund(&mut svm, LAMPORTS_PER_SOL);
    send(&mut svm, &[accept_duel_ix(&opponent.pubkey(), &duel)], &opponent, &[])
        .expect_err("accepting a cancelled duel should fail");
}
