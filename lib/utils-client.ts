

import { getSupabaseServerClient } from './supabase-server'

export async function getCurrentUser() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data } = await supabase.auth.getUser()
    // console.log(data)
    return data.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toFixed(2)}`
}
