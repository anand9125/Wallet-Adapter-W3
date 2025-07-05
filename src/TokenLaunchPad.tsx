// import { Transaction, SystemProgram, Keypair, getMinimumBalanceForRentExemptMint, createInitializeMint2Instruction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { getMinimumBalanceForRentExemptMint, MINT_SIZE, createInitializeMint2Instruction, TOKEN_PROGRAM_ID, getMintLen, ExtensionType, TYPE_SIZE, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, createInitializeMetadataPointerInstruction, getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
//https://www.shutterstock.com/image-vector/bright-yellow-hand-drawn-suns-260nw-642473326.jpg
export function TokenLaunchpad() {
     const[ name , setName] = useState("");
     const[ symbol , setSymbol] = useState("");
     const[ imageUrl , setImageUrl] = useState(""); 
     const[ initialSupply , setInitialSupply] = useState(0);
         const { connection } = useConnection();
    const wallet = useWallet();
async function createToken() {


    if (!wallet.publicKey || !wallet.signTransaction) {
        console.error("Wallet not connected or cannot sign.");
        return;
    }

    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("URI:", imageUrl);
    console.log("Initial Supply:", initialSupply);

    // 0️⃣ Mint keypair
    const mintKeypair = Keypair.generate();
    console.log("Mint Pubkey:", mintKeypair.publicKey.toBase58());

    // Metadata struct for calculating rent
    const metadata = {
        updateAuthority: wallet.publicKey,
        mint: mintKeypair.publicKey,
        name,
        symbol,
        uri: imageUrl,
        additionalMetadata: []
    };

    // Calculate space needed
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const totalSpace = mintLen + metadataLen;

    const lamports = await connection.getMinimumBalanceForRentExemption(totalSpace);
    console.log("Mint+Metadata Space:", totalSpace, "bytes");
    console.log("Rent-exempt lamports:", lamports, "≈", lamports / LAMPORTS_PER_SOL, "SOL");

    // -----------------------------------
    // 1️⃣ Create mint account + initialize + write metadata
    // -----------------------------------
    const transaction1 = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: totalSpace,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
            mintKeypair.publicKey,
            wallet.publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMint2Instruction(
            mintKeypair.publicKey,
            9,
            wallet.publicKey,
            wallet.publicKey,
            TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: mintKeypair.publicKey,
            metadata: mintKeypair.publicKey,
            name,
            symbol,
            uri: imageUrl,
            mintAuthority: wallet.publicKey,
            updateAuthority: wallet.publicKey,
        })
    );

    transaction1.feePayer = wallet.publicKey;
    transaction1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction1.partialSign(mintKeypair);

    console.log("Sending transaction to create mint...");
    const signedTx1 = await wallet.signTransaction(transaction1);
    const txid1 = await connection.sendRawTransaction(signedTx1.serialize());
    await connection.confirmTransaction(txid1, "confirmed");
    console.log("✅ Mint created. Tx:", txid1);

    // -----------------------------------
    // 2️⃣ Create associated token account (ATA)
    // -----------------------------------
    const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
    );
    console.log("Associated Token Address:", associatedToken.toBase58());

    const transaction2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedToken,
            wallet.publicKey,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID
        )
    );

    transaction2.feePayer = wallet.publicKey;
    transaction2.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    console.log("Creating ATA...");
    const signedTx2 = await wallet.signTransaction(transaction2);
    const txid2 = await connection.sendRawTransaction(signedTx2.serialize());
    await connection.confirmTransaction(txid2, "confirmed");
    console.log("✅ ATA created. Tx:", txid2);

    // -----------------------------------
    // 3️⃣ Mint initial supply to the ATA
    // -----------------------------------
    const transaction3 = new Transaction().add(
        createMintToInstruction(
            mintKeypair.publicKey,
            associatedToken,
            wallet.publicKey,
            initialSupply * 1_000_000_000, // assumes decimals = 9
            [],
            TOKEN_2022_PROGRAM_ID
        )
    );

    transaction3.feePayer = wallet.publicKey;
    transaction3.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    console.log("Minting initial supply...");
    const signedTx3 = await wallet.signTransaction(transaction3);
    const txid3 = await connection.sendRawTransaction(signedTx3.serialize());
    await connection.confirmTransaction(txid3, "confirmed");
    console.log("✅ Tokens minted. Tx:", txid3);

    console.log("🎉 All done! Mint:", mintKeypair.publicKey.toBase58());
}


    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    🚀 Solana Token Launchpad
                </h1>
                
                <div className="space-y-4">
                    <input
                      
                        className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        type="text"
                        placeholder="Name"
                        onChange={(e)=>setName(e.target.value)}
                    />
                    <input
                    id="symbol"
                        className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        type="text"
                        placeholder="Symbol"
                        onChange={(e)=>setSymbol(e.target.value)}
                    />
                    <input
                        id="imageUrl"
                        className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        type="text"
                        placeholder="Image URL"
                        onChange={(e)=>setImageUrl(e.target.value)}
                    />
                    <input
                        id="initialSupply"
                        className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        type="text"
                        placeholder="Initial Supply"
                        onChange={(e:any)=>setInitialSupply(e.target.value)}
                    />
                </div>

                <button
                    className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 active:scale-95" onClick={createToken}
                >
                    Create a Token
                </button>
            </div>
        </div>
    );
}
