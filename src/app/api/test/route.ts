export async function GET() {
  return Response.json({ 
    message: 'Next.js API is working!',
    timestamp: new Date().toISOString()
  })
}