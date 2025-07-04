import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

import { LAMPORTS_PER_SOL } from "@solana/web3.js";


function AirDrop() {
  const[balance, setBalance] = useState(0)
  const wallet = useWallet() //useWallet hoot provideds the wallet variable inside the airdrp cpomponent
  //because i wrapped the airdrop component inside the walletprovider
    
  const {connection} = useConnection()

async function sendAirDropTouser(){
    if(wallet.publicKey){
        //@ts-ignore
        const amount = document.getElementById('amount').value 
        alert(wallet.publicKey)
     await connection.requestAirdrop(wallet.publicKey, amount*1000000000)
     alert ('AirDrop Successfully')
    }
  }
  useEffect(() => {
    if (wallet.publicKey) {
       async function getBalance(pub:any){
         const balance = await connection.getBalance(pub)
         setBalance(balance)
       }
      getBalance(wallet.publicKey)
      // setConnected(true)
    } else {
      console.log('wallet not connected')
      // setConnected(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.publicKey])
 

  return (
     <div className='flex justify-center items-center flex-col' >
        {/* <input id="amount" type="text" placeholder='Amount' />
        <button className=' pl-3' onClick={sendAirDropTouser}> send AirDrop</button> */}
        <div className='text-center font-bold text-4xl'>
          Solana Airdrop
          
        </div>
        <div className='flex justify-center pt-5 gap-2'>
                 <span className=''>Currect Balance :</span>
                 <span>{balance/ LAMPORTS_PER_SOL} sol</span>
        </div>
       <div className='flex items-center justify-center min-h-screen '>
          <div className='flex flex-col items-center justify-center rounded-md bg-slate-400  p-8 rounded-2xl shadow-lg w-full max-w-md'>
            <div className='pb-4 text-2xl font-bold text-center'>
               Request Airdrop
            </div>
            <div>
                <input id="amount" type="text" placeholder='Amount' className='border-2 rounded-md bg-slate-200 max-w-lg' />
                 <span className='pl-4'>Amount</span>
            </div>
            <div className='pt-4'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-md w-full m' onClick={sendAirDropTouser}> send AirDrop</button>
                <span></span>
            </div>
            
        </div>
       </div>
       
     </div>
  )
}

export default AirDrop