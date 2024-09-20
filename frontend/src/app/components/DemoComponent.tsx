'use client';

import {useState} from 'react';
import { useConnect } from "@starknet-react/core";


const contractAddress = "0x04cfe4fbea86ab273e75f6e0fdaca06de1c3a8495dd3d5a65afa4822339306ef";

interface DemoComponentProps {
}

const DemoComponent: React.FC<DemoComponentProps> = (props) => {

	const { connect, connectors } = useConnect();

	const [walletName, setWalletName] = useState("");
	const [account, setAccount] = useState();
  const [address, setAddress] = useState<string>();

  function handleConnect() {
		// connectAsync().then((connection) => {
			// console.log('####: connection: ', connection);
			// setAccount(connection?.account);
			// setAddress(connection?.selectedAddress);
			// console.log(connection);
			// setWalletName(connection?.name || "")
		// });
  }

  function handleDisconnect() {
    
  }

  // async function handleStartRound() {
	// 	try {
	// 		const contract = new Contract(contractAbi, contractAddress, account);
	// 		console.log('####: contract: ', contract);
	// 		await contract.startRound(100000);
	// 	} catch (err) {
	// 		console.log('####: err: ', err);
	// 	}
	// }

	return (
		<div>
			<h2>Connect Wallet</h2>
			{/* <ul>
				{connectors.map((connector) => (
					<li key={connector.id}>
						<button onClick={() => connect({ connector })}>
							{connector.name}
						</button>
					</li>
				))}
			</ul> */}
			<p><b>Wallet name: </b>{walletName}</p>
			<p><b>Address: </b>{address}</p>
			<div>
				<button onClick={handleConnect} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">Connect</button>
				<button onClick={handleDisconnect} className="inline-block px-4 py-2 bg-red-500 text-white rounded">
					Disconnect
				</button>
			</div>

			<h2>Contract actions and state:</h2>
			<div>
				{/* <button onClick={handleStartRound} className="inline-block mr-2 px-4 py-2 bg-blue-500 text-white rounded">Start Round</button> */}
			</div>
		</div>
	);
};

export default DemoComponent;