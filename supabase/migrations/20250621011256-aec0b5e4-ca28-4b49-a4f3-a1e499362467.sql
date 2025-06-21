
-- Inserir novos produtos automotivos únicos na categoria Veículos
-- Categoria ID: 21d928cb-22b5-440b-b949-a7ac226dd422

INSERT INTO public.products (
  name, 
  description, 
  price, 
  sale_price, 
  category_id, 
  subcategory_id, 
  attribute_id, 
  published, 
  featured, 
  stock_quantity
) VALUES 
-- Produtos Porsche
('PORSCHE 911 TURBO 2023', 'Veículo premium com preço disponível mediante consulta. Modelo 2023 com características de alto desempenho e tecnologia avançada.', 1550000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 TURBO S', 'Ano: 2020/2021. Cor: Lava Orange. Motor 3.7 biturbo com 641 HP. 8.000 km rodados. 4 lugares. Interior em couro marrom trufa. Sistema de som Burmester. Freios em carbono e cerâmica. Rodas aro 20 e 21 de cubo rápido.', 1329000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE S COUPÉ 2024', 'Ano: 2023/2024. Cor: Azul Montego. Motor V8 4.0 biturbo com 467 HP. 6.700 km rodados. 5 lugares. Interior em couro total preto. Sistema de som Bose. Pacote Sport Design. Rodas aro 22 pretas e diamantadas.', 900000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE E-HYBRID 2020', 'Ano: 2020/2020. Cor: Cinza. Motor híbrido com 455 HP. 30.700 km rodados. 5 lugares. Interior em couro preto com detalhes em preto brilhante. Suspensão pneumática. Sport Chrono. Rodas RS Spider em preto brilhante.', 460000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE BOXTER', 'Ano: 2013/2013. Cor: GT Silver. Motor 2.7 com 261 HP. 33.900 km rodados. 2 lugares. Interior em couro cinza claro. Capota vermelho bordô. Volante sport design. Rodas aro 20 classic grafite e diamantadas.', 360000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA 4 E-HYBRID SPORT TURISMO', 'Ano: 2023/2023. Cor: Marrom Trufa Metálico. Motor híbrido com 325 HP. 1.200 km rodados. 5 lugares. Interior bicolor em couro bege Luxor e preto. Sistema de som Bose. Pacote Sport Design. Rodas aro 21.', 690000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA 4 E-HYBRID PLATINUM EDITION', 'Ano: 2023/2023. Cor: Verde Aventurini. Motor híbrido com 455 HP. 4.000 km rodados. 5 lugares. Interior em couro Club marrom Cohiba. Sistema de som Bose. Sistema de escapamento esportivo. Rodas Panamera Sport Design pretas e diamantadas.', 700000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN GTS', 'Ano: 2023/2024. Cor: Giz. Motor 2.9 V6 biturbo com 433 HP. 6.200 km rodados. 5 lugares. Interior em Alcântara preto com costuras em giz. Sistema de som Burmester. Pacote Sport Design. Pacote interior GTS.', 750000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN 2025', 'Modelo 2025 com preço disponível mediante consulta. Veículo premium da linha Porsche Macan, conhecido por seu desempenho e tecnologia de ponta.', 550000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA E-HYBRID 4 2022', 'Ano: 2022. Quilometragem: 15.000 km. Veículo híbrido da linha Panamera com tecnologia avançada de motorização combinada e acabamento premium característico da marca Porsche.', 699900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA E-HYBRID 4 SPORT TURISMO 2022', 'Modelo 2022 da linha Sport Turismo com motorização híbrida, oferecendo combinação de performance esportiva e eficiência energética em um design wagon premium.', 699800.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE TAYCAN 2022', 'Ano 2022 com 23.000 km rodados, veículo elétrico. Air bag duplo, alarme, ar condicionado digital, banco bi-partido, bancos de couro com aquecimento, volante com comandos, computador de bordo, controle de velocidade, estabilidade e tração, desembaçador traseiro, direção elétrica, freio ABS, GPS, kit multimídia, retrovisores elétricos, sensor de estacionamento, teto solar, travas e vidros elétricos, volante com regulagem de altura.', 529900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE 3.0 V6 E-HYBRID PLATINUM EDITION AWD TIPTRONIC S 2022', 'Ano 2022, versão 3.0 V6 E-Hybrid Platinum Edition AWD Tiptronic S com 11.670 km, combustível gasolina e elétrico. Equipado com air bags, alarme, ar condicionado digital, bancos dianteiros com aquecimento, volante com comando de áudio e telefone, computador de bordo, controle automático de velocidade, direção hidráulica, farol de neblina, freio ABS, GPS, kit multimídia, sensor de estacionamento, teto solar, tração 4x4, travas e vidros elétricos.', 629900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA 2.9 V6 E-HYBRID 4 SPORT TURISMO 2023', 'Ano 2023, versão 2.9 V6 E-Hybrid 4 Sport Turismo PDK com 4.100 km. Air bag duplo, alarme, ar condicionado digital, bancos de couro com ajuste de altura, bancos dianteiros aquecidos, volante multifuncional, computador de bordo, controle de estabilidade e tração, direção elétrica, freio ABS, GPS, sensor de estacionamento, rodas de liga leve, teto solar, tração 4x4, travas e vidros elétricos.', 729900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN S 2020', 'Ano 2019/2020, versão 3.0 S 24V V6 gasolina automático com 42.657 km. Air bags, alarme, ar condicionado digital, bancos de couro, retrofit multimídia, controle de estabilidade, tração 4x4, freio ABS, GPS, sensor de estacionamento, rodas de liga leve, teto solar, travas elétricas e volante com regulagem de altura.', 399000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE E-HYBRID COUPÉ S 2021', 'Ano 2021, versão 3.0 V6 E-Hybrid Coupé AWD Tiptronic S com 34.500 km. Combustível gasolina e elétrico. Equipado com ar condicionado digital, bancos de couro com aquecimento, comando de áudio no volante, computador de bordo, controle de estabilidade, direção hidráulica, farol de neblina, freio ABS, GPS, sensor de estacionamento, teto solar, tração 4x4, rodas de liga leve, travas e vidros elétricos.', 599900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 TURBO S 2021', 'Ano 2021, com 19.900 km. Motor 3.8 litros biturbo de 6 cilindros horizontais com mais de 640 cv, câmbio PDK de dupla embreagem e tração integral. Aceleração de 0 a 100 km/h em 2,7 segundos. Interior premium com bancos esportivos em couro, pacote Sport Chrono, central multimídia, sistema de som Bose, teto solar, rodas exclusivas, freios cerâmicos e assistências eletrônicas avançadas. Veículo impecável, manutenção em dia e procedência garantida.', 1400000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 718 CAYMAN STYLE EDITION 2024', 'Ano: 2023/2024. Versão: 2.0 16V H4 GASOLINA CAYMAN STYLE EDITION PDK. Câmbio: Automático. Portas: 2. Combustível: Gasolina. Quilometragem: 2.000 km. Opcionais: Air bag do motorista, Air bag duplo, Alarme, Ar condicionado digital, Banco do motorista com ajuste de altura, Bancos de couro, Comando de áudio e telefone no volante, Computador de bordo, Controle automático de velocidade, Controle de estabilidade, Controle de tração, Desembaçador traseiro, Direção Elétrica, Distribuição eletrônica de frenagem, Freio ABS, GPS, Kit Multimídia, Pára-choques na cor do veículo, Retrovisor fotocrômico, Retrovisores elétricos, Rodas de liga leve, Sensor de estacionamento, Travas elétricas, Vidros elétricos, Volante com Regulagem de Altura. Observações adicionais: Carro com procedência e garantia. Aceitamos trocas mediante avaliação.', 589900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN 2.0 TURBO 2022', 'Ano: 2022/2022. Quilometragem: 19.000 km. Motor: 2.0 Turbo com 261 HP. Capacidade: 5 lugares. Interior preto/giz. Sem retoques estéticos. Equipamentos: Sport Chrono, Chave Presencial, Piloto automático, Paddle Shift.', 450000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA S 2020', 'Kit GT3. Quilometragem: 14.000 km. Veículo esportivo de alto desempenho com modificações especiais no estilo GT3, proporcionando experiência de condução única e performance elevada.', 849900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN 2.0 TURBO 2023', 'Quilometragem: 19.000 km. Mais de R$ 100 mil em opcionais. Tração integral, Sistema Start-Stop, Pacote Sport Chrono, Direção assistida Plus, Motor 2.0 Turbo de 265 cv, Câmbio PDK de 7 marchas, Rodas 21" 911 Turbo Design, Ponteiras esportivas em prata, Teto solar panorâmico elétrico, Cortinas antitérmicas manuais, Navegador GPS com HD interno, Sistema de som BOSE® Surround, Ventilação dos bancos dianteiros, Bancos esportivos elétricos (18 vias), Aquecimento dos bancos dianteiros, Projeção do logo Porsche nas portas, Interior em couro Preto/Bege Mojave, Faróis de LED com regulagem automática, Escudo Porsche nos encostos de cabeça, Cubos de roda com escudo Porsche colorido, ParkAssist dianteiro e traseiro com câmera 360°, Tanque de 75 litros, Peso bruto 2.250 kg, 0 a 100 km/h em 6,4 s, Velocidade máxima de 232 km/h.', 469900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE TURBO GT 2024', 'Modelo 2024 de alta performance da linha Cayenne. Veículo premium com especificações Turbo GT, oferecendo máximo desempenho e tecnologia avançada.', 1500000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA S 2020 (Kit GT3)', 'Ano: 2019/2020. Quilometragem: 30.000 km. Motor 3.0 Turbo Compressor Duplo com 473 HP. Espaço para 4 lugares. Interior bordô. Sem retoques estéticos. Equipado com Sport Chrono, controle de estabilidade/declínio e módulos de condução.', 768000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE TURBO GT 2024 (Black Edition)', 'Ano: 2023/2024. Quilometragem: 23.000 km. Motor V8 4.0 Biturbo com 649 HP. Espaço para 5 lugares. Interior pacote GT com contrastes cinza e detalhes em preto brilhante. Sistema de som Burmester. Volante GT em carbono e Alcântara. Rodas aro 22 na cor preta. Cor externa preta.', 1350000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN 2.0 TURBO 2023 (Premium)', 'Ano: 2022/2023. Versão: 2.0 Turbo Gasolina PDK. Combustível: Gasolina. Quilometragem: 17.420 km. Equipado com alarme, banco bi-partido, comando de áudio e telefone no volante, controle automático de velocidade, controle de tração, distribuição eletrônica de frenagem, kit multimídia, retrovisor fotocrômico, sensor de estacionamento e tração 4x4.', 529900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

-- Produtos Mercedes-Benz
('MERCEDES-BENZ S680 MAYBACH 2024', 'Mercedes Maybach S-680, ano 2024, motor V12 6.0 biturbo com 630 cv, tração integral 4MATIC, aceleração de 0 a 100 km/h em 4,4 segundos. Veículo zero km, máxima sofisticação, requinte, elegância e tecnologia.', 3690000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ C 200 HÍBRIDO AMG 2022', 'Ano 2021/2022, 91.000 km rodados. Motor híbrido 1.5 Eq Boost com 204 cv, com tecnologia de recuperação de energia. Versão AMG Line com visual esportivo, rodas aro 18, suspensão esportiva. Interior com bancos esportivos em couro, painel digital, sistema de som Burmester, central MBUX, assistência ao motorista com frenagem de emergência, alerta de ponto cego e controle de estabilidade. Veículo em estado excelente, procedência e manutenção garantidas.', 280000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER RANGE ROVER VELAR P250s 2018', 'Ano 2018, com 70.840 km rodados. Motor 2.0 P250 com 250 cv. Rodas aro 22 e rodas originais inclusas. Teto panorâmico, câmbio automático de 8 marchas, porta-malas com 673 litros. Interior com bancos em couro preto, direção elétrica. Consumo urbano de 7 km/l e rodoviário de 9,5 km/l. Manual e cópia de chave inclusos. Laudo cautelar aprovado.', 289900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENZ C300 2019', 'Ano 2019, 60.000 km rodados. Motor 2.0 CGI com 258 cv. Tração traseira. Câmbio automático de 9 marchas. Direção elétrica. Consumo urbano de 9,5 km/l e rodoviário de 13,1 km/l. Manual e cópia de chaves disponíveis.', 224900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ C 63 AMG', 'Ano 2017, motor 4.0 V8 Turbo gasolina, versão sedan 4 portas, câmbio automático. Gasolina, com 40.445 km rodados.', 399900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

-- Produtos RAM
('RAM 2500 LARAMIE 2022', 'Modelo 2022 da linha RAM 2500 Laramie, pickup premium com motorização robusta e acabamento de luxo, oferecendo conforto e capacidade para trabalho e lazer.', 379900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM 1500 5.7 V8 GASOLINA LIMITED 2023', 'Ano 2023, versão 5.7 V8 gasolina Limited CD 4x4 automático com 29.835 km rodados.', 439900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM CLASSIC 5.7 V8 GASOLINA LARAMIE 2023', 'Ano 2023, versão 5.7 V8 gasolina Laramie CD 4x4 automático com 29.942 km. Equipado com air bags, alarme, ar condicionado digital e quente, bancos de couro com aquecimento, comando de áudio no volante, computador de bordo, controle de estabilidade e tração, freio ABS, GPS, rodas de liga leve, sensor de estacionamento, tração 4x4, travas e vidros elétricos, volante com regulagem de altura.', 295900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM 3500 LARAMIE 2024', 'Pickup premium com alta capacidade de carga e tração. Quilometragem: 30.000 km. Modelo 2024 da linha RAM 3500 com acabamento Laramie, oferecendo conforto e robustez para trabalhos pesados.', 449900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM 3500 LARAMIE 2024 (Premium)', 'Ano: 2023/2024. Versão: 6.7 I6 Turbo Diesel Laramie CD 4x4 Automático. Combustível: Diesel. Quilometragem: 23.400 km. Itens inclusos: Air bag do motorista, air bag duplo, alarme, ar condicionado digital, ar quente, banco do motorista com ajuste de altura, bancos de couro, bancos dianteiros com aquecimento, comando de áudio e telefone no volante, computador de bordo, controle automático de velocidade, controle de estabilidade, controle de tração, desembaçador traseiro, direção hidráulica, distribuição eletrônica de frenagem, encosto de cabeça traseiro, farol de neblina, freio ABS, GPS, kit multimídia, limpador traseiro, retrovisor fotocrômico, retrovisores elétricos, rodas de liga leve, sensor de estacionamento, tração 4x4, travas elétricas, vidros elétricos e volante com regulagem de altura.', 429900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

-- Outros veículos premium
('BMW X3 2.0 16V HÍBRIDO X LINE XDRIVE30E STEPTRONIC 2021', 'Ano: 2020/2021. Combustível: Gasolina e elétrico. Quilometragem: 61.500 km. SUV premium híbrido da BMW com tecnologia X-Line, oferecendo eficiência energética e performance característica da marca alemã.', 249900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('VOLKSWAGEN AMAROK EXTREME 2025 0KM', 'Veículo novo, modelo 2025, Volkswagen Amarok Extreme. Pickup premium com design robusto e tecnologia avançada, ideal para trabalho e aventura.', 329800.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('FORD RANGER LIMITED 2024', 'Ano 2023/2024, Diesel, com 46.000 km rodados. Equipado com bancos de couro, piloto automático, chave presencial, airbag, freio ABS, retrovisores elétricos, vidros elétricos, central multimídia, alarme, volante multifuncional, start stop, direção hidráulica, tração 4x4, controle de estabilidade/declínio, protetor de caçamba, lona marítima, estribos laterais, hack de teto, pneus BF, frenagem autônoma, rodas aro 20 e sistema anti-capotamento.', 299900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('JEEP COMPASS HURRICANE BLACKWALK 2025', 'Ano: 2024/2025. Quilometragem: 11.000 km. Combustível: Gasolina. Piloto Automático, Chave Presencial, Airbag, Freio ABS, Retrovisores elétricos, Sem retoques estéticos, IPVA pago, Vidros elétricos, Central Multimídia, Alarme, Volante Multifuncional, Start Stop, Ar Condicionado, Direção Hidráulica, Painel TFT, Teto Panorâmico, Teto Solar, Controle de estabilidade/declínio, Porta-malas elétrico, Carregador por indução, Corretor de faixa contínua, Banco couro/alcântara, Sistema de permanência de faixa, Paddle Shift, Rodas aro 18 preto acetinado, Computador de bordo.', 225000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('KIA SPORTAGE EX PRESTIGE 2024', 'Ano: 2023/2024. Versão: 1.6 TGDI MHEV EX PRESTIGE DCT. Câmbio: Automático. Portas: 4. Combustível: Gasolina e elétrico. Quilometragem: 19.600 km. Opcionais: Air bag do motorista, Air bag duplo, Alarme, Ar condicionado digital, Banco bi-partido, Banco do motorista com ajuste de altura, Bancos de couro, Bancos dianteiros com aquecimento, Comando de áudio e telefone no volante, Computador de bordo, Controle automático de velocidade, Controle de estabilidade, Controle de tração, Desembaçador traseiro, Direção Elétrica, Distribuição eletrônica de frenagem, Encosto de cabeça traseiro, Farol de neblina, Freio ABS, GPS, Kit Multimídia, Limpador traseiro, Pára-choques na cor do veículo, Retrovisores elétricos, Rodas de liga leve, Sensor de estacionamento, Teto solar, Travas elétricas, Vidros elétricos, Volante com Regulagem de Altura.', 235900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER DEFENDER 2021', 'Ano: 2020/2021. Quilometragem: 38.000 km. Motor: 2.0 Turbo com 295 HP. SUV premium com capacidades off-road excepcionais e design icônico da Land Rover.', 439900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES GLB 200 PROGRESSIVE 2022', 'Ano: 2021/2022. Quilometragem: 84.000 km. Motor: 1.3 Turbo com 160 HP. Capacidade: 7 lugares. Equipamento adicional: Câmera 360°. SUV compacto premium com configuração de 7 lugares.', 249900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('TOYOTA HILUX SW4 2.8 D-4D TURBO DIESEL SRX 7L 4X4 2023', 'Ano: 2023/2023. Versão: 2.8 D-4D Turbo Diesel SRX 7L 4X4 Automático. Combustível: Diesel. Quilometragem: 41.500 km. SUV robusto com 7 lugares e motorização diesel turbo, ideal para família e aventura.', 337900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('VOLKSWAGEN TAOS HIGHLINE 2024', 'Ano: 2024/2024. Versão: 1.4 250 TSI Total Flex Highline Automático. Câmbio: Automático. Portas: 4. Combustível: Gasolina e álcool. Quilometragem: 5.400 km. SUV compacto premium da Volkswagen com tecnologia TSI.', 181900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('FORD MUSTANG GT PREMIUM 2018', 'Ano: 2018/2018. Versão: 5.0 V8 TI-VCT Gasolina GT Premium SelectShift. Câmbio: Automático. Portas: 2. Combustível: Gasolina. Quilometragem: 26.000 km. Muscle car americano icônico com motor V8 5.0 e acabamento premium.', 369990.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('FORD MUSTANG GT PREMIUM 2018 (Low Mileage)', 'Ano: 2018/2018. Versão: 5.0 V8 TI-VCT Gasolina GT Premium SelectShift. Combustível: Gasolina. Quilometragem: 44.300 km. Opcionais: Air bag do motorista, Air bag duplo, Alarme, Ar condicionado digital, Ar quente, Banco do motorista com ajuste de altura, Bancos de couro, Comando de áudio e telefone no volante, Computador de bordo, Controle automático de velocidade, Controle de estabilidade, Controle de tração, Direção Elétrica, Distribuição eletrônica de frenagem, Encosto de cabeça traseiro, Farol de neblina, Freio ABS, GPS, Kit Multimídia, Pára-choques na cor do veículo, Retrovisor fotocrômico, Retrovisores elétricos, Rodas de liga leve, Sensor de estacionamento, Travas elétricas, Vidros elétricos, Volante com Regulagem de Altura.', 329900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1);
