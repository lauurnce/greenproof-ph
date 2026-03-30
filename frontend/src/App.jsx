import { useState } from 'react';
import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { Client } from './greenproof-client';

const contractClient = new Client({
  networkPassphrase: "Test SDF Network ; September 2015",
  rpcUrl: "https://soroban-testnet.stellar.org:443",
});

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [impactPoints, setImpactPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [residentKey, setResidentKey] = useState('');
  const [weight, setWeight] = useState('');

  const CONTRACT_ID = "CCX4HEFCB4SJFG463AN2AC6C66MPKXRESVAI6YPHFNH4S63QRW476BLG";

    const connectWallet = async () => {
    try {
      // 1. Ask Freighter for permission
      const response = await requestAccess();
      
      // 2. Extract the string safely (handles both older and newer Freighter versions)
      const finalAddress = typeof response === 'string' ? response : response.address;
      
      if (finalAddress) {
        setWalletAddress(finalAddress);
        // 3. Optional: Fetch points if you have that function ready
        // fetchImpactPoints(finalAddress); 
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const fetchImpactPoints = async (address) => {
    try {
      const { result } = await contractClient.get_impact({ resident: address });
      setImpactPoints(Number(result) || 0);
    } catch (error) {
      console.log("No points found yet or error:", error);
    }
  };

  // Add this state variable at the top with your others if you don't have it:
// const [isSubmitting, setIsSubmitting] = useState(false);

const handleLogRecycling = async (e) => {
    e.preventDefault(); // CRITICAL: Stops the page from refreshing when you click submit!

    if (!walletAddress) {
      alert("Please connect your Freighter wallet first.");
      return;
    }

    try {
      // 1. Make the UI responsive (using your existing 'loading' state)
      setLoading(true);

      // 2. Call the contract
      // CRITICAL: We wrap the weight in Number() so Rust accepts the integer!
      await contractClient.log_recycling({
        admin: walletAddress,   // The connected wallet is the admin
        resident: residentKey,  // The address from the text box
        weight: Number(weight)  // Converts your string state to an integer
      });

      // 3. Success Feedback
      alert("Success! Plastic logged on-chain.");
      
      // Optional: Clear the boxes after success
      // setResidentKey('');
      // setWeight('');

    } catch (error) {
      console.error("Transaction Error:", error);
      alert("Transaction failed! Check the F12 console for exact details.");
    } finally {
      // 4. Reset the UI
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen p-8 font-sans text-gray-800 bg-green-50">
      <nav className="flex justify-between items-center mb-12 bg-white p-4 rounded-2xl shadow-sm border border-green-100">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          ♻️ GreenProof PH
        </h1>
        <button 
          onClick={connectWallet}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition-all"
        >
          {walletAddress ? `${walletAddress?.substring(0, 6)}...${walletAddress.slice(-4)}` : "Connect Freighter"}
        </button>
      </nav>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-green-50">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Resident Dashboard</h2>
          
          <div className="bg-green-50 rounded-2xl p-6 text-center mb-6">
            <p className="text-sm text-green-600 font-semibold mb-1">Total Impact Points</p>
            <p className="text-5xl font-black text-green-700">{impactPoints} <span className="text-2xl">kg</span></p>
            <p className="text-xs text-gray-500 mt-2">Verified on Stellar Testnet</p>
          </div>

          <button 
            disabled={true}
            className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all"
          >
            Claim XLM Reward (Coming Soon)
          </button>
          {!walletAddress && <p className="text-center text-xs text-red-500 mt-3">Connect wallet to view impact</p>}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-green-50">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Collection Center (Admin)</h2>
          
          <form onSubmit={handleLogRecycling} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resident Public Key</label>
              <input 
                type="text" 
                value={residentKey}
                onChange={(e) => setResidentKey(e.target.value)}
                placeholder="G..." 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight Surrendered (kg)</label>
              <input 
                type="number" 
                min="1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 5" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button 
              type="submit"
              disabled={!walletAddress || loading}
              className="w-full bg-green-600 disabled:bg-gray-300 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all mt-4"
            >
              {loading ? "Awaiting Signature..." : "Log Plastic On-Chain"}
            </button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 break-all">
              <strong>Active Contract:</strong> <br/>
              {CONTRACT_ID}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;