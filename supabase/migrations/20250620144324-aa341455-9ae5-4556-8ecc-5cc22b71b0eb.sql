
-- Check existing subcategories and only create missing ones with unique types, then insert all products
DO $$
DECLARE
    watch_category_id uuid;
    rolex_subcat_id uuid;
    patek_subcat_id uuid;
    cartier_subcat_id uuid;
    tag_heuer_subcat_id uuid;
BEGIN
    -- Get the "Relógios" category (it should exist)
    SELECT id INTO watch_category_id FROM categories WHERE name = 'Relógios';
    
    -- If category doesn't exist, create it
    IF watch_category_id IS NULL THEN
        INSERT INTO categories (name, value) VALUES ('Relógios', 'relogios') RETURNING id INTO watch_category_id;
    END IF;
    
    -- Get existing subcategories or create them only if they don't exist with unique types
    SELECT id INTO rolex_subcat_id FROM subcategories WHERE name = 'Rolex' AND category_id = watch_category_id;
    IF rolex_subcat_id IS NULL THEN
        INSERT INTO subcategories (name, type, category_id) VALUES ('Rolex', 'rolex', watch_category_id) RETURNING id INTO rolex_subcat_id;
    END IF;
    
    SELECT id INTO patek_subcat_id FROM subcategories WHERE name = 'Patek Philippe' AND category_id = watch_category_id;
    IF patek_subcat_id IS NULL THEN
        INSERT INTO subcategories (name, type, category_id) VALUES ('Patek Philippe', 'patek-philippe', watch_category_id) RETURNING id INTO patek_subcat_id;
    END IF;
    
    SELECT id INTO cartier_subcat_id FROM subcategories WHERE name = 'Cartier' AND category_id = watch_category_id;
    IF cartier_subcat_id IS NULL THEN
        INSERT INTO subcategories (name, type, category_id) VALUES ('Cartier', 'cartier', watch_category_id) RETURNING id INTO cartier_subcat_id;
    END IF;
    
    SELECT id INTO tag_heuer_subcat_id FROM subcategories WHERE name = 'Tag Heuer' AND category_id = watch_category_id;
    IF tag_heuer_subcat_id IS NULL THEN
        INSERT INTO subcategories (name, type, category_id) VALUES ('Tag Heuer', 'tag-heuer', watch_category_id) RETURNING id INTO tag_heuer_subcat_id;
    END IF;
    
    -- Now insert all the products
    INSERT INTO products (name, description, price, category_id, subcategory_id, published, featured, stock_quantity) VALUES
    -- Rolex products
    ('ROLEX DATEJUST 2024', 'Modelo 2024, faturado há 7 meses, acompanha todos os itens originais (completo) e possui caixa de 36mm.', 70000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DATEJUST 2025', 'Modelo 2025, confeccionado em aço e ouro, com mostrador cravejado de diamantes. Acompanha conjunto completo e mede 41mm.', 110000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DAYTONA PIKACHU 2024', 'Edição 2024, acompanha conjunto completo e tem 40mm de diâmetro.', 320000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DAYDATE EVEROSE 2024', 'Relógio modelo 2024, com mostrador em estilo ombré, conjunto completo e caixa de 40mm.', 394000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX PERPETUAL 2024', 'Modelo 2024 com mostrador rosa, acompanha kit completo e possui 31mm.', 44000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX SUBMARINER FULL GOLD 2024', 'Modelo de 2022, inteiramente em ouro (full gold), com mostrador e bezel na cor azul. Acompanha conjunto completo, com caixa de 40mm.', 255000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DATEJUST 2009', 'Modelo do ano de 2009 com mostrador prata (silver), acompanha conjunto completo e caixa de 36mm.', 45000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX 1908 PLATINA 2024', 'Modelo 2024 em platina, com kit completo e caixa de 39mm.', 545000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX PERPETUAL CELEBRATION 2023', 'Relógio de 2023, acompanha conjunto completo e possui caixa de 41mm.', 155000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DEEPSEA D BLUE 2022', 'Modelo de 2022, acompanha kit completo.', 89600.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX SUBMARINER DATE STARBUCKS 2023', 'Edição 2023 do modelo Submariner conhecido como "Starbucks", com caixa de 41mm e conjunto completo.', 95000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX GMT FULLGOLD 2023', 'Modelo 2023 inteiramente em ouro, acompanha conjunto completo.', 300000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX SUBMARINER NO DATE 2024', 'Submariner 2024, sem data, com caixa de 41mm e conjunto completo.', 73000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DATEJUST 2024 - Aço e Ouro Rosé', 'Versão em aço e ouro rosé, mostrador com diamantes, acompanha kit completo e caixa de 31mm.', 164000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DATEJUST 2024 - Diamantes 6 e 9', 'Modelo em aço e ouro rosé com mostrador decorado com diamantes nas posições 6 e 9, acompanha conjunto completo e mede 36mm.', 117000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DAYTONA 2023', 'Modelo 2023 em aço e ouro, completo e com caixa de 40mm.', 135000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX GMT BATGIRL 2024', 'Modelo 2024 conhecido como "Batgirl", acompanha conjunto completo e caixa de 40mm.', 114800.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX GMT 2023', 'Edição 2023 em aço e ouro rosé, acompanha conjunto completo e possui 40mm.', 126000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX YACHT-MASTER 2023', 'Modelo Yacht-Master de 2023, completo, com caixa de 40mm.', 89000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX GMT II 2019', 'Edição 2019 em aço, com conjunto completo e 40mm de diâmetro.', 85000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DAYTONA PIKACHU 2019', 'Modelo 2019 da linha Daytona "Pikachu", referência 116518LN, em ouro amarelo com pulseira de borracha. Movimento automático, mostrador champanhe, vidro de safira e estado impecável (como novo). Acompanha conjunto completo e possui 40mm.', 275000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DAYTONA PANDA 2024', 'Modelo 2024 da linha Daytona "Panda", com 40mm de diâmetro e conjunto completo.', 190000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX DAYDATE YELLOW GOLD 2025', 'Day-Date de 2025, referência 228238, com mostrador verde e algarismos romanos. Fabricado em ouro amarelo, em estado de novo e com movimento automático. Caixa de 40mm, vidro de safira e pulseira em ouro amarelo.', 370000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    ('ROLEX CELLINI DATE 2020', 'Modelo Cellini de 2020, referência 50515, com caixa em ouro e pulseira de couro. Mostrador preto, vidro de safira e movimento automático. Acompanha conjunto completo e está em excelente estado (sem sinais de uso).', 145000.00, watch_category_id, rolex_subcat_id, true, false, 1),
    
    -- Patek Philippe product
    ('PATEK PHILIPPE NAUTILUS 5990 2020', 'Modelo Nautilus 5990 de 2020, acompanha conjunto completo e possui 40mm de diâmetro.', 720000.00, watch_category_id, patek_subcat_id, true, false, 1),
    
    -- Cartier product
    ('CARTIER PASHA WHITE GOLD & DIAMOND', 'O Cartier Pasha HPI01392 é um relógio em ouro branco rodinado de 35mm, cravejado com 899 diamantes brilhantes no total, incluindo o aro, mostrador, pulseira e protetor de coroa. O movimento é automático calibre 530 MC, com ponteiros em aço azulado e cristal de safira. A pulseira possui fecho dobrável e o relógio tem resistência à água de até 30 metros.', 700000.00, watch_category_id, cartier_subcat_id, true, false, 1),
    
    -- Tag Heuer product
    ('TAG HEUER AQUARACER GMT 2024', 'Modelo 2024 da nova versão GMT da linha Aquaracer, acompanha conjunto completo.', 27500.00, watch_category_id, tag_heuer_subcat_id, true, false, 1);

END $$;
