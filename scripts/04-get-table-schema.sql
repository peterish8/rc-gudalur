-- Get all tables and their columns in your Supabase database
-- Run this in your Supabase SQL Editor

-- Option 1: Get all tables with their columns (detailed view)
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'YES'
        ELSE 'NO'
    END AS is_primary_key
FROM 
    information_schema.tables t
    INNER JOIN information_schema.columns c 
        ON t.table_name = c.table_name
        AND t.table_schema = c.table_schema
    LEFT JOIN (
        SELECT 
            ku.table_name,
            ku.column_name
        FROM 
            information_schema.table_constraints tc
            INNER JOIN information_schema.key_column_usage ku
                ON tc.constraint_name = ku.constraint_name
                AND tc.table_schema = ku.table_schema
        WHERE 
            tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = 'public'
    ) pk 
        ON c.table_name = pk.table_name
        AND c.column_name = pk.column_name
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
ORDER BY 
    t.table_name,
    c.ordinal_position;

-- Option 2: Simple view - Just table names and column names
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name,
    ordinal_position;

-- Option 3: Get only table names
SELECT 
    table_name
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY 
    table_name;

-- Option 4: Get columns for a specific table (replace 'events' with your table name)
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'events'
ORDER BY 
    ordinal_position;

-- Option 5: Get table structure in CREATE TABLE format (useful for documentation)
SELECT 
    'CREATE TABLE ' || table_name || ' (' || 
    string_agg(
        column_name || ' ' || 
        data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' AS create_statement
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
GROUP BY 
    table_name
ORDER BY 
    table_name;

