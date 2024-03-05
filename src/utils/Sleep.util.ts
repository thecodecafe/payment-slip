export function Sleep(ms: number): Promise<number> {
  return new Promise(res => {
    setTimeout(() => {
      res(ms);
    }, ms);
  })
}
