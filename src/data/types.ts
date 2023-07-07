

export interface APIKey {
    id: string
    user_id: string
    name: string
    service_id: string
    exchange_id:string
    api_key:string
    api_secret:string
    service?: {
      title:string
    }
    exchange: {
      title:string
    }
  }


  export interface Wallet {
    id: string
    user_id: string
    address: string
  }

  export interface LoginData {
    user?: any
  }

  export interface OptionCoin {
    id:string
    user_id:string
    coin:string
    stoploss:boolean
    stoploss_tralling:boolean
    stoploss_amount:number
    takeprofit:boolean
    takeprofit_amount:number
    amount:number
    leverage:number
  }


  export interface Plan {
    id:string
    service_id:string
    title:string
    period_type:string
    period_interval:number
    is_free:boolean | number
    period_interval_in_days?:string
    amount:string
    total_amount:string
    period_price_formatted?:string
  }


  export interface Subscribe {
    id: string
    user_id: string
    service_id: string
    plan_id:string
    status:string
    starts_at: boolean
    ends_at:boolean
    status_title:string
    service: {
      title:string
    }
    plan:Plan
  }

  export interface Exchage {
    id: string
    title: string
  }
  
  export interface Invoice {
    id: string
    user_id: string
    invoice_title?:string
    invoice_link?:string
    invoice_token?:string
    token_id: string
    amount:string
    created_at:string
    token:{
        id:string
        symbol:string
        contract_address:string
        disabled:boolean
        price:boolean
    }
    depts?:dept[]
    wallet?: Wallet
  }


  export interface dept {
      amount?:string
      token_id:string
      token: {
        id:string
        symbol:string
        contract_address:string
        disabled:boolean
        price:boolean
      }
  }

  export interface Deposit {
    id: number
    user_id: string
    token_id: string
    amount: string
    created_at: string
    token: {
      id: string
      symbol: string
      contract_address: string
      disabled: boolean
      price: boolean
    }
  }

  export interface b11botSerivce {
    hasSubscripe?:boolean
    hasActiveSubscripe?:boolean
    hasExpiredSubscripe?:boolean
    hasWaitSubscripe?:boolean
    subscripe?:{}
    activeSubscripe?:Subscribe | null
    waitSubscripe?:Subscribe | null
    botStatus?:string
    settings?:{}
    plans?: Plan[]
    apikey?:APIKey | null
    service:Serivce
    waitInvoice:Invoice | null
  }
  

  export interface Serivce {
    id: string
    title: string
    type: string
    accounting_face:string
    user_id:string
    for_listing: boolean
    active:boolean
    description: string
  }


  export interface Withdrawal {
    id: string
    user_id: string
    token_id: string
    amount: string
    wallet_address: string
    created_at: string
    status: string
    status_title: string
    token: {
      id: string
      symbol: string
      contract_address: string
      disabled: boolean
      price: boolean
    }
  }
  

  export interface InvestmentPackage {
    id: string
    title: string
    token_id: string
    profit_limit: number
    min_amount: number
    max_amount: number
    min_monthly_profit: number
    max_monthly_profit: number
    description:string
    overview: {
      maxLimit:string
      monthsCount:number
      months: {
        monthNumber:number
        profit:string
        profitPercentil:string
        remaining:string
      }[]
    }
  }

  export interface Investment {
    id: string
    user_id: string
    service_id: string
    package_id: string
    package?:InvestmentPackage
    token_id: string
    token?:{
      id:string
      symbol:string
      contract_address:string
      disabled:boolean
      price:boolean
    }
    amount: boolean
    status: string
    starts_at: string
    ends_at:string
    total_profit:string
    total_profit_limit:string
    remaining_expire:string
    is_expired:boolean
  }

  export interface InvestmentSerivce {
    id: string
    investments: Investment[]
    investmentPackage: InvestmentPackage[]
    hasActiveInvenstment: boolean
    hasExpiredInvenstment: boolean
    hasWaitInvenstment: boolean
    totalOfInvenstment: boolean
    totalOfInvenstmentProfit: string
    waitInvoice:Invoice | null
  }
  

