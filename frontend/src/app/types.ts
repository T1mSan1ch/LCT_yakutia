export interface Dataset {
    id: number
    name: string
    comment?: string
    created_at: Date

    client_count: number
    text_count: number

    bad_count: number
    good_count: number
    left_count: number
}

export interface ChannelInfo {
    id: number,
    name: string,
    description: string
}

export interface ProductInfo {
    id: number,
    name: string,
    description: string
}

interface Text {
    id: number

    text: string

    temp: number
    top_p: number

    is_good: boolean | null

    client_id: number
    product_id: number
    channel_id: number

}

export interface ClientWithTexts {
    id: number,
    
    texts: Text[]
}