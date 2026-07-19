#![allow(dead_code)]

use anchor_lang::{
    prelude::{Clock, Pubkey},
    solana_program::instruction::Instruction,
};
use litesvm::LiteSVM;
use solana_keypair::Keypair;
use solana_message::{Message, VersionedMessage};
use solana_signer::Signer;
use solana_transaction::versioned::VersionedTransaction;

pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

/// Solana's default per-signature fee (litesvm's `FeeStructure::default()`), deducted
/// from the fee payer of any transaction that includes their signature.
pub const TX_FEE_LAMPORTS: u64 = 5000;

pub fn setup() -> LiteSVM {
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!(concat!(
        env!("CARGO_TARGET_TMPDIR"),
        "/../deploy/program.so"
    ));
    svm.add_program(program::id(), bytes).unwrap();
    svm
}

pub fn fund(svm: &mut LiteSVM, lamports: u64) -> Keypair {
    let kp = Keypair::new();
    svm.airdrop(&kp.pubkey(), lamports).unwrap();
    kp
}

/// Sends a transaction with `payer` as fee payer, signed by every keypair in
/// `signers` that's actually a required signer on the instruction (dedup'd).
pub fn send(
    svm: &mut LiteSVM,
    ixs: &[Instruction],
    payer: &Keypair,
    extra_signers: &[&Keypair],
) -> Result<(), String> {
    // Every call gets a fresh blockhash so that back-to-back sends of what would
    // otherwise be byte-identical transactions (e.g. retrying after an expected
    // failure) don't collide on signature and get rejected as AlreadyProcessed.
    svm.expire_blockhash();
    let blockhash = svm.latest_blockhash();
    let msg = Message::new_with_blockhash(ixs, Some(&payer.pubkey()), &blockhash);

    let mut signers: Vec<&Keypair> = vec![payer];
    for s in extra_signers {
        if s.pubkey() != payer.pubkey() && !signers.iter().any(|k| k.pubkey() == s.pubkey()) {
            signers.push(s);
        }
    }

    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &signers)
        .map_err(|e| format!("{e:?}"))?;
    svm.send_transaction(tx).map(|_| ()).map_err(|e| format!("{e:?}"))
}

pub fn now(svm: &LiteSVM) -> i64 {
    let clock: Clock = svm.get_sysvar();
    clock.unix_timestamp
}

pub fn warp_to_timestamp(svm: &mut LiteSVM, unix_timestamp: i64) {
    let mut clock: Clock = svm.get_sysvar();
    clock.unix_timestamp = unix_timestamp;
    svm.set_sysvar(&clock);
}

pub fn tournament_pda(tournament_id: u64) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            program::constants::TOURNAMENT_SEED,
            tournament_id.to_le_bytes().as_ref(),
        ],
        &program::id(),
    )
}

pub fn entry_pda(tournament: &Pubkey, wallet: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            program::constants::ENTRY_SEED,
            tournament.as_ref(),
            wallet.as_ref(),
        ],
        &program::id(),
    )
}

pub fn duel_pda(duel_id: u64) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[program::constants::DUEL_SEED, duel_id.to_le_bytes().as_ref()],
        &program::id(),
    )
}
