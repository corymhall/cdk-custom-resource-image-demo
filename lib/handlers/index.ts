
export async function handler(event: any): Promise<any> {
  console.log(`Event: ${JSON.stringify(event)}`);
  return {
    message: 'hello world',
  };
}
