import { NextRequest, NextResponse } from 'next/server'

// Force Node.js runtime
export const runtime = 'nodejs'

function getDataForSEOLogin(): string | undefined {
  return process.env.DATAFORSEO_LOGIN
}

function getDataForSEOPassword(): string | undefined {
  return process.env.DATAFORSEO_PASSWORD
}

export async function GET(request: NextRequest) {
  const login = getDataForSEOLogin()
  const password = getDataForSEOPassword()

  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    credentialsPresent: {
      login: !!login,
      password: !!password,
    },
    credentialLengths: {
      login: login?.length || 0,
      password: password?.length || 0,
    },
    loginValue: login, // Show actual value for debugging
  }

  // Test authentication
  if (login && password) {
    try {
      const authString = Buffer.from(`${login}:${password}`).toString('base64')
      diagnostics.authStringLength = authString.length

      // Test account status
      const statusResponse = await fetch('https://api.dataforseo.com/v3/appendix/user_data', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
        },
      })

      const statusData = await statusResponse.json()
      diagnostics.authTest = {
        statusCode: statusData.status_code,
        message: statusData.status_message,
        success: statusData.status_code === 20000,
      }

      // Test domain metrics for nytimes.com
      if (statusData.status_code === 20000) {
        const metricsResponse = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{
            target: 'nytimes.com',
            location_code: 2840,
            language_code: 'en',
          }]),
        })

        const metricsData = await metricsResponse.json()

        diagnostics.nytimesTest = {
          statusCode: metricsData.status_code,
          message: metricsData.status_message,
          success: metricsData.status_code === 20000,
        }

        if (metricsData.status_code === 20000) {
          const result = metricsData.tasks?.[0]?.result?.[0]?.items?.[0]
          diagnostics.nytimesMetrics = {
            organicKeywords: result?.metrics?.organic?.count || 0,
            organicTraffic: result?.metrics?.organic?.etv || 0,
            organicTrafficValue: result?.metrics?.organic?.estimated_paid_traffic_cost || 0,
          }
        } else {
          diagnostics.nytimesError = metricsData
        }
      }
    } catch (error) {
      diagnostics.error = error instanceof Error ? error.message : 'Unknown error'
    }
  } else {
    diagnostics.error = 'Missing credentials'
  }

  return NextResponse.json(diagnostics, { status: 200 })
}
