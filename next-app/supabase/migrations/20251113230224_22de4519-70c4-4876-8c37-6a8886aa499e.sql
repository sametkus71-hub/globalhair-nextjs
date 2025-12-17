-- Grant admin role to Peter@globalhair.nl
INSERT INTO public.user_roles (user_id, role)
VALUES ('72f2f113-e694-4909-87c6-8a070c1dc87a', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;