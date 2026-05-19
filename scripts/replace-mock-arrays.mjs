import fs from 'node:fs'

const path = 'lib/report-mock-data.ts'
const text = fs.readFileSync(path, 'utf8')
const start = text.indexOf('export const slRecords')
const end = text.indexOf('function periodLabel')
if (start < 0 || end < 0) throw new Error('markers not found')

const head = text.slice(0, start)
const tail = text.slice(end)
const mid = `import { createMockRecords, MOCK_DATA_ROW_COUNT } from './report-mock-generator'

const __mock = createMockRecords(MOCK_DATA_ROW_COUNT)
export const slRecords = __mock.slRecords
export const cpRecords = __mock.cpRecords

`

fs.writeFileSync(path, head + mid + tail)
console.log('Replaced static arrays with 5000 generated rows')
