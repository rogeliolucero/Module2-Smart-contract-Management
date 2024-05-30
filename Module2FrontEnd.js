This Project front end program demonstrate the basic functionality of the solidity progrmming language.
the purpose of this project is to point out the functionality of the solidity and how it works in the transaction .
Description
this program serves as a intermediate of the Solidity programming, that 
 can be used as a stepping stone for our future transaction projects in the future.

Getting Started
Executing program
To run this program, you can use Gitpod, that you will again upload your code to Github and share a video walk-through as explained below.

You can run the code locally, or you can use GitPod here:https://www.gitpod.io/

Here is my code  in module 2 Project in Front end.



import { useState, useEffect } from "react";
import { ethers } from "ethers";
import rcash_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [rcash, setrCash] = useState(undefined);
  const [balance, setBalance] = useState(ethers.BigNumber.from(0)); 
  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [withdrawValue, setWithdrawValue] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [notification, setNotification] = useState(null);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const rcashABI = rcash_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      myAccount(account);
    }
  };

  const myAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    myAccount(accounts);

    
    getrcashContract();
  };

  const getrcashContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const rcashContract = new ethers.Contract(contractAddress, rcashABI, signer);

    setrCash(rcashContract);
  };

  const getBalance = async () => {
    if (rcash) {
      const balance = await rcash.getBalance();
      setBalance(balance); 
    }
  };

  const deposit = async () => {
    if (rcash) {
      let tx = await rcash.deposit(ethers.utils.parseEther(depositValue));
      await tx.wait();
      getBalance();
      setNotification("Deposit successful!");
    }
  };

  const withdraw = async () => {
    if (rcash) {
      let tx = await rcash.withdraw(ethers.utils.parseEther(withdrawValue));
      await tx.wait();
      getBalance();
      setNotification("Withdrawal successful!");
    }
  };

  const verifyPin = () => {
    if (pin === "1234") {
      setPinVerified(true);
      setNotification("Welcome, " + account + "!");
    } else {
      alert("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handlePinChange = (event) => {
    setPin(event.target.value);
  };

  const handleWithdrawValueChange = (event) => {
    setWithdrawValue(event.target.value);
  };

  const handleDepositValueChange = (event) => {
    setDepositValue(event.target.value);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const Notification = ({ message }) => (
    <div className="notification">
      <span>{message}</span>
      <button onClick={closeNotification}>X</button>
      <style jsx>{`
        .notification {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #4caf50;
          color: white;
          padding: 15px 30px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
          animation: fadein 0.5s, fadeout 0.5s 6s;
        }
        @keyframes fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeout {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </div>
  );

  const initUser = () => {
    
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this RCash.</p>;
    }

    
    if (!account) {
      return <button onClick={connectAccount}>Click Here To Continue</button>;
    }

    if (!pinVerified) {
      return (
        <div>
          <p>Please enter PIN to continue:</p>
          <input type="password" value={pin} onChange={handlePinChange} />
          <button onClick={verifyPin}>Submit</button>
        </div>
      );
    }

    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 7000); 
    }

    if (balance.isZero()) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {ethers.utils.formatEther(balance)}</p> {/* Convert BigNumber to ether and format */}
        {notification && <Notification message={notification} />}
        <input
          type="number"
          value={depositValue}
          onChange={handleDepositValueChange}
          placeholder="Enter amount to deposit"
        />
        <button onClick={deposit}>Deposit</button>
        <input
          type="number"
          value={withdrawValue}
          onChange={handleWithdrawValueChange}
          placeholder="Enter amount to withdraw"
        />
        <button onClick={withdraw}>Withdraw</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the RCash !</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}



Author NTC

Rogelio A Lucero Jr.

8215129@ntc.edu.ph