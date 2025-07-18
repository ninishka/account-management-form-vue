import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, AccountFormData, LabelItem } from '@/types/account'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  const loadAccounts = () => {
    const saved = localStorage.getItem('accounts')
    if (saved) {
      accounts.value = JSON.parse(saved)
    }
  }

  const saveAccounts = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }

  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      labels: '',
      recordType: 'Local',
      login: '',
      password: ''
    }
    accounts.value.push(newAccount)
    saveAccounts()
  }

  const updateAccount = (id: string, data: Partial<AccountFormData>) => {
    const account = accounts.value.find(acc => acc.id === id)
    if (account) {
      Object.assign(account, data)
      
      if (data.labels !== undefined) {
        const labelArray = data.labels.split(';').map(label => label.trim()).filter(label => label)
        const labelObjects: LabelItem[] = labelArray.map(text => ({ text }))
      }
      
      saveAccounts()
    }
  }

  const deleteAccount = (id: string) => {
    const index = accounts.value.findIndex(acc => acc.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
      saveAccounts()
    }
  }

  loadAccounts()

  return {
    accounts: computed(() => accounts.value),
    addAccount,
    updateAccount,
    deleteAccount
  }
}) 