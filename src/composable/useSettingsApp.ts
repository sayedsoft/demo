import { computed, reactive } from 'vue'
import { createSharedComposable, useCssVar } from '@vueuse/core'
import { HSLToHex } from '/@src/utils/color-converter'
import { useGlobalState } from '../stores/appSettings'
import { useUserSession } from '../stores/userSession'


export const stake = () => {

  const periodNames = {
    'day': 'Daily',
    'month': 'Monthly',
    'year': 'Yearly',
    'hour': 'Hourly',
    'week': 'Weekly',
  }

  const getPeriodName = (p: string) => {
    if (p in periodNames) return periodNames[p]
    return 'Unknown'
  }

  return {
    periodNames,
    getPeriodName
  }

}


export const dex = () => {

  const accounting = computed(() => useUserSession().getAccounting())

  const setttings = computed(() => useGlobalState().value)

  const balances = computed<any>(() => {
    if (accounting !== undefined && accounting !== null) {
      return accounting.value.balances

    }
    return []
  })


  const totals = computed(() => {
    if (accounting !== undefined && accounting !== null) {
      return accounting.value.accounting_totals

    }
    return null
  })

  const totalOf = (type: string, token: number) => {
    try {
      try {
        return totals.value[token][type];
      } catch (error) {
        return { "value": 0, "converted": 0 }
      }

    } catch (error) {

    }

  }

  const balanceOf = (token: number) => {

    const s: any[] = balances.value.filter((t: any) => t.token_id == token)
    return (s.length > 0) ? s[0] : undefined
    return 0
  }

  const settingsOf = (key: string) => {
    if (setttings.value !== null) return setttings.value[key]
    return []
  }


  const tokenOf = (by: number | string) => {
    const s: any[] = settingsOf('tokens').filter((t: any) => t.id == by as number || t.token_code == by)
    return (s.length > 0) ? s[0] : undefined
  }

  const pairOf = (by: number | string) => {
    const s: any[] = settingsOf('exchange_pairs').filter((t: any) => t.id == by as number || by == t.name)
    return (s.length > 0) ? s[0] : undefined
  }

  const stakePlansOf = (tokenId: number) => {
    const plan: any[] = settingsOf('stake_plans').filter((t: any) => t.token_id == tokenId as number || tokenId == t.name)
    return plan
  }

  const numHasComma = (no: any) => {
    no = new String(no)
    return (no).includes('.')
  }


  const numComppor = (no: any) => {
    no = new String(nf(no))
    if (numHasComma(no)) {
      let a = no.split('.')
      let a1 = a[0], a2 = a[1]
      return [a1, a2]
    }
    return no
  }

  const nf = (no: any) => {
    no = parseFloat(no)
    let n = no.toFixed(4)
    return n
  }

  return {
    accounting,
    setttings,
    balances,
    totals,
    numComppor,
    numHasComma,
    nf,
    totalOf,
    balanceOf,
    settingsOf,
    tokenOf,
    pairOf,
    stakePlansOf
  }
} 
