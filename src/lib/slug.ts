import { customAlphabet } from 'nanoid'
import { randomBytes } from 'crypto'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const generateId = customAlphabet(alphabet, 10)

export function generateSlug(): string {
  return generateId()
}

export function generateDeleteToken(): string {
  return randomBytes(32).toString('hex')
}
