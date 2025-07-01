import { useConnection, useWallet } from '@solana/wallet-adapter-react'



function AirDrop() {

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
 

  return (
     <div className='mt-11 '>
        <input id="amount" type="text" placeholder='Amount' />
        <button className=' pl-3' onClick={sendAirDropTouser}> send AirDrop</button>
     </div>
  )
}

export default AirDrop