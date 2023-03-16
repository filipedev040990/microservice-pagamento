export const sleep = async (time: number): Promise<any> => {
  return await new Promise(resolve => setTimeout(resolve, time))
}
