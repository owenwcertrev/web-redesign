/**
 * Test DataForSEO API directly
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD

async function testDataForSEOAPI() {
  if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
    console.error('❌ DataForSEO credentials not found in environment')
    return
  }

  console.log('✓ Credentials loaded')
  console.log('Login:', DATAFORSEO_LOGIN)
  console.log('Password length:', DATAFORSEO_PASSWORD.length)
  console.log()

  // Test 1: Check account status
  console.log('📊 Test 1: Checking account status...')
  try {
    const statusResponse = await fetch('https://api.dataforseo.com/v3/appendix/user_data', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`),
        'Content-Type': 'application/json',
      },
    })

    const statusData = await statusResponse.json()

    if (statusData.status_code === 20000) {
      console.log('✓ Authentication successful!')
      console.log('Account info:', {
        money: statusData.tasks?.[0]?.result?.money,
        rates: statusData.tasks?.[0]?.result?.rates,
      })
    } else {
      console.error('❌ Authentication failed:', statusData.status_message)
    }
  } catch (error) {
    console.error('❌ Status check failed:', error)
  }

  console.log()

  // Test 2: Get NYTimes domain metrics
  console.log('📊 Test 2: Fetching NYTimes domain metrics...')
  try {
    const requestBody = [
      {
        target: 'nytimes.com',
        location_code: 2840, // USA
        language_code: 'en',
      }
    ]

    const response = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    console.log('Response status code:', data.status_code)
    console.log('Response message:', data.status_message)

    if (data.status_code === 20000) {
      const result = data.tasks[0]?.result?.[0]?.items?.[0]

      if (result?.metrics?.organic) {
        console.log('✓ Got organic metrics:')
        console.log('  - Keywords:', result.metrics.organic.count)
        console.log('  - Traffic (ETV):', result.metrics.organic.etv)
        console.log('  - Traffic Value:', result.metrics.organic.estimated_paid_traffic_cost)
        console.log('  - Position distribution:', {
          pos_1: result.metrics.organic.pos_1,
          pos_2_3: result.metrics.organic.pos_2_3,
          pos_4_10: result.metrics.organic.pos_4_10,
          pos_11_20: result.metrics.organic.pos_11_20,
        })
      } else {
        console.log('⚠️ No organic metrics found in response')
        console.log('Full result:', JSON.stringify(result, null, 2))
      }

      console.log('\nAPI Cost:', data.cost, 'credits')
    } else {
      console.error('❌ API request failed:', data.status_message)
      console.log('Full response:', JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('❌ Domain metrics test failed:', error)
  }
}

testDataForSEOAPI().catch(console.error)
