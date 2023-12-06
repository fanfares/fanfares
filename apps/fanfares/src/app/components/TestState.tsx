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
    const { nostrTest, nostrSetTest } = useAppState();

    const onClick = () => {
        nostrSetTest(getRandomAnimalEmoji(nostrTest))
    }

    return <div>
        <p onClick={onClick}>{nostrTest}</p>
    </div>
}