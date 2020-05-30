export interface TerminalMessage {
    type: 'player-input' | 'output';
    message: string;
}