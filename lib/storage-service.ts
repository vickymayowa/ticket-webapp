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
        console.log(data)
        if (error) {
            console.log('Upload error:', error)
            return null
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('event-images')
            .getPublicUrl(filePath)
        console.log('Public URL:', publicUrl)
        return publicUrl
    } catch (error) {
        console.log('Error uploading image:', error)
        return null
    }
}
