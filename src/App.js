import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import './App.css';
import contractABI from './abi/Tasks.json';

const CHAIN_ID = "0x13881";
const App = () => {


    const [taskAmount, setTaskAmount] = useState(0);
    const [taskName, setTaskName] = useState("");
    const [taskEndingTime, setTaskEndingTime] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");
    const [isMining, setIsMining] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [network, setNetwork] = useState("");
    const [reload, setReload] = useState(false);
    const [allTasks, setAllTasks] = useState([]);


    const contractAddress = "0xCac52Ac25540d7bb156F8b1103Fdd9a375d4701a";
    const PRIZE_AMOUNT = 0.0001;


    /**
     *
     * @returns {Promise<void>}
     */
    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;

            /**
             * Verifier que l'utilisateur dispose de l'extension metamask
             */
            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {

                console.log("Metamask detected", ethereum);
            }

            /**
             * Verifier que l'utilisateur est sur le bon réseau
             * @type {*}
             */
                //l'objet ethereum est l'api que metamask ajoute dans notre site web
            const network = await ethereum.request({method: 'eth_chainId'});
            if (network === CHAIN_ID) {
                setNetwork(network);
                console.log("Connected to Polygon testnet");
            }
            console.log("Network is :", network, typeof (network));

            /**
             * Requête à l'objet ethereum de la liste des comptes
             * autorisés
             * @type {*}
             */
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account)
            } else {
                console.log("No authorized account found")
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Permet à l'utilisateur de connecter son wallet avec une requete à l'objet
     * ethereum
     * @returns {Promise<void>}
     */
    const connectWallet = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }
            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }


    /**
     * Fonction utilisée pour récupérer le nombre total d'intéractions avec le SC
     */
    const getTotalTasks = async () => {
        const {ethereum} = window;

        try {
            if (window.ethereum) {

                /**
                 The provider is how web3 talks to the blockchain.
                 Providers take JSON-RPC requests and return the response.
                 * @type {Web3Provider}
                 */
                const provider = new ethers.providers.Web3Provider(ethereum);

                /**
                 * A Signer in ethers is an abstraction of an Ethereum Account
                 * which can be used to sign messages and transactions and send signed
                 * transactions to the Ethereum Network to execute state changing operations.
                 * @type {JsonRpcSigner}
                 */
                const signer = provider.getSigner();

                /**
                 * A Contract may be sent transactions
                 * which will trigger its code to be run with the input of the transaction data.
                 * @type {Contract}
                 */
                const tasksContract = new ethers.Contract(contractAddress, contractABI.abi, signer);

                //interact with our contract to get the total amount of waves
                const tasksAmount = await tasksContract.getTotalTasks();
                setTaskAmount(tasksAmount);
                console.log("Total tasks : ", tasksAmount);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * create a tasks stored in the smart contract
     * using the taskName and taskEnding time previously set
     */
    const createTask = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                setIsMining(true);

                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const tasksContract = new ethers.Contract(contractAddress, contractABI.abi, signer);

                let count = await tasksContract.getTotalTasks();
                console.log("Retrieved total tasks count...", count.toNumber());
                const taskTxn = await tasksContract.createTask(taskName, taskEndingTime);
                console.log("Mining...", taskTxn.hash);
                await taskTxn.wait();
                console.log("Mined -- ", taskTxn.hash);
                count = await tasksContract.getTotalTasks();
                console.log("Retrieved total tasks count...", count.toNumber());
                setIsMining(false);
                setIsSuccess(true);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
            setIsMining(false);
            setIsSuccess(false);
        }
    }

    const getAllTasksInfo = async () => {

        const {ethereum} = window;
        let tasksArray = [];
        let infos;
        try {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const tasksContract = new ethers.Contract(contractAddress, contractABI.abi, signer);
                for (let i = 0; i <= taskAmount - 1; i++) {
                    infos = await tasksContract.getTaskInfo(i);
                    console.log("Retrieving tasks info... " + infos);
                    tasksArray.push(infos);
                    console.log(tasksArray);
                }
                setAllTasks(tasksArray);
            } else {
                console.log("Ethereum object doesn't exist!");
            }

        } catch (error) {
            console.log(error)
            setIsMining(false);
            setIsSuccess(false);
        }

    }

    const registerUser = async () => {
        try {
            const {ethereum} = window;

            if (ethereum) {
                setIsMining(true);
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const tasksContract = new ethers.Contract(contractAddress, contractABI.abi, signer);
                const taskTxn = await tasksContract.registerMember();
                console.log("Mining...", taskTxn.hash);
                await taskTxn.wait();
                console.log("Mined -- ", taskTxn.hash);
                setIsMining(false);
                setIsSuccess(true);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
            setIsMining(false);
            setIsSuccess(false);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        getTotalTasks();

    }, [])

    useEffect(() => {
        checkIfWalletIsConnected();
        getTotalTasks();
    }, [reload])
    useEffect(() => {
        checkIfWalletIsConnected();
        console.log("displaying taasks");
        getAllTasksInfo();
    }, [taskAmount])


    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value);
        console.log(taskName);
    }

    const handleEndingTimeChange = (e) => {
        setTaskEndingTime(e.target.value);
    }

    const handleSubmit = async () => {
        await createTask();

    }

    const handleReload = () => {
        window.location.reload();
    }

    const WaveButton = () => {
        return (
            <button className="createTaskButton" onClick={createTask}>
                Create a task
            </button>
        )
    }

    const SpinningAnimation = () => {
        return (
            <div class="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }

    const RegisterButton = () => {
        return (<button className="createTaskButton" onClick={registerUser}>
            Register
        </button>)
    }

    const WaveButtonSuccess = () => {
        return (
            <button className="createTaskButtonSuccess" onClick={createTask}>
            </button>
        )
    }

    const ConnectButton = () => {
        return (<button className="createTaskButton" onClick={connectWallet}>
            Connect Wallet
        </button>)
    }

    const InteractionButton = () => {
        if (!isMining && !isSuccess && currentAccount !== ("")) {
            return <WaveButton/>
        } else if (isMining) {
            return <SpinningAnimation/>
        } else if (isSuccess) {
            return <WaveButtonSuccess/>
        } else if (currentAccount === "") {
            return <ConnectButton/>
        }
    }

    const WrongNetwork = () => {
        return (
            <div className="dataContainer">
                <span>Please connect to the Polygon Testnet Network </span>
                <button className="createTaskButton" onClick={handleReload}> Reload page</button>
            </div>
        )
    }


    const Tasks = () => {
        if (allTasks.length !== 0) {
            allTasks.map((task) => {
                <div>
                    {<div>task[0], task[1], task[2], task[3], task[4]</div>}
                </div>
            })
        } else {
            return (<div></div>)
        }
    }

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    👋 Hey there!
                </div>

                <div className="bio">
                    Bienvenue sur la page du premier Workshop-dev KS !
                </div>

                {network !== CHAIN_ID ? <WrongNetwork/> :
                    <div className="dataContainer">
                        {currentAccount !== "" && (
                            <div className="taskDiv">

                                <input className="taskInput" placeholder="Entre le nom de la tâche à créer ici"
                                       value={taskName} onChange={handleTaskNameChange}>
                                </input>
                                <input className="taskInput" placeholder="Entre la durée de la tâche ici"
                                       value={taskEndingTime} onChange={handleEndingTimeChange}>
                                </input>
                            </div>)
                        }
                        <InteractionButton/>
                        <RegisterButton/>
                        <div className="taskCard">{allTasks.map((task) => {
                                return (
                                    <div>
                                        <p>{task}</p>
                                    </div>);
                        })};
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default App