'use client';

import { setupAppState, useAppState } from "@/controllers/state/use-app-state";
import Link from "next/link";
import { useEffect } from "react";

export interface TestComponentProps {
    content: string,
    toPage: string,
}

export default function TestComponent(props: TestComponentProps){
    const { content, toPage } = props
    const { nostrTest, nostrSetTest } = useAppState();

    const onClick = () => {
        nostrSetTest(content)
    }

    return <div>
        <p onClick={onClick}>{nostrTest}</p>
        <Link href={toPage} >To Next Page</Link>
    </div>
}