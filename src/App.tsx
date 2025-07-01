
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import AirDrop from './AirDrop';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
function App() {

  return (
     <ConnectionProvider endpoint={"https://api.devnet.solana.com/"}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    <div className='flex justify-between '> 
                      <WalletMultiButton></WalletMultiButton>
                      <WalletDisconnectButton></WalletDisconnectButton>
                    </div>
                    <div className='flex justify-center items-center '>
                        <AirDrop></AirDrop>
                    </div>
                   
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
  ) 
}

export default App
