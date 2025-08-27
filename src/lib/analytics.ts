export const track = (e: string, p: Record<string, any> = {}) => { 
  if (typeof window !== 'undefined') console.log('track', e, p) 
}
