import TestState from "./TestState";


export function DebugOverlay(){
    return <div className="absolute top-5 right-5 z-50">
        <TestState />

    </div>
}