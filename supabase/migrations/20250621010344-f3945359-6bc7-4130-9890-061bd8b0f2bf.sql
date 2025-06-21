
-- Inserir novos produtos automotivos na categoria Veículos
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
-- Produtos de luxo e esportivos
('Toyota Hilux SW4 SRX Platinum 2024', 'Modelo 2023/2024, com 37.000 km rodados. Veículo robusto e confiável, ideal para quem busca conforto e performance em um SUV de alta categoria.', 369800.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Porsche 911 Turbo 2023', 'Veículo com 12.000 km, acabamento Shark Blue com interior azul grafite e costuras em giz. Equipado com teto solar em vidro, sistema lift, stage 2, proteção total em PPF, rodas Turbo S Exclusive Design aro 20/21, faróis PDLS matrix, lanternas traseiras exclusivas, cintos Shark Blue, bancos com ajuste em 18 vias, volante GT Sport em couro com apliques em carbono, pacote interior carbono e câmbio PDK de 8 velocidades.', 1500000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Nissan GTR Premium 2009', 'Com 29.100 km, este Nissan possui stage 2, downpipe, remap, proteção total em PPF, cerca de 700WHP na roda, upgrade de turbina, escape Akrapovic, rodas Vossen e pneus Yokohama.', 910000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Jaguar I-Pace 90 kW EV400 SE AWD Elétrico 2020', 'Com 42.000 km, motor elétrico AWD de 90 kW (400 cv) e torque de 31,10 kgfm, autonomia de 470 km, bateria de 90 kWh, câmbio automático de 1 marcha, direção elétrica, aceleração de 0-100 km/h em 4,8 segundos, manual e chave reserva.', 229900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Lamborghini Urus 2019 4.0 V8 Turbo Gasolina LP650-4 Automático', 'Com 28.328 km, pintura Verde Hebe Metallic, motor V8 4.0L biturbo com 650 cv e 86,6 kgfm de torque, aceleração 0-100 km/h em 3,6 segundos, velocidade máxima de 305 km/h, tração integral, câmbio automático sequencial de 8 velocidades, volante esportivo multifuncional em couro, interior Terra Ásia com bancos refrigerados e aquecidos, teto solar panorâmico e avançados recursos tecnológicos como head-up display, sistema de som Bang & Olufsen e câmeras 360°.', 2700000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Porsche Macan 2.0 Turbo Gasolina T PDK 2023', 'Rodagem de 17.323 km, motor 2.0 turbo com 252 cv, direção elétrica, proteção total PPF, tração 4x4 permanente, transmissão automática de 7 marchas, consumo urbano de 7,4 km/l e rodoviário de 8,3 km/l, velocidade máxima de 232 km/h e porta-malas de 488 litros.', 499900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Kia Niro 1.6 GDI HEV SX Prestige DCT 2024', 'Com 18.323 km, motor 1.6 GDI com 105 cv e 14,7 kgfm, motor elétrico de 44 cv e 17,3 kgfm, potência combinada de 141 cv e 27 kgfm, faróis de LED, rodas de liga leve 18", câmbio de 6 marchas, consumo urbano de 19,8 km/l e rodoviário de 17,7 km/l, velocidade máxima de 175 km/h e porta-malas de 425 litros.', 184900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Volvo XC40 P8 Recharge Electric BEV Pure AWD', 'Ano 2021/2022, versão P8 Recharge Electric BEV Pure AWD, combustível elétrico, 25.015 km rodados.', 219900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Maserati Levante Turbo Hybrid GT 2022', 'Ano 2022, versão 2.0 Turbo Hybrid GT Automático, 4 portas, combustível gasolina, com 48.000 km rodados.', 650000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Kia Carnival EX 2022', 'Ano 2021/2022, versão 3.5 V6 Gasolina EX Automático, 4 portas, com 69.800 km rodados.', 469900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Volvo S60 T5 Inscription 2020', 'Ano 2019/2020, versão 2.0 T5 Inscription Gasolina 4P Automático, 4 portas, com 61.000 km rodados.', 165900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Maserati Ghibli 2018', 'Ano 2018, com 30.000 km rodados.', 589900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Aston Martin Vantage 2023', 'Ano 2023, cor cinza, com 650 km rodados, câmbio ZF automático de 8 velocidades e combustível gasolina.', 1590000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Chevrolet S10 LTZ 2024', 'Ano 2023/2024, versão 2.8 16V Turbo Diesel LTZ CD 4x4 Automático, 4 portas, diesel, com 39.400 km rodados.', 219900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('Honda Civic Si Mugen 2007', 'Com 54.000 km, pintura Fiji Blue Pearl original Mugen, body kit e aerofólio originais em carbono, tapetes Mugen, 5 rodas Mugen GP forjadas originais (incluindo estepe), calhas originais, bloco K24 forjado rodando 100% no álcool, turbo forjado, 540 WHP na roda, ECU Hondata, turbina K27 Plus .70, pistão forjado CP, biela Eagle, câmbio forjado, embreagem Ceramic Power multidisco, pneus Sailun semi slick, surge tank Metal Horse 3L, bomba Walbro 535, coilovers D2 Racing e freios Type R.', 239900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

-- Veículos clássicos e exóticos
('CHEVROLET BLAZER 4.3 2P AUTOMÁTICO 1989', 'Motor 4.3 injetado, tração 4x4, autêntica americana com tapeçaria original, completa, automática, direção elétrica, pneus novos, placa Mercosul preta, vidros originais na tonalidade verde.', 199900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER DISCOVERY V8 1996', '258.000 km rodados com motor 3.9 V8 de 188 cv, direção hidráulica, tração 4x4, transmissão automática de 4 velocidades, velocidade máxima de 160 km/h, consumo urbano de 5,6 km/l e estrada 6,4 km/l, interior com bancos em tecido, 100% revisada sem retoques.', 109900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('FORD TUDOR 1929', 'Documentação de 1929, carroceria de lata, mecânica 455 7.2 V8 Big Block, câmbio Tremec de 5 marchas, colunas Bilet, pedaleiras Sigma, pneus Mickey Thompson tala 15, teto hard top, partida start stop e freio a disco nas 4 rodas.', 349900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 SC SAFARI TRIBUTE 1980', 'Porsche 911 SC preparado estilo Safari inspirado no rally East African Safari; motor 3.0 seis cilindros original com 204 cv, câmbio manual 5 marchas, suspensão elevada, pneus mistos estilo rallye, para-choques reforçados, quatro faróis auxiliares sobre o capô; escapamento esportivo; pintura icônica Martini Racing; bancos com revestimento xadrez; tributo perfeito à história da Porsche nos ralis.', 960000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 930 TURBO 1979', 'Esportivo alemão com motor 6 cilindros a ar 3.3L original com intercooler, 300 cv, motor totalmente refeito com kit original incluindo embreagem, pintura e tapeçaria em ótimo estado, prazeroso e com performance incrível.', 1500000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 930 TURBO 1987', 'Modelo original do primeiro Porsche 911 turbo, motor 3.3L com intercooler e 300 hp, freios redimensionados, pintura e tapeçaria impecáveis, um dos modelos mais novos do Brasil, automóvel único e esportivo de alto desempenho.', 1800000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('ROLLS-ROYCE CORNICHE 1980', 'Conversível de luxo derivado do Silver Shadow, carroceria artesanal feita pela Mulliner Park Ward, motor V8 6.75L de aproximadamente 220 cv, câmbio automático, acabamento em madeira nobre e couro de alta qualidade, exclusividade e luxo absoluto.', 1200000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ 230 SL 1966 (PAGODA)', 'Automóvel clássico altamente desejado, motor 6 cilindros em linha 2.3L com câmbio manual 4 velocidades, direção hidráulica, acabamento luxuoso para a época, macio, silencioso e muito prazeroso de dirigir.', 880000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ 280 SE CONVERSÍVEL 1969 (CHARUTO)', 'Cabriolet clássico conhecido como "Charuto", motor 6 cilindros em linha potente e ágil, tapeçaria nova, design elegante e combinação de cores excepcionais, preservação excelente, luxo e inovação tecnológica para a época.', 1650000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PLYMOUTH ROAD RUNNER 1968', 'Muscle car clássico, original com 57 mil milhas, motor V8 383 6.3L com 335 cv, câmbio automático Torqueflite 727 na coluna, interior totalmente original azul, rodas aro 14 originais com calotas e pneus BF Goodrich Realine, documentação completa e nota fiscal EUA.', 780000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('ROLLS-ROYCE CORNICHE COUPÉ 1976', 'Luxuoso coupé com motor V8 6.75L de 240 cv, câmbio automático, interior com couro Connolly e painéis de madeira nogueira feitos à mão, pintura saia e blusa, elegância clássica e conforto absoluto.', 880000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CARRERA 2.7 1974', 'Porsche 911 na cor original Lime Green com grafismos pretos, spoiler "Rabo de pato", importado pela Dacon e com apenas 3 proprietários em 40 anos, certificado de autenticidade, teto solar, ar condicionado, vidros elétricos, interior em couro azul marinho, rádio Blaupunkt, manual e chave reserva, modelo raro e original.', 0.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 968 1992', 'Porsche 968 com 49 mil milhas, motor 4 cilindros 3.0L com 240 cv, câmbio manual de 6 marchas, tecnologia VarioCam, tração traseira, disponível nas versões Coupé e Cabriolet, esportivo rigorosamente bem conservado.', 490000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 T TARGA 1972', 'Raro modelo 911 T Targa com tampa de óleo lateral, motor boxer 2.4L 6 cilindros com 130 cv, câmbio manual 5 marchas, design Targa com teto removível e barra de aço inox, original e bem preservado, peça valorizada por colecionadores.', 950000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 1977 (MODIFICADO PARA 993)', 'Porsche 911 de 1977 modificado com carroceria e elementos visuais do 993, motor original 2.7L 6 cilindros a ar, rodas Speedline aro 18, pneus Yokohama Neova, fusão de tradição e modernidade, projeto único e exclusivo.', 750000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 S COUPÉ 1977', 'Porsche 911 S Coupé na cor verde metálico, pintura e tapeçaria em excelente estado, mecânica perfeita, carroceria icônica da década de 70, esportivo clássico e muito valorizado.', 690000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PONTIAC FORMULA V8 400 1974', 'Muscle car "primo rico" da GM, motor big block V8 400 6.6L com 250 cv, câmbio automático 3 velocidades, apenas 4.000 unidades fabricadas, excelente estado geral, estilo e potência.', 380000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ 280 SE CABRIOLET 1971 (CHARUTO)', 'Roadster com motor V8 3.5L e 200 HP, câmbio automático 4 velocidades, direção hidráulica, freios a disco dianteiros, vidros elétricos, design clássico dos anos 70, conforto, desempenho e exclusividade em ótimo estado.', 3650000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('FORD MUSTANG HARD TOP 1965', 'Denominado no mercado mundial como 64 1/2 pois foi o primeiro Mustang produzido no ano de 64, mas no segundo semestre… sendo assim já era modelo 65. Todo original, esse Mustang possui motor V8-260, câmbio mecânico de 3 velocidades no assoalho e tapeçaria original do carro. Possui ar condicionado instalado posteriormente. Este Automóvel é matching number e está com placa preta. Único!', 365000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER SÉRIE IIA 1965', 'Sua cor é original da época: ''Poppy Red''. Foi usado na pintura a melhor tinta PU disponível da marca PPG. Mecânica original em perfeitas condições de uso. Interior totalmente novo no padrão original. Teto em veludo, carpete em ''Sisal'' By Kamy. Instrumentos do painel restaurados e aferidos com toda parte elétrica nova. Automóvel de coleção, em uma versão rara, com teto safari e ventarolas no teto. Roda livre original ''Fairey'', guincho original ''Capstan'', farol de milha Wipac original de época e sirene. Land rover 1965, um projeto extremamente bem sucedido, descomplicado, com manutenção simples e barata. Motor 4 cilindros diesel de 78 HP. Rodas originais com 4 pneus novos.', 550000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ 300 SL 24V 1991', 'A Mercedes-Benz SL é um dos modelos mais cobiçados da linha de roadsters premium, sinônimo de sofisticação, desempenho e exclusividade. Equipado com um motor 6 cilindros em linha de 3.0 litros e 228 cv, esse modelo é um verdadeiro esportivo europeu, projetado para oferecer performance de alto nível. Com uma transmissão automática de 4 marchas, a experiência de condução é suave. Este é um carro para quem aprecia a combinação de luxo e esportividade, além de um design atemporal. Nossa SL está em ótimo estado de preservação e com apenas 53 mil km.', 220000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 930 TURBO 1982', 'Com a clássica e rara combinação de verde metálico com interior verde, esse 930 está absolutamente deslumbrante. Um espetáculo de bom gosto! O Porsche 911 Turbo da primeira geração, conhecido como 930 Turbo, é um dos modelos mais emblemáticos da história da marca. Lançado em 1975 e produzido até 1989, o 930 marcou a estreia do turbo na linha 911. A ideia por trás do projeto surgiu diretamente das pistas: a Porsche queria homologar o 911 para competições do Grupo 4 e do Grupo 5 da FIA, o que exigia a produção de uma versão de rua com as tecnologias usadas nas corridas. O resultado foi um carro que redefiniu o que significava ter um esportivo na garagem. Motor de 3.0 litros turbo, rendendo inicialmente cerca de 260 cv. A partir de 1978, o motor cresceu para 3.3 litros, passou a contar com intercooler e entregava 300 cv e 43,8 kgfm de torque, fazendo o carro alcançar 0 a 100 km/h em cerca de 5,2 segundos, com máxima superior a 250 km/h.', 1550000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 356 CABRIOLET ENVEMO 1983 RECREATION', 'Porsche 356 Envemo, o modelo mais cobiçado e mais valorizado entre as réplicas brasileiras. Automóvel em excelente estado de preservação e originalidade. Motor 1600 a ar com dupla carburação original do carro. Faróis de neblina de época, capota em tecido nova, rodas e acessórios do 356. Sua cor azul com interior cinza dão um ar elegante e alegre a esse carro. Com pouquíssimas unidades produzidas e muito bem feito, hoje a Envemo tornou-se uma grife no nosso mercado.', 340000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 356 SPEEDSTER 2019 RECREATION', 'Fabricado no Brasil, este Porsche 356 Speedster é uma verdadeira obra-prima, destacando-se pela atenção minuciosa aos detalhes em sua construção. A carroceria, feita em manta de fibra, é tão bem trabalhada que transmite a aparência e solidez do aço. Motor Volkswagen 1600cc, agora equipado com injeção eletrônica FuelTech FT-250 e câmbio manual de 4 marchas. Este exemplar possui apenas 2.300 km e impressiona pela belíssima combinação de cores: carroceria cinza, contrastando com o interior em um tom de vermelho mais fechado, criando um visual clássico e refinado.', 210000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 356 CONVERSÍVEL SWING 1982', 'Este maravilhoso exemplar foi fabricado pela Swing, a primorosa empresa nacional do setor. Automóvel em excelente estado de preservação. Possui ar condicionado e capota em canvas. Calotas e acessórios Porsche. Excelente relação custo x benefício.', 210000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('HUMMER H2 6.0 4X4 V8 2003 (BLINDADO)', 'Um monstro sobre rodas! Construído pela AM General sob contrato da General Motors. O H2 foi produzido entre 2002 e 2009, baseado em uma versão de um carro Chevrolet, o GMT820 Chevy 2500. O H2 tem peso médio de 3 toneladas. Seu motor é um V8 de 6.0 litros com 325 CV. Esse Hummer está com apenas 44 mil km. Blindagem CART.', 490000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

-- Veículos premium e seminovos
('FERRARI 296 GTS 2023', 'Ano: 2023/2023. Cor: Vermelha. Km: 4.000. Câmbio: F1 Dupla Embreagem 8 marchas. Combustível: Híbrido. Portas: 2. Motor: 3.0 V6 Biturbo + Elétrico. Potência: 830cv. Multimídia: Sistema de som JBL com Multimídia Touch, Bluetooth, Apple CarPlay. Bancos tipo concha em carbono com couro e Alcântara Nero. Freios Brembo de cerâmica com pinças amarelas. Faróis full LED direcionais. Rodas forjadas aro 20". Sensor de estacionamento dianteiro e traseiro, sensor de chuva, câmeras 360º. Interior em couro e Alcântara Nero, acabamentos internos em carbono e costuras vermelhas, display do passageiro, volante em couro Nero e carbono, seletor de modos de condução, difusor em carbono, Lift-System, cor Rosso Corsa. Não blindado.', 3450000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('FORD RANGER RAPTOR 2024 0KM', 'Ano: 2024/2024. Cor: Laranja. Km: 0. Câmbio: Automático de 10 velocidades. Combustível: Gasolina. Motor 3.0L V6 Twin-Turbo EcoBoost. Potência: 397cv. Multimídia: Sistema de som Bang & Olufsen com tela de 12,4". Bancos esportivos inspirados em caças a jato com detalhes em laranja, ajuste elétrico e memória. Freios a disco com ABS. Faróis full LED. Rodas aro 17" em grafite acetinado. Bluetooth, sensor de estacionamento dianteiro e traseiro, sensor de chuva, câmeras 360º. Interior em couro e Alcântara pretos com detalhes e costuras laranjas, amortecedores FOX 2.5" Live Valve, sistema de tração 4WD com diferenciais dianteiro e traseiro bloqueáveis, suspensão traseira Watts Link, sistema de escapamento esportivo com botão seletor no volante. Não blindado.', 489000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('JEEP COMMANDER DIESEL OVERLAND BLINDADO 2022', 'Ano: 2021/2022. Versão: 2.0 TD380 Turbo Diesel Overland AT9. Câmbio: Automático. Portas: 4. Combustível: Diesel. Km: 16.000. Blindado.', 349900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER RANGE ROVER EVOQUE 2.0 P250 FLEX R-DYNAMIC HSE AWD 2025 0KM', 'Ano: 2024/2025. Versão: 2.0 P250 Flex R-Dynamic HSE AWD Automático. Combustível: Gasolina e álcool. Km: 0.', 439700.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER DEFENDER P300 GASOLINA 110 SE 2022', 'Ano: 2021/2022. Versão: 2.0 P300 Gasolina 110 SE AWD Automático. Câmbio: Automático. Portas: 4. Combustível: Gasolina. Km: 23.000.', 550000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENS C63 COUPÉ 2013', 'Ano: 2013/2013. Versão: 6.3 Coupé V8 Gasolina 2P Automático. Câmbio: Automático. Portas: 2. Combustível: Gasolina. Km: 48.000.', 399000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENS G63 2023', 'Ano: 2023/2023. Versão: 4.0 V8 Turbo Gasolina 4MATIC Speedshift. Câmbio: Automático. Portas: 4. Combustível: Gasolina. Km: 4.500.', 2400000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENS AMG GT 2016', 'Ano: 2015/2016. Versão: 4.0 V8 Turbo Gasolina S 7G-DCT. Câmbio: Automatizada. Portas: 2. Combustível: Gasolina. Km: 11.700.', 789900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ SL400 2015', 'Ano: 2015/2015. Versão: 3.0 V6 Gasolina 2P Automático. Câmbio: Automático. Portas: 2. Combustível: Gasolina. Km: 16.900.', 410000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ GLA 200 AMG LINE 2023', 'Ano: 2022/2023. Versão: 1.3 GCI Gasolina AMG Line 7G-DCT. Câmbio: Automático. Portas: 4. Combustível: Gasolina. Km: 28.900.', 274900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MINI COUNTRYMAN 1.5 12V TWINPOWER TURBO HYBRID COOPER S E TOP ALL4 STEPTRONIC 2023', 'Ano: 2022/2023. Versão: 1.5 12V TwinPower Turbo Hybrid Cooper S E Top ALL4 Steptronic. Câmbio: Automático. Portas: 4. Combustível: Gasolina e elétrico. Km: 4.400.', 219900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 TARGA 4S 2008', 'Ano: 2008/2008. Versão: 3.8 Targa 4S 6 Cilindros 24V Gasolina 2P Tiptronic. Câmbio: Automatizada. Portas: 2. Combustível: Gasolina. Km: 22.000.', 650000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA E-HYBRID 4S 2022', 'Ano: 2021/2022. Versão: 2.9 V6 E-Hybrid 4S PDK. Câmbio: Automatizada. Portas: 4. Combustível: Gasolina e elétrico. Km: 5.700.', 799900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN 2024 0KM', 'Modelo: MACAN. Ano: 2024/2024. Versão: 4 Elétrico. Combustível: Elétrico. Km: 0.', 659900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 TURBO S 2024', 'Ano: 2023/2024. Versão: 3.8 24V H6 Gasolina Turbo S PDK. Câmbio: Automatizada. Portas: 2. Combustível: Gasolina. Km: 5.000.', 1799900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 4S 2010', 'Ano: 2009/2010. Versão: 3.8 Carrera 4S Coupé 6 Cilindros 24V Gasolina 2P Automático. Câmbio: Semi-automático. Portas: 2. Combustível: Gasolina. Km: 39.000.', 599900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 718 BOXTER 2021', 'Ano: 2021/2021. Versão: 2.0 16V H4 Gasolina Boxster PDK. Câmbio: Automático. Km: 12.900. Itens: Air bag do motorista e duplo, alarme, ar condicionado digital, bancos de couro, direção elétrica, freio ABS, GPS, sensor de estacionamento, vidros e travas elétricas, volante regulável, entre outros.', 579900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN 2.0 2020', 'Ano: 2019/2020. Km: 49.000.', 369800.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA 2022', 'Ano: 2022/2022. Km: 11.000.', 829800.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA 4 2025 0KM', 'Ano: 2025/2025. Cor: Azul Gentian Metálico. Bancos 18 vias com aquecimento. Portas de sucção. Suspensão pneumática. Head-up Display. Rodas Exclusive aro 21" Preto Brilhante. Motor 2.9 V6 Biturbo. Híbrido Plug-in. Potência total: 470CV. Câmbio PDK 8 velocidades. Interior em couro bicolor preto e bege Chalk. Sistema de som Bose com Apple CarPlay. Sport Chrono. ACC. Escape esportivo com abertura de válvula.', 1090000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 718 CAYMAN GT4 2023', 'Cor: Shark Blue. Motor 4.0 6 cilindros aspirado. Faróis LED com PDLS+. Potência 420 cv. Rodas GT4 20" Platinum Satin. Câmbio PDK. Freios cerâmica PCCB. Park assist dianteiro e traseiro. Pacote Chrono, Full Bucket seats em fibra de carbono, interior Race-Tex com costuras vermelhas. Sistema de som BOSE Surround Sound. Aceleração 0-100 em 4,4s. Velocidade máxima 305 km/h.', 999999.90, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA ANO 2020 992', 'Ano: 2020. Motor 3.0 6 cilindros, potência de 385 cv, faróis Full LED PDLS+, rodas 20" na dianteira e 21" na traseira. Interior parcialmente em couro com pacote interior em couro estendido, teto solar elétrico em vidro, bancos dianteiros com ajustes elétricos parciais, escudos Porsche nos apoios de cabeça. PCM com tela de 10,9", Apple CarPlay, ar-condicionado digital dual zone, assistente de estacionamento dianteiro e traseiro com câmera de ré, controle de cruzeiro, modos de condução Normal e Sport. Sistema de som Hi-Fi (Sound Package Plus) e Bose Surround, park assist dianteiro e traseiro. Peso bruto 1.505 kg, tanque 64 litros, aceleração 0 a 100 km/h em 4,2 s e velocidade máxima de 305 km/h.', 749900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA 4 SPORT TURISMO E-HYBRID 2018', 'Ano: 2018. IPVA 2025 pago. Motor 2.9 V6 Biturbo + elétrico com potência combinada de 462 cv e torque de 71,4 kgfm. Câmbio PDK de 8 marchas, tração integral, suspensão pneumática, pacote Sport Chrono, controle eletrônico de amortecimento, controle de velocidade adaptativo (ACC) e controle de largada (Launch Control). Rodas 19", câmera 360°, head-up display e navegador GPS com HD interno. Volante GT em couro com paddle shift, teto solar panorâmico elétrico. Bancos Comfort de 14 vias em couro marrom Trufa. Faróis de xenônio com regulagem automática, esterçamento das rodas traseiras, assistente de estacionamento semiautomático e vetorização de torque.', 539900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 718 BOXSTER SPYDER 2021', 'Ano: 2021/2021. Cor Prata, km 6.600. Motor 4.0 6 cilindros aspirado com 320 cv, câmbio PDK dupla embreagem 7 velocidades e gasolina. Bancos bicolor em couro Vermelho Bordeaux e Race-Tex Preto. Sistema multimídia com tela touch, GPS e Bluetooth. Freios a disco com ABS e pinças vermelhas. Faróis Full LED PDLS Plus, rodas GT aro 20" pratas. Sensor de estacionamento traseiro. Interior Pacote Spyder Classic com volante GT em Race-Tex com aquecimento, Sport Chrono, soleiras em alumínio, sistema de escapamento esportivo.', 779000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 GT3 2022', 'Ano: 2021/2022. Cor azul, km 4.000. Motor Flat Six 4.0 aspirado, 510 cv, câmbio PDK dupla embreagem 7 velocidades e gasolina. Sistema de som Bose com multimídia, Bluetooth e Apple CarPlay. Bancos concha em carbono, couro e Alcântara pretos com costuras amarelas e ajuste elétrico. Freios de cerâmica-carbono com pinças amarelas. Faróis LED Matrix PDLS escurecidos, rodas aro 20 e 21" em preto acetinado com aros exteriores em Shark Blue. Sensor de estacionamento traseiro. Interior em couro e Alcântara com detalhes em carbono, eixo traseiro esterçante, teto e capa dos retrovisores em carbono, suspensão PASM, lift system, volante GT, soleiras em carbono, projeção do logo Porsche iluminado nas portas, lanternas Exclusive.', 2150000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 TURBO S CABRIOLET 2023', 'Ano: 2022/2023. Cor cinza, km 3.500. Motor 3.8 6 cilindros biturbo com 650 cv, câmbio PDK 8 velocidades e gasolina. Sistema de som Burmester com multimídia touch, GPS, Bluetooth e Apple CarPlay. Bancos sport de 18 vias em couro cinza ardósia com ajuste elétrico e memória. Freios a disco com ABS e pinças amarelas. Faróis Matrix escurecidos com PDLS Plus, rodas Turbo S aro 20 e 21" em cinza acetinado. Sensores de estacionamento dianteiro e traseiro, sensor de chuva. Interior em couro total cinza ardósia, suspensão PASM + PDCC, sport design em preto brilhante, lift system, escapamento esportivo Akrapovic, detalhes internos em carbono fosco, cintos e cronômetros em amarelo racing, volante GT com detalhes em carbono, lanternas escurecidas, capa dos retrovisores em carbono, câmeras 360º.', 1690000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM 2500 NIGHT EDITION 2020', 'Ano: 2020. Km 58.000. Combustível diesel, câmbio automático. Banco de couro, piloto automático, chave presencial, airbag, freio ABS, retrovisores elétricos, vidros elétricos, central multimídia, alarme, volante multifuncional, start stop, ar condicionado, direção hidráulica, tração 4x4, controle de estabilidade/declínio, protetor de caçamba, lona marítima, estribos laterais, pneus BF. Sem retoques estéticos.', 365000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ SL350 2011', 'Ano: 2011. Apenas 16.000 km, manual e cópia de chaves. Motor 3.5 V6 com 316 HP.', 249900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE V6 2016', 'Km 139.000. Motor 3.6 V6 com 420 cv, direção elétrica, transmissão automática de 8 velocidades. Velocidade máxima 259 km/h, consumo urbano 6,3 km/l, consumo estrada 9,2 km/l, aceleração 0-100 em 5,4 s. Interior bicor, veículo 100% revisado com manual e cópia de chaves.', 250000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 3.8 6 CILINDROS 24V TURBO 2015', 'Km 33.700. Motor 3.8 com aproximadamente 650 HP, câmbio PDK 7 marchas, tração integral permanente. Interior bordô, Stage II, consumo urbano 6,6 km/l, rodoviário 9,5 km/l, manual e cópia de chaves.', 900000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE TAYCAN TURBO S ELÉTRICO 2021', 'Km 7.200. Pacote Sportdesign Carbono, faróis em LED Matrix, head-up display, sistema de som Burmester, display do passageiro. Potência de 761 cv, torque de 105 kgfm, aceleração 0-100 km/h em 2,8 s, tração integral permanente, velocidade máxima 260 km/h. Veículo aprovado cautelar sem retoques. Tela multimídia sensível ao toque de 12,3", GPS integrado, direção elétrica, manual e chave reserva.', 679900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ CLS 63 AMG 5.5 V8 TURBO GASOLINA 4P AUTOMÁTICO 2012', 'Km 86.000. Blindada, motor 5.5 V8 biturbo gasolina, 557 cv e torque de 81,6 kgfm. Aceleração 0-100 em 3,5 s, consumo cidade 4,4 km/l, rodovia 10,1 km/l. Tração traseira, câmbio automático 7 marchas, direção hidráulica, manual e chave reserva.', 249900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ CL 63 AMG 6.2 V8 32V GASOLINA 2P AUTOMÁTICO 2008', 'Ano: 2008. Rodado: 86.050 km. Motor 6.2 V8 32V gasolina, 525 cv, torque máximo 64,2 Kgfm a 5200 rpm. Aceleração 0-100 km/h em 4,6s, velocidade máxima 250 km/h. Câmbio automático de 7 marchas, tração traseira, direção hidráulica. Consumo urbano 3,6 km/l, estrada 6,7 km/l. Equipado com vidros duplos, painel TFT, bancos de couro, vidros sem colunas, geladeira. Manual e cópia de chaves. Cautelar aprovada.', 334900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENS C300 AMG 2022', 'Ano: 2022. Rodado: 47.000 km. Pneus novos. Kit visual AMG. Head Up Display. Câmbio 9G-Tronic. Acesso hands free. Assistentes de direção, sistema de som BURMESTER® 3D. Faróis Full LED Digital Light. Monitor de ponto cego com ACC. Som do motor nos alto-falantes. Câmeras 360°, rodas AMG 19". Suporte para manobras evasivas, fechamento remoto do porta-malas, aquecimento dos bancos dianteiros. Assistentes para manutenção de faixa. Carregamento por indução para iPhone. Assistente adaptativo de luz alta plus. Painel digital de 12,3". Attention Assist e spoiler traseiro AMG. MBUX com inteligência artificial. Acabamento do painel em trama metal. Multimídia 11,9" com realidade aumentada.', 319900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CABRIO GTS 2023', 'Ano: 2023. Rodado: 17.000 km. Cor Cinza Ártico. Interior preto com costuras brancas e detalhes em Alcântara. Rodas Turbo S aro 20/21". Banco com ajuste em 18 vias. Faróis PDLS. Sistema Lift e Sport Chrono. Volante em Alcântara. Lanternas Exclusive Designer. Motor 3.0 turbo compressor Stage 2, 600 HP. Escape full titânio e downpipe by @avus.motorsport. Câmbio PDK de 8 marchas.', 1079000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA 4 SPORT TURISMO 2020', 'Ano: 2020. Rodado: 75.000 km.', 530000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES-BENZ GLE400 2016', 'Motor 3.0 V6 gasolina coupé com 333 cv. Câmbio automático de 9 marchas. Interior com bancos em couro e teto em Alcântara. Escapamento full inox. Rodas aro 20. Consumo urbano 6,9 km/l e rodovia 9,2 km/l. Manual e cópia de chaves. IPVA 25% pago.', 230000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM 3500 6.7 I6 TURBO DIESEL LARAMIE CD 4X4 AUTOMÁTICO 2022', 'Ano: 2022. Rodado: 26.300 km. Motor 6.7 turbo diesel com 377 HP. Câmbio automático de 6 marchas. Tração 4×4. Direção hidráulica. Painel TFT. Interior bi-color com bancos em couro. Multimídia 12 polegadas. Consumo urbano 5,1 km/l e rodoviário 7,6 km/l. Único dono, todas as revisões feitas na CSS. Veículo retirado em Goiânia, sem retoques.', 350000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MINI COUNTRYMAN EXCLUSIVE ALL4 2023', 'Ano: 2022/2023. Rodado: 40.000 km. Motor 1.5 híbrido.', 200000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE E-HYBRID S 2021', 'Ano: 2021. Rodado: 45.900 km. Motor 3.0 V6 híbrido.', 529900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAMBORGHINI HURACAN EVO 2020', 'Ano: 2019/2020. Rodado: 9.800 km. Motor 5.2 V10 gasolina LP 640 EVO LDF. Importado oficial.', 3900000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE COUPE 2024', 'Rodado 5.000 km.', 840000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('TOYOTA GR SUPRA PREMIUM 2022', 'Ano: 2022. Rodado: 2.500 km. Motor 3.0 6 cilindros turbo com 387 HP. Bancos em couro preto com ajuste em 14 vias. Faróis Full LED. Câmbio automático ZF de 8 velocidades. Freios a disco com ABS. Sistema de som JBL.', 790000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LEXUS ES 300H 2025', 'Ano: 2024/2025. Zero km. Motor 2.5 híbrido com 211 HP. Cor branco sônico. Interior em couro bege. Faróis Full LED com DLR. Câmbio CVT. Freios a disco com ABS.', 329000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENZ S63 AMG COUPÉ 2016', 'Ano: 2015/2016. Rodado: 29.700 km. Motor V8 5.5 bi turbo com 585 HP. Cor Rosso Corsa Metalizado. Interior em couro napa marrom. Faróis Full LED com DLR. Câmbio automático de 7 velocidades. Freios a disco com ABS e pinças vermelhas. Sistema de som Burmester.', 525000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('JAGUAR F-TYPE 3.0 COUPE S 2015', 'Ano: 2015/2016. Rodado: 23.000 km. Motor 3.0 V6 supercharger com 340 HP.', 345000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM 1500 LIMITED 2024', 'Ano: 2023/2024. Rodado: 38.000 km. Motor 5.7 V8 gasolina. Equipado com estribo elétrico e protetor de caçamba.', 469000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 TURBO S 2023', 'Ano: 2023. Rodado: 5.100 km. Motor 3.8 6 cilindros turbo com 650 HP. Cor Cinza Ártico. AeroKit. Faróis Full LED Matrix. Câmbio PDK 2 de 8 velocidades. Freios carbono cerâmica. Sistema Lift.', 1550000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE TAYCAN CROSS', 'Rodado: 5.000 km. Banco de couro. Piloto automático. Chave presencial. Pintura especial. Airbag. Freio ABS. Retrovisores elétricos. Sem retoques estéticos. Vidros elétricos. Central multimídia. Alarme. Volante multifuncional. Start Stop. Ar condicionado. Direção hidráulica. Painel TFT. Teto panorâmico. Tração 4x4. Controle de estabilidade/declínio. Porta-malas elétrico. Carregador por indução. Módulos de condução. Corretor de faixa contínua. Suspensão pneumática. Sport Chrono. Câmera 360 graus. Paddle shift. Interior caramelo.', 599900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE E-HYBRID 2023', 'Ano: 2022/2023. Rodado: 18.000 km. Motor híbrido com 335 HP. Equipado com Sport Chrono.', 679900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 718 BOXSTER 2021', 'Ano: 2020/2021. Motor automático com 295 HP. Sport Chrono. Quilometragem de 11.500 km.', 570000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE PANAMERA E-HYBRID 2020', 'Ano: 2020/2020. Híbrido com 455 HP. Sport Chrono. Teto panorâmico. Quilometragem de 49.000 km.', 539900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER DISCOVERY HSE 2022', 'Ano: 2021/2022. Motor 3.0 Turbo com 295 HP. 7 lugares. Teto panorâmico. Sem retoques estéticos. Módulos de condução. Tração 4x4. Rodas aro 22. Sistema de permanência de faixa. Quilometragem de 38.000 km.', 490000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENZ GLC43 AMG 2019', 'Veículo Seminovo Mercedes Benz GLC43 AMG do ano de 2019.', 459900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('TOYOTA HILUX SR 2024', 'Ano: 2024/2024. Motor 2.8 Diesel com 201 HP. 5 lugares. Interior preto. Sem retoques estéticos. Lona marítima. Tração 4x4. Estribos laterais. Protetor de caçamba. Quilometragem de 16.000 km.', 245000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('RAM 2500 LARAMIE 2024', 'Ano: 2023/2024. Motor 6.7 Turbo Diesel com 371 HP. 5 lugares. Interior preto. Estribos laterais. Protetor de caçamba. Tração 4x4. Corretor de faixa contínua. Módulos de condução. Quilometragem de 8.000 km.', 415000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER DISCOVERY METROPOLITAN EDITION 2023', 'Ano: 2022/2023. Motor 3.0 com 295 HP. 7 lugares. Interior conhaque. Hack de t

eto. Teto panorâmico. Controle de estabilidade e declínio. Rodas aro 22. Corretor de faixa contínua. Quilometragem de 59.000 km.', 535000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA CABRIOLET 2022', 'Ano: 2022/2022. Motor 3.0 com 388 HP. 4 lugares. Interior vermelho Bordeaux. Sem retoques estéticos. Sport Chrono. Spoiler traseiro. Painel TFT. Chave presencial. Quilometragem de 3.100 km.', 969900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('JEEP RENEGADE WILLYS 2025', 'Ano: 2024/2025. Motor 1.3 Turbo com 182 HP. 5 lugares. Teto panorâmico. Tração 4x4. Chave presencial. Painel TFT. Quilometragem de 2.000 km.', 169900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA GTS 2023', 'Ano: 2023/2023. Kit GTS com 473 HP. 4 lugares. Interior Crayon e preto no couro liso. Sem retoques estéticos. Kit PPF. Spoiler traseiro. Sport Chrono. Chave presencial. Quilometragem de 4.000 km.', 998000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN T 2022', 'Ano: 2022/2022. Motor 2.0 Turbo com 261 HP. 5 lugares. Interior cinza ardózia. Sem retoques estéticos. Teto panorâmico. Sistema de permanência de faixa. Porta-malas elétrico. Sport Chrono. Quilometragem de 15.000 km.', 469900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE CAYENNE E-HYBRID PLATINUM EDITION 2023', 'Ano: 2022/2023. Híbrido V6 Biturbo com 455 HP. Interior bege. Sem retoques estéticos. Sucção de porta. Tração 4x4. Suspensão pneumática. Head-up display. Quilometragem de 18.000 km.', 728000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENZ CLA35 AMG 2023', 'Ano: 2022/2023. Motor 2.0 Turbo com 301 HP. 5 lugares. Interior couro/alcântara. Sem retoques estéticos. Spoiler traseiro. Corretor de faixa contínua. Escape esportivo. Sistema de permanência de faixa. Quilometragem de 17.000 km.', 399900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENZ C180 AVANTGARDE 2019', 'Ano: 2018/2022. Motor 1.6 Turbo com 153 HP. 5 lugares. Interior preto. Módulos de condução. Chave presencial. Start stop. Quilometragem de 74.000 km.', 137900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE MACAN S', 'Ano: 2016/2017. Motor 3.0 Biturbo com 335 HP. 5 lugares. Interior em couro vermelho Bordeaux. Controle de estabilidade/declínio. Teto panorâmico. Rodas aro 21 Black Piano. Cor branca. Quilometragem de 97.000 km.', 289900.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENZ C63 S AMG COUPÉ 2018', 'Ano: 2017/2018. Motor V8 4.0 Biturbo com 503 HP. 5 lugares. Interior em couro preto com detalhes contrastantes. Som Burmester. Tração traseira. Rodas aro 19. Cor Selenite Grey Metallic. Quilometragem de 35.000 km.', 480000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER RANGE ROVER VELAR P380 HSE R-DYNAMIC 2019', 'Ano: 2018/2019. Motor 3.0 V6 Supercharged com 374 HP. 5 lugares. Interior em couro Ebony e Dapple Grey texturizado. Som Meridian. Pacote R Dynamic Black. Rodas aro 22. Cor preta. Quilometragem de 39.600 km.', 330000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER RANGE ROVER SPORT P400E HSE 2021', 'Ano: 2020/2021. Híbrido com 389 HP. 5 lugares. Interior em couro Ivory e Ebony. Som Meridian. Alerta de ponto cego. Rodas aro 21. Cor cinza. Quilometragem de 19.500 km.', 420000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('LAND ROVER DEFENDER 110 SE', 'Ano: 2021/2022. Motor 2.0 Turbo com 295 HP. 7 lugares. Interior em couro Ebony, detalhes em light grey e preto brilhante. Som Meridian. Alerta de ponto cego. Rodas aro 20. Cor preta. Quilometragem de 29.500 km.', 440000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('MERCEDES BENZ GLE53 AMG', 'Ano: 2022/2022. Motor 3.0 Turbo com 429 HP. 7 lugares. Interior em couro preto e acabamentos internos em madeira e preto brilhante. Som Burmester. Câmera 360. Rodas aro 21. Cor Mojave Silver. Quilometragem de 19.900 km.', 590000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 718 BOXTER', 'Ano: 2018/2019. Cor: Jet Black. Motor 2.0 turbo com 295 HP. 14.400 km rodados. 2 lugares. Interior bicolor em preto e vermelho. Sistema de escapamento esportivo. Seletor de modos de condução. Rodas aro 20 Carrera S em preto acetinado.', 440000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 718 CAYMAN', 'Ano: 2023/2024. Cor: Jet Black. Motor 2.0 turbo com 295 HP. 8.600 km rodados. 2 lugares. Interior em couro total preto. Sistema de som Bose. Sistema de escapamento esportivo. Rodas aro 20 em preto brilhante.', 590000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA', 'Ano: 2020/2021. Cor: Giz. Motor 3.0 biturbo com 379 HP. 9.300 km rodados. 4 lugares. Interior em couro vermelho Bordeaux. Sistema de som Bose. Sistema de escapamento esportivo. Rodas aro 20 e 21 diamantadas.', 750000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 CARRERA GTS', 'Ano: 2022/2022. Cor: Cinza Ágata. Motor 3.0 biturbo com 473 HP. 5.200 km rodados. 4 lugares. Interior pacote GTS e couro total preto. Sistema de som Bose. Volante GT em couro. Rodas aro 20 e 21 Turbo S de cubo rápido.', 900000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1),

('PORSCHE 911 TARGA 4 GTS', 'Ano: 2023/2024. Cor: Jet Black Metallic. Motor 3.0 biturbo com 473 HP. 11.400 km rodados. 4 lugares. Interior pacote GTS e carbono fosco. Sistema de som Bose. Bancos em Alcântara com costuras vermelhas. Rodas aro 20 e 21 Turbo S.', 1200000.00, NULL, '21d928cb-22b5-440b-b949-a7ac226dd422', NULL, NULL, true, false, 1);
