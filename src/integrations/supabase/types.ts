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
      application_drafts: {
        Row: {
          agent_id: string
          client_name: string | null
          created_at: string
          draft_data: Json | null
          id: string
          last_step: number | null
          last_sub_step: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          client_name?: string | null
          created_at?: string
          draft_data?: Json | null
          id?: string
          last_step?: number | null
          last_sub_step?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          client_name?: string | null
          created_at?: string
          draft_data?: Json | null
          id?: string
          last_step?: number | null
          last_sub_step?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          agent_id: string
          amount_requested: number | null
          client_name: string
          coopsama_external_reference_id: string | null
          coopsama_operation_id: string | null
          coopsama_process_id: string | null
          coopsama_sync_error: string | null
          coopsama_sync_status: string | null
          coopsama_synced_at: string | null
          created_at: string
          current_stage: string | null
          draft_data: Json | null
          id: string
          official_data: Json | null
          product: string | null
          progress_step: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount_requested?: number | null
          client_name: string
          coopsama_external_reference_id?: string | null
          coopsama_operation_id?: string | null
          coopsama_process_id?: string | null
          coopsama_sync_error?: string | null
          coopsama_sync_status?: string | null
          coopsama_synced_at?: string | null
          created_at?: string
          current_stage?: string | null
          draft_data?: Json | null
          id?: string
          official_data?: Json | null
          product?: string | null
          progress_step?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount_requested?: number | null
          client_name?: string
          coopsama_external_reference_id?: string | null
          coopsama_operation_id?: string | null
          coopsama_process_id?: string | null
          coopsama_sync_error?: string | null
          coopsama_sync_status?: string | null
          coopsama_synced_at?: string | null
          created_at?: string
          current_stage?: string | null
          draft_data?: Json | null
          id?: string
          official_data?: Json | null
          product?: string | null
          progress_step?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prequalifications: {
        Row: {
          agent_id: string
          can_proceed: boolean | null
          client_dpi: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          credit_history: string | null
          credit_purpose: string | null
          economic_activity: string | null
          evaluation_reason: string | null
          evaluation_result: Json | null
          evaluation_status: string | null
          id: string
          monthly_income: number | null
          requested_amount: number | null
          requires_additional_data: boolean | null
        }
        Insert: {
          agent_id: string
          can_proceed?: boolean | null
          client_dpi?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          credit_history?: string | null
          credit_purpose?: string | null
          economic_activity?: string | null
          evaluation_reason?: string | null
          evaluation_result?: Json | null
          evaluation_status?: string | null
          id?: string
          monthly_income?: number | null
          requested_amount?: number | null
          requires_additional_data?: boolean | null
        }
        Update: {
          agent_id?: string
          can_proceed?: boolean | null
          client_dpi?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          credit_history?: string | null
          credit_purpose?: string | null
          economic_activity?: string | null
          evaluation_reason?: string | null
          evaluation_result?: Json | null
          evaluation_status?: string | null
          id?: string
          monthly_income?: number | null
          requested_amount?: number | null
          requires_additional_data?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          tenant: Database["public"]["Enums"]["app_tenant"]
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          tenant?: Database["public"]["Enums"]["app_tenant"]
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          tenant?: Database["public"]["Enums"]["app_tenant"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_role: {
        Args: { new_role: string; target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_tenant: "coopsama" | "cosmos" | "cch" | "ptc"
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
      app_tenant: ["coopsama", "cosmos", "cch", "ptc"],
    },
  },
} as const
