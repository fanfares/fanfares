export enum Action {
    SERVER = 'SERVER',
    CREATE = 'CREATE',
    GET_INVOICE = 'INVOICE',
    GET_RESULT = 'RESULT'
}

export enum Status {
    INFO = 'INFO',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}

export function serverLog(action: Action, status: Status, message: string) {
    let color: string;

    // ANSI escape codes for colors
    const RESET = "\x1b[0m";
    const RED = "\x1b[31m";
    const GREEN = "\x1b[32m";
    const BLUE = "\x1b[34m";

    // Assign color based on status
    switch (status) {
        case Status.ERROR:
            color = RED;
            break;
        case Status.SUCCESS:
            color = GREEN;
            break;
        case Status.INFO:
        default:
            color = BLUE;
            break;
    }

    const formattedAction = (action + ':').padEnd(8, ' ');  // To ensure all actions are the same length for proper alignment
    console.log(`${color}${formattedAction} ${message} ${RESET}`);
}