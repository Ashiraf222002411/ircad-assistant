// src/app/api/gemini-chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { message, image } = await request.json()

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ 
        response: 'AI service configuration error. Please contact IT support.' 
      })
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    
    // Choose model based on whether we have an image
    const modelName = image ? "gemini-1.5-flash" : "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: modelName })

    let result

    if (image) {
      // Handle image analysis
      console.log('Processing image analysis request...')
      
      // Extract image data
      const base64Data = image.split(',')[1]
      const mimeType = image.split(';')[0].split(':')[1]
      
      // Prepare image content for Gemini
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }

      // Create comprehensive prompt for visual analysis
      const visualAnalysisPrompt = `You are an expert technical support specialist for IRCAD Africa with visual analysis capabilities.

You help with all types of equipment and software issues including medical equipment, computers, network systems, scientific instruments, and any other technical systems used at IRCAD.

User message: "${message}"

Please analyze this image and provide technical support. Focus on:

1. Equipment Identification: What device or system is shown in the image?
2. Issue Assessment: What problems can you observe from the image?
3. Technical Diagnosis: What likely caused this issue based on visual indicators?
4. Solution Steps: Provide clear, step-by-step troubleshooting instructions
5. Safety Considerations: Any safety warnings relevant to this situation
6. When to Escalate: Indicate when professional technician assistance is needed

Provide clear, professional responses without excessive formatting. Be specific and practical in your recommendations.`

      // Generate content with image
      result = await model.generateContent([visualAnalysisPrompt, imagePart])
      
    } else {
      // Handle text-only request
      console.log('Processing text-only request...')
      const prompt = `You are an expert technical support specialist for IRCAD Africa. You help with all types of equipment and software issues including medical equipment, computers, network systems, scientific instruments, and any other technical systems used at IRCAD.

Provide clear, practical solutions without excessive formatting. Be professional and helpful.

User: ${message}`
      result = await model.generateContent(prompt)
    }

    const response = await result.response
    const text = response.text()

    console.log('Gemini response generated successfully')
    
    return NextResponse.json({ response: text })

  } catch (error: unknown) {
    console.error('Gemini API Error:', error)
    
    // Provide specific error messages based on error type
    let errorMessage = 'I encountered an issue analyzing your request. '
    
    // Check if error is an instance of Error to access message property
    if (error instanceof Error) {
      if (error.message?.includes('API key')) {
        errorMessage += 'API configuration error. Please contact IT support.'
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        errorMessage += 'AI service temporarily unavailable due to high usage. Please try again in a few minutes.'
      } else if (error.message?.includes('image') || error.message?.includes('vision')) {
        errorMessage += 'Image analysis failed. Please try:\n• Using a clearer, well-lit photo\n• A smaller image file\n• Different image format (JPG/PNG)'
      } else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
        errorMessage += 'Content blocked for safety reasons. Please ensure images are of technical equipment only.'
      } else {
        errorMessage += 'Please check your connection and try again. If the issue persists, contact IT support.'
      }
    }
    
    return NextResponse.json({ 
      response: `Technical Support Error\n\n${errorMessage}\n\nError Code: ${error instanceof Error ? error.name : 'Unknown'}\nTimestamp: ${new Date().toISOString()}`
    })
  }
}

// Handle CORS for development
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}