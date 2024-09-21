'use client';

import {useEffect, useState} from 'react';
import {
	type ConnectOptions,
  type DisconnectOptions,
  connect,
  disconnect,
} from 'get-starknet';

import { Contract, CairoCustomEnum } from 'starknet/dist/index.js';

import contractAbi from '../../abi/moon_or_doom.json';
const contractAddress = "0x04cfe4fbea86ab273e75f6e0fdaca06de1c3a8495dd3d5a65afa4822339306ef";

interface DemoComponentProps {
}

const DemoComponentStarknetJS: React.FC<DemoComponentProps> = (props) => {

	const [walletName, setWalletName] = useState("");
	const [account, setAccount] = useState();
  const [address, setAddress] = useState<string>();
	const [roundInfo, setRoundInfo] = useState();

  function handleConnect(options?: ConnectOptions) {
    return async () => {
      const connection = await connect(options)
			setAccount(connection?.account);
      setAddress(connection?.selectedAddress);
      console.log(connection);
      setWalletName(connection?.name || "")
    }
  }

  function handleDisconnect(options?: DisconnectOptions) {
    return async () => {
      await disconnect(options)
      setWalletName("")
			setAccount(undefined);
			setAddress('');
    }
  }


  async function handleStartRound() {
		if (account) {
			try {
				// await contract.connect(account);
				const contract = new Contract(contractAbi, contractAddress, account);
				console.log('####: contract: ', contract);
				await contract.start_round(100000);
			} catch (err) {
				console.log('####: err: ', err);
			}
		}
	}

	async function handleGetRoundInfo() {
		try {
			const contract = new Contract(contractAbi, contractAddress, account);
			const round_info = await contract.get_round_info();
			console.log('####: round_info: ', round_info);
			// setRoundInfo(round_info);
		} catch (err) {
			console.log('####: err: ', err);
		}
	}

	async function handleEndRound() {
		if (account) {
			try {
				// await contract.connect(account);
				const contract = new Contract(contractAbi, contractAddress, account);
				console.log('####: contract: ', contract);
				await contract.end_round(100000);
			} catch (err) {
				console.log('####: err: ', err);
			}
		}
	}

	async function handleBet() {
		if (account) {
			try {
				const contract = new Contract(contractAbi, contractAddress, account);
				await contract.bet(new CairoCustomEnum({DEFAULT: 0}));
			} catch (err) {
				console.log('####: err: ', err);
			}
		}
	}

	async function handleGetBetInfo() {
		try {
			const contract = new Contract(contractAbi, contractAddress, account);
			await contract.get_bet_info(account, 1);
		} catch (err) {
			console.log('####: err: ', err);
		}
	}

	return (
		<>
			<p><b>Wallet name: </b>{walletName}</p>
			<p><b>Address: </b>{address}</p>
			<div>
				<button onClick={handleConnect()} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">Connect</button>
				<button onClick={handleDisconnect({ clearLastWallet: true })} className="inline-block px-4 py-2 bg-red-500 text-white rounded">
					Disconnect
				</button>
			</div>

			<h2>Contract actions and state:</h2>
			<div>
				<button onClick={handleStartRound} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">Start Round</button>
				<button onClick={handleEndRound} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">End Round</button>
				<button onClick={handleBet} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">Bet</button>
			</div>
			<h3>Round Info</h3>
			<div>
				<button onClick={handleGetRoundInfo} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">Get Round Info</button>
			</div>
			{/* <div>
				{JSON.stringify(roundInfo)}
				{roundInfo && (<ul>
					{Object.entries(roundInfo).map(([key, value]) => {
						return <li key={key}><b>{key}</b>: {value}</li>
					})}
				</ul>)}
			</div> */}
			<h3>Bet Info</h3>
			<div>
				<button onClick={handleGetBetInfo} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">Get Bet Info</button>
			</div>
		</>
	);
};

export default DemoComponentStarknetJS;