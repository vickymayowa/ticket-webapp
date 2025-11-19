const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

/**
 * Create a Paystack subaccount (virtual account) for an organizer
 * This allows money from ticket sales to go directly to the organizer
 */
export async function createPaystackSubaccount(
    organizerData: {
        email: string
        businessName: string
        firstName: string
        lastName: string
        phone: string
        bankCode: string
        accountNumber: string
    }
) {
    try {
        const response = await fetch('https://api.paystack.co/subaccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
            body: JSON.stringify({
                business_name: organizerData.businessName,
                settlement_bank: organizerData.bankCode,
                account_number: organizerData.accountNumber,
                subaccount_code: `ORG-${Date.now()}`, // Unique code
                phone_number: organizerData.phone,
                primary_contact_email: organizerData.email,
                primary_contact_name: `${organizerData.firstName} ${organizerData.lastName}`,
                percentage_charge: 0,
            }),
        })
        console.log(response)

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Paystack error: ${error.message}`)
        }

        const data = await response.json()
        console.log(data)

        if (!data.status) {
            throw new Error('Failed to create Paystack subaccount')
        }

        return {
            subaccount_code: data.data.subaccount_code,
            subaccount_id: data.data.id,
            bank_account: organizerData.accountNumber,
            account_name: data.data.business_name,
        }
    } catch (error) {
        console.error('Paystack subaccount creation error:', error)
        throw error
    }
}

/**
 * Split payment between platform and organizer using Paystack split
 */
export async function initializePaymentWithSplit(
    email: string,
    amount: number,
    metadata: {
        order_id: string
        event_id: string
        quantity: number
        organizer_subaccount_code: string
        commission_rate: number // e.g., 10 for 10%
    }
) {
    try {
        const commissionAmount = Math.round((amount * metadata.commission_rate) / 100)
        const organizerAmount = amount - commissionAmount

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Convert to kobo
                metadata,
                split_code: undefined, // Set via split API if needed
                // You can add split rules here if using Paystack Splits
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Paystack initialization failed: ${error.message}`)
        }

        const data = await response.json()

        if (!data.status) {
            throw new Error('Payment initialization failed')
        }

        return {
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
            commission_amount: commissionAmount,
            organizer_amount: organizerAmount,
        }
    } catch (error) {
        console.error('Payment initialization error:', error)
        throw error
    }
}

/**
 * Verify payment and handle split settlement
 */
export async function verifyPayment(reference: string) {
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        })

        const data = await response.json()

        if (!data.status) {
            throw new Error('Payment verification failed')
        }

        return data.data
    } catch (error) {
        console.error('Payment verification error:', error)
        throw error
    }
}
