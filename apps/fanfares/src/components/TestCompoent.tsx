'use client';
import { useAppState } from "@/controllers/state/use-app-state"

export interface TestComponentProps {
    content: string
}

export default function TestComponent(props: TestComponentProps){
    const { content } = props
    const { nostrState, changeNostrState } = useAppState()

    const onPress = () => {
        changeNostrState(content)
    }

    return <div>
        <p onClick={onPress}>{nostrState}</p>
        
    </div>
}