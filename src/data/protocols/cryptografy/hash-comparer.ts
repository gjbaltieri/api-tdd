export interface HashComparerModel {
  password: string
  hash: string
}

export interface HashComparer {
  compare(values: HashComparerModel): Promise<boolean>
}
