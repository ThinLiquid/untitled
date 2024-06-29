declare module '@mercuryworkshop/bare-mux' {
  export const SetTransport: (transport: string, config: Record<string, string>) => Promise<void>
}
