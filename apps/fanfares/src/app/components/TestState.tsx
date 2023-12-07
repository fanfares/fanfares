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
    const { nostrTest, nostrSetTest, accountPublicKey, accountProfile } = useAppState();

    const onClick = () => {
        nostrSetTest(getRandomAnimalEmoji(nostrTest))
    }

    const renderKey = () => {
        let key = accountPublicKey;
        if (key) {
            key = key.slice(0, 10) + "..." + key.slice(-10);
        } else {
            key = "Not Connected";
        }

        return <p>{key}</p>
    }

    const renderProfile = () => {
        return <p>{accountProfile?.name ?? 'Profile not loaded'}</p>
    }

    const renderStateTest = () => {

        return <p onClick={onClick}>{nostrTest}</p>
    }

    return <div>
        {renderKey()}
        {renderProfile()}
        {renderStateTest()}
    </div>
}