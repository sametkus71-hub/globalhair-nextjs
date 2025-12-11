export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      availability_slots: {
        Row: {
          created_at: string
          date: string
          error_message: string | null
          id: string
          last_synced_at: string
          service_key: string
          staff_id: string
          staff_name: string
          time_slots: Json
          zoho_response_status: string
        }
        Insert: {
          created_at?: string
          date: string
          error_message?: string | null
          id?: string
          last_synced_at?: string
          service_key: string
          staff_id: string
          staff_name: string
          time_slots?: Json
          zoho_response_status?: string
        }
        Update: {
          created_at?: string
          date?: string
          error_message?: string | null
          id?: string
          last_synced_at?: string
          service_key?: string
          staff_id?: string
          staff_name?: string
          time_slots?: Json
          zoho_response_status?: string
        }
        Relationships: []
      }
      booking_intents: {
        Row: {
          additional_fields: Json | null
          appointment_datetime_utc: string
          assigned_staff_name: string | null
          booking_notes: string | null
          confirmed_at: string | null
          created_at: string
          customer_address: string | null
          customer_city: string | null
          customer_country: string | null
          customer_email: string
          customer_first_name: string | null
          customer_last_name: string | null
          customer_name: string
          customer_phone: string
          duration_minutes: number
          error_message: string | null
          expires_at: string
          from_time: string
          id: string
          location: string
          price_euros: number
          selected_date: string
          selected_time: string
          service_type: string
          status: string
          stripe_payment_id: string | null
          stripe_session_id: string | null
          timezone: string
          to_time: string
          updated_at: string
          webhook_sent_at: string | null
          zoho_booking_id: string | null
          zoho_response: Json | null
          zoho_service_id: string
          zoho_staff_id: string
        }
        Insert: {
          additional_fields?: Json | null
          appointment_datetime_utc: string
          assigned_staff_name?: string | null
          booking_notes?: string | null
          confirmed_at?: string | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email: string
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_name: string
          customer_phone: string
          duration_minutes: number
          error_message?: string | null
          expires_at?: string
          from_time: string
          id?: string
          location: string
          price_euros: number
          selected_date: string
          selected_time: string
          service_type: string
          status?: string
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          timezone?: string
          to_time: string
          updated_at?: string
          webhook_sent_at?: string | null
          zoho_booking_id?: string | null
          zoho_response?: Json | null
          zoho_service_id: string
          zoho_staff_id: string
        }
        Update: {
          additional_fields?: Json | null
          appointment_datetime_utc?: string
          assigned_staff_name?: string | null
          booking_notes?: string | null
          confirmed_at?: string | null
          created_at?: string
          customer_address?: string | null
          customer_city?: string | null
          customer_country?: string | null
          customer_email?: string
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_name?: string
          customer_phone?: string
          duration_minutes?: number
          error_message?: string | null
          expires_at?: string
          from_time?: string
          id?: string
          location?: string
          price_euros?: number
          selected_date?: string
          selected_time?: string
          service_type?: string
          status?: string
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          timezone?: string
          to_time?: string
          updated_at?: string
          webhook_sent_at?: string | null
          zoho_booking_id?: string | null
          zoho_response?: Json | null
          zoho_service_id?: string
          zoho_staff_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      haaranalyse_jobs: {
        Row: {
          answers: Json | null
          created_at: string
          error: string | null
          finished_at: string | null
          image_urls: Json | null
          job_id: string
          language: string
          result: Json | null
          session_id: string | null
          status: string
        }
        Insert: {
          answers?: Json | null
          created_at?: string
          error?: string | null
          finished_at?: string | null
          image_urls?: Json | null
          job_id?: string
          language?: string
          result?: Json | null
          session_id?: string | null
          status?: string
        }
        Update: {
          answers?: Json | null
          created_at?: string
          error?: string | null
          finished_at?: string | null
          image_urls?: Json | null
          job_id?: string
          language?: string
          result?: Json | null
          session_id?: string | null
          status?: string
        }
        Relationships: []
      }
      intake_image_uploads: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          image_type: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          image_type: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          image_type?: string
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          after_image_url: string | null
          before_image_url: string | null
          behandeling: string
          created_at: string
          description: string
          id: string
          is_featured: boolean
          is_visible: boolean
          name: string
          review_type: Database["public"]["Enums"]["review_type"]
          static_image_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          after_image_url?: string | null
          before_image_url?: string | null
          behandeling: string
          created_at?: string
          description: string
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          name: string
          review_type: Database["public"]["Enums"]["review_type"]
          static_image_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          after_image_url?: string | null
          before_image_url?: string | null
          behandeling?: string
          created_at?: string
          description?: string
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          name?: string
          review_type?: Database["public"]["Enums"]["review_type"]
          static_image_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          api_calls_made: number | null
          api_errors_count: number | null
          days_available: number | null
          days_checked: number | null
          error_message: string | null
          id: string
          rate_limit_errors_count: number | null
          service_key: string
          status: string
          sync_completed_at: string | null
          sync_started_at: string
          total_slots_fetched: number | null
        }
        Insert: {
          api_calls_made?: number | null
          api_errors_count?: number | null
          days_available?: number | null
          days_checked?: number | null
          error_message?: string | null
          id?: string
          rate_limit_errors_count?: number | null
          service_key: string
          status?: string
          sync_completed_at?: string | null
          sync_started_at?: string
          total_slots_fetched?: number | null
        }
        Update: {
          api_calls_made?: number | null
          api_errors_count?: number | null
          days_available?: number | null
          days_checked?: number | null
          error_message?: string | null
          id?: string
          rate_limit_errors_count?: number | null
          service_key?: string
          status?: string
          sync_completed_at?: string | null
          sync_started_at?: string
          total_slots_fetched?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_tracking: {
        Row: {
          sent_at: string | null
          session_id: string
          webhook_error: string | null
          webhook_sent_at: string | null
          webhook_status: string | null
        }
        Insert: {
          sent_at?: string | null
          session_id: string
          webhook_error?: string | null
          webhook_sent_at?: string | null
          webhook_status?: string | null
        }
        Update: {
          sent_at?: string | null
          session_id?: string
          webhook_error?: string | null
          webhook_sent_at?: string | null
          webhook_status?: string | null
        }
        Relationships: []
      }
      zoho_tokens: {
        Row: {
          access_token: string
          expires_at: string
          id: string
          updated_at: string
        }
        Insert: {
          access_token: string
          expires_at: string
          id?: string
          updated_at?: string
        }
        Update: {
          access_token?: string
          expires_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_booking_intents: { Args: never; Returns: undefined }
      cleanup_old_haaranalyse_jobs: { Args: never; Returns: undefined }
      cleanup_old_intake_images: { Args: never; Returns: undefined }
      cleanup_webhook_tracking: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "admin"
      review_type: "video" | "before_after" | "static_image"
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
      app_role: ["admin"],
      review_type: ["video", "before_after", "static_image"],
    },
  },
} as const
