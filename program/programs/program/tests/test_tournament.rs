mod common;

use anchor_lang::{
    prelude::Pubkey,
    solana_program::{instruction::AccountMeta, instruction::Instruction, system_program},
    AccountDeserialize, InstructionData, ToAccountMetas,
};
use common::{entry_pda, now, send, setup, tournament_pda, warp_to_timestamp, LAMPORTS_PER_SOL};
use program::state::{Entry, PayoutShare, Standing, Tournament, TournamentStatus};
use solana_signer::Signer;

const ENTRY_FEE: u64 = LAMPORTS_PER_SOL / 10; // 0.1 SOL

fn initialize_ix(
    authority: &Pubkey,
    tournament: &Pubkey,
    tournament_id: u64,
    max_participants: u16,
    start_time: i64,
    end_time: i64,
    payout_table: Vec<PayoutShare>,
) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::InitializeTournament {
            tournament_id,
            entry_fee: ENTRY_FEE,
            max_participants,
            start_time,
            end_time,
            payout_table,
        }
        .data(),
        program::accounts::InitializeTournament {
            authority: *authority,
            tournament: *tournament,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn join_ix(participant: &Pubkey, tournament: &Pubkey, entry: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::JoinTournament {}.data(),
        program::accounts::JoinTournament {
            participant: *participant,
            tournament: *tournament,
            entry: *entry,
            system_program: system_program::ID,
        }
        .to_account_metas(None),
    )
}

fn finalize_ix(
    authority: &Pubkey,
    tournament: &Pubkey,
    final_standings: Vec<Standing>,
    entries: &[Pubkey],
) -> Instruction {
    let mut metas = program::accounts::FinalizeTournament {
        authority: *authority,
        tournament: *tournament,
    }
    .to_account_metas(None);
    for entry in entries {
        metas.push(AccountMeta::new_readonly(*entry, false));
    }
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::FinalizeTournament { final_standings }.data(),
        metas,
    )
}

fn claim_prize_ix(winner: &Pubkey, tournament: &Pubkey, entry: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::ClaimPrize {}.data(),
        program::accounts::ClaimPrize {
            winner: *winner,
            tournament: *tournament,
            entry: *entry,
        }
        .to_account_metas(None),
    )
}

fn claim_refund_ix(participant: &Pubkey, tournament: &Pubkey, entry: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::ClaimRefund {}.data(),
        program::accounts::ClaimRefund {
            participant: *participant,
            tournament: *tournament,
            entry: *entry,
        }
        .to_account_metas(None),
    )
}

fn cancel_ix(authority: &Pubkey, tournament: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::CancelTournament {}.data(),
        program::accounts::CancelTournament {
            authority: *authority,
            tournament: *tournament,
        }
        .to_account_metas(None),
    )
}

fn close_entry_ix(wallet: &Pubkey, entry: &Pubkey) -> Instruction {
    Instruction::new_with_bytes(
        program::id(),
        &program::instruction::CloseEntry {}.data(),
        program::accounts::CloseEntry {
            wallet: *wallet,
            entry: *entry,
        }
        .to_account_metas(None),
    )
}

fn read_tournament(svm: &litesvm::LiteSVM, tournament: &Pubkey) -> Tournament {
    let acc = svm.get_account(tournament).unwrap();
    let mut data: &[u8] = &acc.data;
    Tournament::try_deserialize(&mut data).unwrap()
}

fn read_entry(svm: &litesvm::LiteSVM, entry: &Pubkey) -> Entry {
    let acc = svm.get_account(entry).unwrap();
    let mut data: &[u8] = &acc.data;
    Entry::try_deserialize(&mut data).unwrap()
}

#[test]
fn test_full_tournament_lifecycle_and_payouts() {
    let mut svm = setup();
    let authority = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let tournament_id = 1u64;
    let (tournament, _) = tournament_pda(tournament_id);

    let base = now(&svm);
    let start_time = base + 100;
    let end_time = base + 200;

    let payout_table = vec![
        PayoutShare { rank: 1, basis_points: 6000 },
        PayoutShare { rank: 2, basis_points: 4000 },
    ];

    send(
        &mut svm,
        &[initialize_ix(
            &authority.pubkey(),
            &tournament,
            tournament_id,
            3,
            start_time,
            end_time,
            payout_table,
        )],
        &authority,
        &[],
    )
    .expect("initialize_tournament should succeed");

    let p1 = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let p2 = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let p3 = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let p4 = common::fund(&mut svm, LAMPORTS_PER_SOL);

    let (entry1, _) = entry_pda(&tournament, &p1.pubkey());
    let (entry2, _) = entry_pda(&tournament, &p2.pubkey());
    let (entry3, _) = entry_pda(&tournament, &p3.pubkey());
    let (entry4, _) = entry_pda(&tournament, &p4.pubkey());

    for (p, entry) in [(&p1, entry1), (&p2, entry2), (&p3, entry3)] {
        send(&mut svm, &[join_ix(&p.pubkey(), &tournament, &entry)], p, &[])
            .expect("join_tournament should succeed");
    }

    // Tournament is full (max_participants = 3) — a 4th join must fail.
    send(&mut svm, &[join_ix(&p4.pubkey(), &tournament, &entry4)], &p4, &[])
        .expect_err("joining a full tournament should fail");

    let t = read_tournament(&svm, &tournament);
    assert_eq!(t.participant_count, 3);
    assert_eq!(t.status, TournamentStatus::Open);

    // Finalizing before end_time must fail.
    warp_to_timestamp(&mut svm, start_time + 1);
    send(
        &mut svm,
        &[finalize_ix(
            &authority.pubkey(),
            &tournament,
            vec![
                Standing { wallet: p1.pubkey(), rank: 1 },
                Standing { wallet: p2.pubkey(), rank: 2 },
            ],
            &[entry1, entry2],
        )],
        &authority,
        &[],
    )
    .expect_err("finalizing before end_time should fail");

    warp_to_timestamp(&mut svm, end_time + 1);

    send(
        &mut svm,
        &[finalize_ix(
            &authority.pubkey(),
            &tournament,
            vec![
                Standing { wallet: p1.pubkey(), rank: 1 },
                Standing { wallet: p2.pubkey(), rank: 2 },
            ],
            &[entry1, entry2],
        )],
        &authority,
        &[],
    )
    .expect("finalize_tournament should succeed");

    let t = read_tournament(&svm, &tournament);
    assert_eq!(t.status, TournamentStatus::Finalized);
    assert_eq!(t.final_pool_lamports, ENTRY_FEE * 3);

    let p1_balance_before = svm.get_balance(&p1.pubkey()).unwrap();
    let p2_balance_before = svm.get_balance(&p2.pubkey()).unwrap();

    send(&mut svm, &[claim_prize_ix(&p1.pubkey(), &tournament, &entry1)], &p1, &[])
        .expect("winner rank 1 should be able to claim");
    send(&mut svm, &[claim_prize_ix(&p2.pubkey(), &tournament, &entry2)], &p2, &[])
        .expect("winner rank 2 should be able to claim");

    let pool = ENTRY_FEE * 3;
    assert_eq!(
        svm.get_balance(&p1.pubkey()).unwrap(),
        p1_balance_before + pool * 6000 / 10_000 - common::TX_FEE_LAMPORTS,
    );
    assert_eq!(
        svm.get_balance(&p2.pubkey()).unwrap(),
        p2_balance_before + pool * 4000 / 10_000 - common::TX_FEE_LAMPORTS,
    );

    // Non-winner cannot claim.
    send(&mut svm, &[claim_prize_ix(&p3.pubkey(), &tournament, &entry3)], &p3, &[])
        .expect_err("non-winner should not be able to claim a prize");

    // Double-claim must fail.
    send(&mut svm, &[claim_prize_ix(&p1.pubkey(), &tournament, &entry1)], &p1, &[])
        .expect_err("double claim should fail");

    // Claimed entries can be closed; unclaimed ones cannot.
    send(&mut svm, &[close_entry_ix(&p1.pubkey(), &entry1)], &p1, &[])
        .expect("closing a claimed entry should succeed");
    assert!(svm.get_account(&entry1).is_none());

    send(&mut svm, &[close_entry_ix(&p3.pubkey(), &entry3)], &p3, &[])
        .expect_err("closing an unclaimed entry should fail");
}

#[test]
fn test_invalid_payout_table_is_rejected() {
    let mut svm = setup();
    let authority = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let tournament_id = 2u64;
    let (tournament, _) = tournament_pda(tournament_id);
    let base = now(&svm);

    // Basis points don't sum to 10_000.
    let bad_payout_table = vec![PayoutShare { rank: 1, basis_points: 5000 }];
    send(
        &mut svm,
        &[initialize_ix(
            &authority.pubkey(),
            &tournament,
            tournament_id,
            10,
            base + 100,
            base + 200,
            bad_payout_table,
        )],
        &authority,
        &[],
    )
    .expect_err("payout table not summing to 10_000 bps should be rejected");
}

#[test]
fn test_cancel_and_refund_flow() {
    let mut svm = setup();
    let authority = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let tournament_id = 3u64;
    let (tournament, _) = tournament_pda(tournament_id);
    let base = now(&svm);

    let payout_table = vec![PayoutShare { rank: 1, basis_points: 10_000 }];
    send(
        &mut svm,
        &[initialize_ix(
            &authority.pubkey(),
            &tournament,
            tournament_id,
            5,
            base + 100,
            base + 200,
            payout_table,
        )],
        &authority,
        &[],
    )
    .expect("initialize_tournament should succeed");

    let p1 = common::fund(&mut svm, LAMPORTS_PER_SOL);
    let (entry1, _) = entry_pda(&tournament, &p1.pubkey());
    send(&mut svm, &[join_ix(&p1.pubkey(), &tournament, &entry1)], &p1, &[])
        .expect("join_tournament should succeed");

    let balance_after_join = svm.get_balance(&p1.pubkey()).unwrap();

    send(&mut svm, &[cancel_ix(&authority.pubkey(), &tournament)], &authority, &[])
        .expect("cancel_tournament should succeed");

    let t = read_tournament(&svm, &tournament);
    assert_eq!(t.status, TournamentStatus::Cancelled);

    // Prize claims are not valid on a cancelled tournament.
    send(&mut svm, &[claim_prize_ix(&p1.pubkey(), &tournament, &entry1)], &p1, &[])
        .expect_err("claim_prize should fail on a cancelled tournament");

    send(&mut svm, &[claim_refund_ix(&p1.pubkey(), &tournament, &entry1)], &p1, &[])
        .expect("claim_refund should succeed");

    assert_eq!(
        svm.get_balance(&p1.pubkey()).unwrap(),
        // p1 paid the fee for both the rejected claim_prize attempt and the
        // successful claim_refund — a transaction is charged as soon as it's
        // included, regardless of whether program execution then fails.
        balance_after_join + ENTRY_FEE - 2 * common::TX_FEE_LAMPORTS,
    );

    let entry = read_entry(&svm, &entry1);
    assert!(entry.claimed);

    // Double refund must fail.
    send(&mut svm, &[claim_refund_ix(&p1.pubkey(), &tournament, &entry1)], &p1, &[])
        .expect_err("double refund should fail");
}
