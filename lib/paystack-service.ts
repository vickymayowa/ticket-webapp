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
        commission_rate: number
    }
) {
    try {
        // Calculate commission and organizer share
        const commissionAmount = Math.round((amount * metadata.commission_rate) / 100)
        const organizerAmount = amount - commissionAmount
        console.log("Commission Amount:", commissionAmount)
        console.log("Organizer Amount:", organizerAmount)

        // Create split configuration for Paystack
        const split = {
            type: 'percentage',
            currency: 'NGN',
            subaccounts: [
                {
                    subaccount: metadata.organizer_subaccount_code,
                    share: 100 - metadata.commission_rate
                }
            ],
            bearer_type: 'subaccount',
            bearer_subaccount: metadata.organizer_subaccount_code
        }

        // First create the split code
        const splitResponse = await fetch('https://api.paystack.co/split', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
            body: JSON.stringify(split),
        })

        if (!splitResponse.ok) {
            const error = await splitResponse.json()
            throw new Error(`Paystack split creation error: ${error.message}`)
        }

        const splitData = await splitResponse.json()
        if (!splitData.status) {
            throw new Error('Failed to create Paystack split')
        }

        // Initialize payment with the split code
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
                split_code: splitData.data.split_code,
            }),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Paystack initialization error: ${error.message}`)
        }

        const data = await response.json()
        if (!data.status) {
            throw new Error('Failed to initialize payment')
        }

        return {
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
            split_code: splitData.data.split_code
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

        return {
            status: data.status,
            message: data.message,
            data: data.data,
        }
    } catch (error) {
        console.error('Payment verification error:', error)
        throw error
    }
}
