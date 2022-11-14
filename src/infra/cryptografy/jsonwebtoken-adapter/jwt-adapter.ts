import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cryptografy/encrypter'

export class JwtAdapter implements Encrypter {
  private readonly secretKey: string
  constructor(secretKey: string) {
    this.secretKey = secretKey
  }

  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secretKey)
    return accessToken
  }
}