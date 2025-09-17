-- Fix critical security vulnerability: Prevent users from escalating their own roles
-- Drop the existing policy that allows unrestricted profile updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a new policy that prevents role escalation
CREATE POLICY "Users can update their own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Create a security definer function for admin role management
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role text;
BEGIN
  -- Get the current user's role
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Only admins can update roles
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Insufficient privileges to update user roles';
  END IF;
  
  -- Update the target user's role
  UPDATE public.profiles 
  SET role = new_role::text, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the role change for audit purposes
  INSERT INTO auth.audit_log_entries (
    instance_id,
    id,
    payload,
    created_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    jsonb_build_object(
      'action', 'role_updated',
      'admin_id', auth.uid(),
      'target_user_id', target_user_id,
      'new_role', new_role,
      'timestamp', now()
    ),
    now()
  );
END;
$$;