export interface Account {
  id: string
  labels: string
  recordType: 'LDAP' | 'Local'
  login: string
  password: string | null
}

export interface AccountFormData {
  labels: string
  recordType: 'LDAP' | 'Local'
  login: string
  password: string | null
}

export interface LabelItem {
  text: string
}

export interface AccountValidation {
  login: boolean
  password: boolean
} 