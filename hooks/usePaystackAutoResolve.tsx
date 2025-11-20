"use client"

import { useEffect, useState } from "react"

export default function usePaystackAutoResolve() {
    const [banks, setBanks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [bankCode, setBankCode] = useState("")
    const [accountName, setAccountName] = useState("")
    // const resolveToken = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY

    // Fetch banks once
    useEffect(() => {
        const loadBanks = async () => {
            const res = await fetch("https://api.paystack.co/bank", {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET}`,
                },
            })

            const data = await res.json()
            setBanks(data.data)
        }

        loadBanks()
    }, [])

    // Auto-detect bank & resolve account
    const resolve = async (accountNumber: string) => {
        setError("")
        setLoading(true)

        for (const bank of banks) {
            try {
                const res = await fetch(
                    `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bank.code}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
                        },
                    },
                )
                console.log(res)
                // console.log(`Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`)

                const data = await res.json()
                console.log(data)

                if (data.status === true && data.data.account_name) {
                    setBankCode(bank.code)
                    setAccountName(data.data.account_name)
                    setLoading(false)
                    return {
                        bankName: bank.name,
                        bankCode: bank.code,
                        accountName: data.data.account_name,
                    }
                }
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }

        setLoading(false)
        setError("Unable to detect bank for this account number.")
        return null
    }

    return {
        loading,
        error,
        bankCode,
        accountName,
        resolve,
    }
}
