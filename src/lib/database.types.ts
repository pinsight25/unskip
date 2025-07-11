
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accessories: {
        Row: {
          additional_info: string | null
          availability: Database["public"]["Enums"]["availability_status"] | null
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
          availability?: Database["public"]["Enums"]["availability_status"] | null
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
          availability?: Database["public"]["Enums"]["availability_status"] | null
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
          service_center_type: Database["public"]["Enums"]["service_center_type"] | null
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
          service_center_type?: Database["public"]["Enums"]["service_center_type"] | null
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
          service_center_type?: Database["public"]["Enums"]["service_center_type"] | null
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
      get_user_listing_stats: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_cars: number
          active_cars: number
          total_accessories: number
          active_accessories: number
          total_views: number
        }[]
      }
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
      fuel_type: "Petrol" | "Diesel" | "Electric" | "Hybrid"
      gender_type: "Male" | "Female" | "Other"
      insurance_type: "Comprehensive" | "Third Party"
      listing_status: "active" | "sold" | "inactive"
      service_center_type: "Authorized" | "Local Garage"
      transmission_type: "Manual" | "Automatic"
      user_type: "regular" | "premium" | "dealer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
