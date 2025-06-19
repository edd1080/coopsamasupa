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
      application_drafts: {
        Row: {
          agent_id: string
          client_name: string | null
          created_at: string
          draft_data: Json
          id: string
          last_step: number | null
          last_sub_step: number | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          client_name?: string | null
          created_at?: string
          draft_data?: Json
          id: string
          last_step?: number | null
          last_sub_step?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          client_name?: string | null
          created_at?: string
          draft_data?: Json
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
          amount_requested: number
          client_name: string
          created_at: string
          current_stage: string | null
          draft_data: Json | null
          id: string
          is_draft: boolean | null
          product: string
          progress_step: number | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          amount_requested: number
          client_name: string
          created_at?: string
          current_stage?: string | null
          draft_data?: Json | null
          id: string
          is_draft?: boolean | null
          product: string
          progress_step?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          amount_requested?: number
          client_name?: string
          created_at?: string
          current_stage?: string | null
          draft_data?: Json | null
          id?: string
          is_draft?: boolean | null
          product?: string
          progress_step?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      prequalifications: {
        Row: {
          agent_id: string
          can_proceed: boolean | null
          client_dpi: string
          client_name: string
          client_phone: string | null
          created_at: string | null
          credit_history: string
          credit_purpose: string
          economic_activity: string
          evaluation_reason: string | null
          evaluation_result: Json
          evaluation_status: string
          id: string
          monthly_income: number
          requested_amount: number
          requires_additional_data: boolean | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          can_proceed?: boolean | null
          client_dpi: string
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          credit_history: string
          credit_purpose: string
          economic_activity: string
          evaluation_reason?: string | null
          evaluation_result?: Json
          evaluation_status: string
          id?: string
          monthly_income: number
          requested_amount: number
          requires_additional_data?: boolean | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          can_proceed?: boolean | null
          client_dpi?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          credit_history?: string
          credit_purpose?: string
          economic_activity?: string
          evaluation_reason?: string | null
          evaluation_result?: Json
          evaluation_status?: string
          id?: string
          monthly_income?: number
          requested_amount?: number
          requires_additional_data?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency: string | null
          created_at: string
          employee_id: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          agency?: string | null
          created_at?: string
          employee_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          agency?: string | null
          created_at?: string
          employee_id?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
