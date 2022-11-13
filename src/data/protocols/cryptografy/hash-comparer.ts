export interface HashComparerModel {
  value: string
  hashedValue: string
}

export interface HashComparer {
  compare(values: HashComparerModel): Promise<boolean>
}
