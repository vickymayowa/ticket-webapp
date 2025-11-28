import { getSupabaseClient } from '@/lib/supabase'

export async function uploadEventImage(file: File): Promise<string | null> {
    try {
        const supabase = getSupabaseClient()

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
        const filePath = `events/${fileName}`

        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
            .from('event-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.log('Upload error:', error)
            return null
        }

        // Ensure data is valid before proceeding
        if (!data) {
            console.log('Upload succeeded but no data returned')
            return null
        }

        // Get public URL
        const { data: urlData, error: urlError } = await supabase.storage
            .from('event-images')
            .getPublicUrl(filePath)

        if (urlError) {
            console.log('Error getting public URL:', urlError)
            return null
        }

        if (!urlData?.publicUrl) {
            console.log('Public URL is missing')
            return null
        }

        console.log('Public URL:', urlData.publicUrl)
        return urlData.publicUrl
    } catch (error) {
        console.log('Error uploading image:', error)
        return null
    }
}
