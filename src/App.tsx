import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import AirDrop from './AirDrop';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import SendToken from "./SendToken";
import { TokenLaunchpad } from "./TokenLaunchPad";

function App() {

  return (
     <ConnectionProvider endpoint={"https://api.devnet.solana.com/"}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                       <Router> 
                    <div className='flex justify-between '> 
                      <WalletMultiButton></WalletMultiButton>
                      <WalletDisconnectButton></WalletDisconnectButton>
                    </div>
                     <Routes>
    
                          <Route path="/" element={<AirDrop/>}></Route>
                         <Route path= "/sendTransacttokenLaunchPadion" element={<SendToken/>}></Route>
                         <Route path= "/tokenLaunchPad" element={<TokenLaunchpad/>}></Route>
                     </Routes>
                 </Router>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
  ) 
}

export default App
