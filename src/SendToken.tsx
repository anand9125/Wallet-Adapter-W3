import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useState } from 'react'

function SendToken() {
    const wallet = useWallet() //useWallet hoot provideds the wallet variable inside the airdrp cpomponent
    const {connection} = useConnection()

    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState(0);
   
    const handleAddressChange = (event:any) => {
        setAddress(event.target.value);
    };
  const handleAmountChange = (event: any) => {
    setAmount(parseFloat(event.target.value));
};


 async function sendToken(){
    if(wallet.publicKey){
        if (!address || !amount || isNaN(amount)) {
            alert("Please enter a valid address and amount");
            return;
        }
        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(address),
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );
            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');
            alert(`Transaction confirmed! Signature: ${signature}`);
        } catch (err) {
            console.error(err);
            alert('Transaction failed: ' + err.message);
        }
    }
}

    return (
    <div className='flex items-center justify-center min-h-screen flex-col'>
 <div className='flex flex-col items-center justify-center rounded-md bg-slate-400  p-8 rounded-2xl shadow-lg w-full max-w-sm'>
    <div className='pb-4 text-2xl font-bold text-center'>
        Send solana token
    </div>
        <div className=''>
           
    
            <div className='pb-2'>
                <input type="text" placeholder='To Address' onChange={handleAddressChange} className='rounded-sm border-2 border-slate-200 bg-slate-200 max-w-lg' />
            </div>
           <div className='pt-2'>
                <input type="text" placeholder='Amount' onChange={handleAmountChange} className='rounded-sm border-2 border-slate-200 bg-slate-200 max-w-lg '  />
            </div>
         </div>
         <div className='pt-4'>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-md w-full m' onClick={sendToken}> send Token</button>
         </div>
       </div>
    </div>
  )
}

export default SendToken