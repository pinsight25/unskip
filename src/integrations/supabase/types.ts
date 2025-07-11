export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accessories: {
        Row: {
          additional_info: string | null
          availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          brand: string
          category: Database["public"]["Enums"]["accessory_category"]
          compatibility: string[] | null
          condition: string
          created_at: string | null
          description: string
          email: string | null
          featured: boolean | null
          id: string
          installation_available: boolean | null
          location: string
          name: string
          phone: string
          phone_verified: boolean | null
          price_max: number | null
          price_min: number
          seller_id: string
          seller_name: string
          status: Database["public"]["Enums"]["listing_status"] | null
          updated_at: string | null
          verified_seller: boolean | null
          views: number | null
          warranty: string | null
          whatsapp_contact: boolean | null
        }
        Insert: {
          additional_info?: string | null
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          brand: string
          category: Database["public"]["Enums"]["accessory_category"]
          compatibility?: string[] | null
          condition: string
          created_at?: string | null
          description: string
          email?: string | null
          featured?: boolean | null
          id?: string
          installation_available?: boolean | null
          location: string
          name: string
          phone: string
          phone_verified?: boolean | null
          price_max?: number | null
          price_min: number
          seller_id: string
          seller_name: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          updated_at?: string | null
          verified_seller?: boolean | null
          views?: number | null
          warranty?: string | null
          whatsapp_contact?: boolean | null
        }
        Update: {
          additional_info?: string | null
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          brand?: string
          category?: Database["public"]["Enums"]["accessory_category"]
          compatibility?: string[] | null
          condition?: string
          created_at?: string | null
          description?: string
          email?: string | null
          featured?: boolean | null
          id?: string
          installation_available?: boolean | null
          location?: string
          name?: string
          phone?: string
          phone_verified?: boolean | null
          price_max?: number | null
          price_min?: number
          seller_id?: string
          seller_name?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          updated_at?: string | null
          verified_seller?: boolean | null
          views?: number | null
          warranty?: string | null
          whatsapp_contact?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "accessories_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      accessory_images: {
        Row: {
          accessory_id: string
          id: string
          image_url: string
          sort_order: number | null
          uploaded_at: string | null
        }
        Insert: {
          accessory_id: string
          id?: string
          image_url: string
          sort_order?: number | null
          uploaded_at?: string | null
        }
        Update: {
          accessory_id?: string
          id?: string
          image_url?: string
          sort_order?: number | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accessory_images_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "accessories"
            referencedColumns: ["id"]
          },
        ]
      }
      car_images: {
        Row: {
          car_id: string
          id: string
          image_url: string
          is_cover: boolean | null
          sort_order: number | null
          uploaded_at: string | null
        }
        Insert: {
          car_id: string
          id?: string
          image_url: string
          is_cover?: boolean | null
          sort_order?: number | null
          uploaded_at?: string | null
        }
        Update: {
          car_id?: string
          id?: string
          image_url?: string
          is_cover?: boolean | null
          sort_order?: number | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      car_makes: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      car_models: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          make_id: string
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          make_id: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          make_id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "car_models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "car_makes"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          accept_offers: boolean | null
          address: string | null
          area: string | null
          authorized_service_center: boolean | null
          city: string
          color: string | null
          created_at: string | null
          daily_rate: number | null
          description: string | null
          featured: boolean | null
          fitness_certificate_valid_till: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          insurance_type: Database["public"]["Enums"]["insurance_type"] | null
          insurance_valid: boolean | null
          insurance_valid_till: string | null
          is_rent_available: boolean | null
          kilometers_driven: number
          landmark: string | null
          last_service_date: string | null
          make: string
          model: string
          no_accident_history: boolean | null
          number_of_owners: number
          offer_percentage: number | null
          price: number
          registration_state: string | null
          registration_year: number | null
          rto_transfer_support: boolean | null
          seating_capacity: number | null
          security_deposit: number | null
          seller_id: string
          service_center_type:
            | Database["public"]["Enums"]["service_center_type"]
            | null
          service_history: boolean | null
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string | null
          transmission: Database["public"]["Enums"]["transmission_type"]
          updated_at: string | null
          variant: string | null
          verified: boolean | null
          views: number | null
          weekly_rate: number | null
          year: number
        }
        Insert: {
          accept_offers?: boolean | null
          address?: string | null
          area?: string | null
          authorized_service_center?: boolean | null
          city: string
          color?: string | null
          created_at?: string | null
          daily_rate?: number | null
          description?: string | null
          featured?: boolean | null
          fitness_certificate_valid_till?: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          insurance_type?: Database["public"]["Enums"]["insurance_type"] | null
          insurance_valid?: boolean | null
          insurance_valid_till?: string | null
          is_rent_available?: boolean | null
          kilometers_driven: number
          landmark?: string | null
          last_service_date?: string | null
          make: string
          model: string
          no_accident_history?: boolean | null
          number_of_owners: number
          offer_percentage?: number | null
          price: number
          registration_state?: string | null
          registration_year?: number | null
          rto_transfer_support?: boolean | null
          seating_capacity?: number | null
          security_deposit?: number | null
          seller_id: string
          service_center_type?:
            | Database["public"]["Enums"]["service_center_type"]
            | null
          service_history?: boolean | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string | null
          transmission: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string | null
          variant?: string | null
          verified?: boolean | null
          views?: number | null
          weekly_rate?: number | null
          year: number
        }
        Update: {
          accept_offers?: boolean | null
          address?: string | null
          area?: string | null
          authorized_service_center?: boolean | null
          city?: string
          color?: string | null
          created_at?: string | null
          daily_rate?: number | null
          description?: string | null
          featured?: boolean | null
          fitness_certificate_valid_till?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          insurance_type?: Database["public"]["Enums"]["insurance_type"] | null
          insurance_valid?: boolean | null
          insurance_valid_till?: string | null
          is_rent_available?: boolean | null
          kilometers_driven?: number
          landmark?: string | null
          last_service_date?: string | null
          make?: string
          model?: string
          no_accident_history?: boolean | null
          number_of_owners?: number
          offer_percentage?: number | null
          price?: number
          registration_state?: string | null
          registration_year?: number | null
          rto_transfer_support?: boolean | null
          seating_capacity?: number | null
          security_deposit?: number | null
          seller_id?: string
          service_center_type?:
            | Database["public"]["Enums"]["service_center_type"]
            | null
          service_history?: boolean | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string | null
          transmission?: Database["public"]["Enums"]["transmission_type"]
          updated_at?: string | null
          variant?: string | null
          verified?: boolean | null
          views?: number | null
          weekly_rate?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "cars_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          content: string
          created_at: string | null
          id: string
          message_type: Database["public"]["Enums"]["message_type"] | null
          receiver_id: string
          seen: boolean | null
          sender_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          receiver_id: string
          seen?: boolean | null
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"] | null
          receiver_id?: string
          seen?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          accessory_id: string | null
          buyer_id: string
          car_id: string | null
          created_at: string | null
          id: string
          last_message_id: string | null
          seller_id: string
          status: Database["public"]["Enums"]["chat_status"] | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          accessory_id?: string | null
          buyer_id: string
          car_id?: string | null
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["chat_status"] | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          accessory_id?: string | null
          buyer_id?: string
          car_id?: string | null
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["chat_status"] | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_chats_last_message"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dealer_documents: {
        Row: {
          dealer_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string | null
          file_url: string
          id: string
          upload_date: string | null
        }
        Insert: {
          dealer_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name?: string | null
          file_url: string
          id?: string
          upload_date?: string | null
        }
        Update: {
          dealer_id?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string | null
          file_url?: string
          id?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_documents_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealers"
            referencedColumns: ["id"]
          },
        ]
      }
      dealers: {
        Row: {
          brands_deal_with: string[] | null
          business_category: string | null
          business_name: string
          closing_time: string | null
          contact_person: string
          created_at: string | null
          establishment_year: number | null
          google_maps_link: string | null
          gst_number: string | null
          id: string
          is_24x7: boolean | null
          member_since: string | null
          opening_time: string | null
          pincode: string | null
          shop_address: string
          slug: string
          specialization: string | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website_url: string | null
        }
        Insert: {
          brands_deal_with?: string[] | null
          business_category?: string | null
          business_name: string
          closing_time?: string | null
          contact_person: string
          created_at?: string | null
          establishment_year?: number | null
          google_maps_link?: string | null
          gst_number?: string | null
          id?: string
          is_24x7?: boolean | null
          member_since?: string | null
          opening_time?: string | null
          pincode?: string | null
          shop_address: string
          slug: string
          specialization?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website_url?: string | null
        }
        Update: {
          brands_deal_with?: string[] | null
          business_category?: string | null
          business_name?: string
          closing_time?: string | null
          contact_person?: string
          created_at?: string | null
          establishment_year?: number | null
          google_maps_link?: string | null
          gst_number?: string | null
          id?: string
          is_24x7?: boolean | null
          member_since?: string | null
          opening_time?: string | null
          pincode?: string | null
          shop_address?: string
          slug?: string
          specialization?: string | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          amount: number
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          car_id: string
          created_at: string | null
          id: string
          message: string | null
          seller_id: string
          status: Database["public"]["Enums"]["offer_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          car_id: string
          created_at?: string | null
          id?: string
          message?: string | null
          seller_id: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string
          buyer_name?: string
          buyer_phone?: string
          car_id?: string
          created_at?: string | null
          id?: string
          message?: string | null
          seller_id?: string
          status?: Database["public"]["Enums"]["offer_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_replies: {
        Row: {
          category: Database["public"]["Enums"]["reply_category"]
          created_at: string | null
          id: string
          text: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["reply_category"]
          created_at?: string | null
          id?: string
          text: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["reply_category"]
          created_at?: string | null
          id?: string
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_drive_bookings: {
        Row: {
          alternate_phone: string | null
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          car_id: string
          chat_id: string
          created_at: string | null
          id: string
          scheduled_date: string
          seller_id: string
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          time_slot: string
        }
        Insert: {
          alternate_phone?: string | null
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          car_id: string
          chat_id: string
          created_at?: string | null
          id?: string
          scheduled_date: string
          seller_id: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot: string
        }
        Update: {
          alternate_phone?: string | null
          buyer_id?: string
          buyer_name?: string
          buyer_phone?: string
          car_id?: string
          chat_id?: string
          created_at?: string | null
          id?: string
          scheduled_date?: string
          seller_id?: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_drive_bookings_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_drive_bookings_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_drive_bookings_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_drive_bookings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_listings_count: {
        Row: {
          active_accessory_listings: number | null
          active_car_listings: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_accessory_listings?: number | null
          active_car_listings?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_accessory_listings?: number | null
          active_car_listings?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_listings_count_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          city: string | null
          created_at: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_verified: boolean | null
          name: string
          phone: string
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_verified?: boolean | null
          name: string
          phone: string
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_verified?: boolean | null
          name?: string
          phone?: string
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      accessory_category:
        | "alloy-wheels"
        | "seat-covers"
        | "floor-mats"
        | "mobile-holders"
        | "dash-cameras"
        | "led-lights"
        | "car-perfumes"
        | "steering-covers"
        | "infotainment"
        | "parking-sensors"
      availability_status: "in-stock" | "order" | "out-of-stock"
      booking_status:
        | "pending"
        | "approved"
        | "rejected"
        | "completed"
        | "cancelled"
      chat_status: "active" | "blocked" | "archived"
      document_type: "gst_certificate" | "shop_license" | "shop_photo"
      fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid"
      gender_type: "Male" | "Female" | "Other"
      insurance_type: "Comprehensive" | "Third Party"
      listing_status: "active" | "sold" | "inactive"
      message_type: "text" | "system" | "test_drive"
      offer_status: "pending" | "accepted" | "rejected"
      reply_category: "general" | "price" | "meeting" | "documents"
      service_center_type: "Authorized" | "Local Garage"
      transmission_type: "Manual" | "Automatic"
      user_type: "regular" | "premium" | "dealer"
      verification_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accessory_category: [
        "alloy-wheels",
        "seat-covers",
        "floor-mats",
        "mobile-holders",
        "dash-cameras",
        "led-lights",
        "car-perfumes",
        "steering-covers",
        "infotainment",
        "parking-sensors",
      ],
      availability_status: ["in-stock", "order", "out-of-stock"],
      booking_status: [
        "pending",
        "approved",
        "rejected",
        "completed",
        "cancelled",
      ],
      chat_status: ["active", "blocked", "archived"],
      document_type: ["gst_certificate", "shop_license", "shop_photo"],
      fuel_type: ["Petrol", "Diesel", "Electric", "Hybrid"],
      gender_type: ["Male", "Female", "Other"],
      insurance_type: ["Comprehensive", "Third Party"],
      listing_status: ["active", "sold", "inactive"],
      message_type: ["text", "system", "test_drive"],
      offer_status: ["pending", "accepted", "rejected"],
      reply_category: ["general", "price", "meeting", "documents"],
      service_center_type: ["Authorized", "Local Garage"],
      transmission_type: ["Manual", "Automatic"],
      user_type: ["regular", "premium", "dealer"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
