import bcrypt from 'bcrypt'
import { HashComparer, HashComparerModel } from '../../../data/protocols/cryptografy/hash-comparer'
import { Hasher } from '../../../data/protocols/cryptografy/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash
  }

  async compare({ value, hashedValue }: HashComparerModel): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hashedValue)
    return isValid
  }
}
