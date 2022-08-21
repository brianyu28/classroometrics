// Return current timestamp as seconds since Jan 1 1970
export function getCurrentTimestamp(): number {
  return new Date().getTime() / 1000;
}
