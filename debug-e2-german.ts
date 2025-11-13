/**
 * Debug E2 German Pattern Matching
 */

const germanText = 'Medizinisch überprüft von Dr. Müller.'
const germanTextLower = germanText.toLowerCase()

console.log('🐛 E2 German Pattern Debug\n')
console.log('Test content:', germanText)
console.log('Lowercase:', germanTextLower)
console.log('\n' + '='.repeat(80) + '\n')

// Test the pattern from E2 detector
const germanPattern = /\b(geprüft von|überprüft von|fachlich geprüft von)\b/gi

console.log('Pattern:', germanPattern)
console.log('Pattern source:', germanPattern.source)
console.log('Pattern flags:', germanPattern.flags)
console.log()

// Test matching
const match1 = germanPattern.exec(germanText)
console.log('Match result (exec):', match1)
germanPattern.lastIndex = 0

const match2 = germanText.match(germanPattern)
console.log('Match result (string.match):', match2)

// Test individual patterns
console.log('\n' + '='.repeat(80) + '\n')
console.log('Testing individual patterns:\n')

const patterns = [
  { name: 'geprüft von', pattern: /\bgeprüft von\b/gi },
  { name: 'überprüft von', pattern: /\büberprüft von\b/gi },
  { name: 'fachlich geprüft von', pattern: /\bfachlich geprüft von\b/gi },
  { name: 'Medizinisch überprüft von', pattern: /\bMedizinisch überprüft von\b/gi }
]

patterns.forEach(({ name, pattern }) => {
  const match = germanText.match(pattern)
  pattern.lastIndex = 0
  console.log(`${name}: ${match ? `✓ MATCHED "${match[0]}"` : '✗ NO MATCH'}`)
})

// Test word boundary around "überprüft"
console.log('\n' + '='.repeat(80) + '\n')
console.log('Testing word boundaries:\n')

const boundaryTests = [
  { desc: 'überprüft (no boundaries)', pattern: /überprüft/gi },
  { desc: '\\büberprüft\\b (both boundaries)', pattern: /\büberprüft\b/gi },
  { desc: '\\büberprüft (start boundary only)', pattern: /\büberprüft/gi },
  { desc: 'überprüft\\b (end boundary only)', pattern: /überprüft\b/gi },
  { desc: 'isch überprüft (space before)', pattern: /isch überprüft/gi }
]

boundaryTests.forEach(({ desc, pattern }) => {
  const match = germanText.match(pattern)
  pattern.lastIndex = 0
  console.log(`${desc}: ${match ? `✓ MATCHED "${match[0]}"` : '✗ NO MATCH'}`)
})

// Character code analysis
console.log('\n' + '='.repeat(80) + '\n')
console.log('Character code analysis:\n')

const targetWord = 'überprüft'
console.log(`Word: "${targetWord}"`)
for (let i = 0; i < targetWord.length; i++) {
  const char = targetWord[i]
  const code = char.charCodeAt(0)
  console.log(`  [${i}] "${char}" = U+${code.toString(16).toUpperCase().padStart(4, '0')} (${code})`)
}

// Check what comes before "überprüft" in the text
const index = germanText.indexOf('überprüft')
if (index !== -1) {
  const before = germanText.slice(Math.max(0, index - 5), index)
  const after = germanText.slice(index + 9, index + 14) // "überprüft" is 9 chars
  console.log(`\nContext: "${before}|überprüft|${after}"`)
  console.log(`Char before: "${before.slice(-1)}" (U+${before.slice(-1).charCodeAt(0).toString(16).toUpperCase()})`)
}

console.log('\n✅ Debug complete')
