-- ====================================================================
-- 💖 DİJİTAL ZAMAN KAPSÜLÜ - SUPABASE VERİTABANI ŞEMASI (schema.sql) 💖
-- ====================================================================
-- Bu SQL kodunu Supabase Dashboard -> SQL Editor kısmına yapıştırıp "Run" butonuna basınız.

-- 1. Kapsüller Tablosu
CREATE TABLE IF NOT EXISTS public.capsules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'open', -- 'open', 'question', 'time'
    category TEXT DEFAULT 'Özel Anı',
    icon TEXT DEFAULT 'heart',
    cover_image TEXT,
    date_label TEXT DEFAULT 'Özel Gün',
    summary TEXT,
    question TEXT,
    answers JSONB DEFAULT '[]'::jsonb,
    hint TEXT,
    target_date TIMESTAMPTZ,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    author TEXT NOT NULL DEFAULT 'partner1', -- 'partner1' veya 'partner2'
    author_name TEXT NOT NULL DEFAULT 'Oğuzhan',
    target_user TEXT NOT NULL DEFAULT 'both', -- 'both' (ikimiz) veya 'partner' (sevgiliye sürpriz)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Beğeni / Kalp Tepkileri Tablosu
CREATE TABLE IF NOT EXISTS public.capsule_reactions (
    capsule_id TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0,
    liked_by JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ortak Hayal Listesi (Bucket List) Tablosu
CREATE TABLE IF NOT EXISTS public.bucket_list (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Genel',
    note TEXT,
    target_date TEXT,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    completed_by TEXT, -- 'partner1' veya 'partner2'
    completed_by_name TEXT,
    photo_url TEXT,
    author TEXT NOT NULL DEFAULT 'partner1',
    author_name TEXT NOT NULL DEFAULT 'Oğuzhan',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Row Level Security (RLS) Etkinleştirme & Anonim Okuma/Yazma İzni
ALTER TABLE public.capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capsule_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucket_list ENABLE ROW LEVEL SECURITY;

-- Herkesin (çiftin anon anahtarıyla) okuma ve yazma izni
DROP POLICY IF EXISTS "Public capsules access" ON public.capsules;
CREATE POLICY "Public capsules access" ON public.capsules
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public reactions access" ON public.capsule_reactions;
CREATE POLICY "Public reactions access" ON public.capsule_reactions
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public bucket_list access" ON public.bucket_list;
CREATE POLICY "Public bucket_list access" ON public.bucket_list
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. Gerçek Zamanlı (Realtime) Bildirimleri Etkinleştirme
ALTER PUBLICATION supabase_realtime ADD TABLE public.capsules;
ALTER PUBLICATION supabase_realtime ADD TABLE public.capsule_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bucket_list;
