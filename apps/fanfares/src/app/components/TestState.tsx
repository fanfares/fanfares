'use client';

import { useAppState } from "../controllers/state/use-app-state";

function getRandomAnimalEmoji(exceptEmoji: string): string {
    // List of animal emojis
    const animalEmojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦄"];
  
    // Filter out the emoji that should not be returned
    const filteredEmojis = animalEmojis.filter(emoji => emoji !== exceptEmoji);
  
    // Select a random emoji from the filtered list
    const randomEmoji = filteredEmojis[Math.floor(Math.random() * filteredEmojis.length)];
  
    return randomEmoji;
  }

export default function TestState(){

    return <p>{getRandomAnimalEmoji('')}</p>
    // const { testState, testSetState, accountPublicKey, accountProfile, primalSocket, primalNotes, gateKeys, gateFetch, podcastFetch, podcastEpisodes } = useAppState();


    // const renderKey = () => {
    //     let key = accountPublicKey;
    //     if (key) {
    //         key = key.slice(0, 10) + "..." + key.slice(-10);
    //     } else {
    //         key = "Not Connected";
    //     }

    //     return <p>{key}</p>
    // }

    // const renderProfile = () => {
    //     return <p>{accountProfile?.name ?? 'Profile not loaded'}</p>
    // }

    // const renderStateTest = () => {

    //     const onClick = () => {
    //         testSetState(getRandomAnimalEmoji(testState))
    //     }
    //     return <p onClick={onClick}>{testState}</p>
    // }

    // const renderPrimalTest = () => {
    //     return <p>Primal Test {primalSocket?.readyState ?? -1} {primalNotes.length}</p>
    // }

    // const renderGateTest = () => {
    //     const onClick = () => {
    //         gateFetch();
    //     }
    //     return <p onClick={onClick}>Gate Test {Object.keys(gateKeys).length}</p>
    // }

    // const renderPodcastTest = () => {
    //     const onClick = () => {
    //         podcastFetch();
    //     }
    //     return <p onClick={onClick}>Podcast Test {Object.keys(podcastEpisodes).length}</p>
    // }

    // return <div>
    //     {renderKey()}
    //     {renderProfile()}
    //     {renderStateTest()}
    //     {renderPrimalTest()}
    //     {renderGateTest()}
    //     {renderPodcastTest()}
    // </div>
}