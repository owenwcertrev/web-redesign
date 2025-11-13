/**
 * Direct test of E6 for Healthline
 * Diagnose the "0.1 posts/month" issue
 */

// First, let's understand what data E6 is receiving
console.log('🔍 E6 HEALTHLINE DIAGNOSTIC\n')
console.log('Issue: E6 reports 0.1 posts/month for Healthline')
console.log('Expected: High publishing rate (major health publisher)\n')

console.log('📋 HOW E6 WORKS:')
console.log('1. E6 requires BlogInsights data (aggregate of multiple posts)')
console.log('2. BlogInsights.publishingFrequency.postsPerMonth is calculated as:')
console.log('   postsPerMonth = totalPostsWithDates / spanMonths')
console.log('3. spanMonths = time between earliest and latest post\n')

console.log('🔧 DIAGNOSTIC QUESTIONS:')
console.log('Q1: How many posts were analyzed?')
console.log('Q2: How many posts had dates extracted?')
console.log('Q3: What is the date range (earliest to latest)?')
console.log('Q4: What is the calculated span in months?\n')

console.log('⚠️  LIKELY CAUSES OF 0.1 posts/month:')
console.log('Cause A: Only 1 post analyzed over 10+ month span')
console.log('Cause B: Dates not being extracted from Healthline posts')
console.log('Cause C: Blog discovery only finding 1 post')
console.log('Cause D: Date range calculation error\n')

console.log('📍 WHERE TO TEST:')
console.log('To properly test E6, we need to:')
console.log('1. Provide a blog URL (not single article)')
console.log('2. Crawl blog index to find recent posts')
console.log('3. Extract dates from each post')
console.log('4. Calculate publishing frequency\n')

console.log('❓ USER ACTION NEEDED:')
console.log('Please provide the context where you tested E6:')
console.log('- What URL did you use?')
console.log('- Was it a single article or blog aggregation?')
console.log('- What tool/interface showed "0.1 posts/month"?')
console.log('- Can you share the full E6 output/evidence?')
