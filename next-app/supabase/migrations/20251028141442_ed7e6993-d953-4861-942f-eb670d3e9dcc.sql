-- Add index for calendar queries on availability_slots
CREATE INDEX IF NOT EXISTS idx_availability_slots_calendar 
ON availability_slots (service_key, date, zoho_response_status) 
WHERE zoho_response_status = 'success';